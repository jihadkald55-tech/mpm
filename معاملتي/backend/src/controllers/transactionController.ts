import { Response } from 'express';
import { validationResult } from 'express-validator';
import { query } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { TransactionCreate, TransactionUpdate } from '../types';
import { generateTrackingNumber, getPagination, getPaginationMeta } from '../utils/helpers';
import { sendTransactionStatusEmail } from '../utils/email';

export const createTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const data: TransactionCreate = req.body;
    const citizenId = req.user!.userId;

    const tracking_number = generateTrackingNumber();

    const result = await query(
      `INSERT INTO transactions (
        citizen_id, transaction_type_id, department_id, tracking_number, 
        notes, data, is_priority_service, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'draft')
      RETURNING *`,
      [
        citizenId,
        data.transaction_type_id,
        data.department_id,
        tracking_number,
        data.notes || null,
        data.data ? JSON.stringify(data.data) : null,
        data.is_priority_service || false
      ]
    );

    const transaction = result.rows[0];

    // Create notification
    await query(
      `INSERT INTO notifications (user_id, type, title, message, link)
       VALUES ($1, 'transaction', 'معاملة جديدة', 'تم إنشاء معاملة جديدة برقم ${tracking_number}', '/transactions/${transaction.id}')`,
      [citizenId]
    );

    res.status(201).json({
      success: true,
      message: 'تم إنشاء المعاملة بنجاح',
      data: transaction
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({
      success: false,
      error: 'حدث خطأ أثناء إنشاء المعاملة'
    });
  }
};

export const submitTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    // Check if transaction exists and belongs to user
    const checkResult = await query(
      'SELECT * FROM transactions WHERE id = $1 AND citizen_id = $2',
      [id, userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'المعاملة غير موجودة'
      });
    }

    const transaction = checkResult.rows[0];

    if (transaction.status !== 'draft') {
      return res.status(400).json({
        success: false,
        error: 'لا يمكن تقديم هذه المعاملة'
      });
    }

    // Update transaction status
    const result = await query(
      `UPDATE transactions 
       SET status = 'submitted', submission_date = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    // Add to history
    await query(
      `INSERT INTO transaction_history (transaction_id, user_id, action, old_status, new_status)
       VALUES ($1, $2, 'تقديم المعاملة', 'draft', 'submitted')`,
      [id, userId]
    );

    // Create notification
    await query(
      `INSERT INTO notifications (user_id, type, title, message, link)
       VALUES ($1, 'transaction', 'تم تقديم المعاملة', 'تم تقديم معاملتك برقم ${transaction.tracking_number}', '/transactions/${id}')`,
      [userId]
    );

    res.json({
      success: true,
      message: 'تم تقديم المعاملة بنجاح',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Submit transaction error:', error);
    res.status(500).json({
      success: false,
      error: 'حدث خطأ أثناء تقديم المعاملة'
    });
  }
};

export const getTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const userRole = req.user!.role;

    let queryText = `
      SELECT t.*, 
             tt.name_ar as transaction_type_name,
             tt.estimated_days,
             d.name_ar as department_name,
             u.full_name as citizen_name,
             assigned.full_name as assigned_to_name
      FROM transactions t
      JOIN transaction_types tt ON t.transaction_type_id = tt.id
      JOIN departments d ON t.department_id = d.id
      JOIN users u ON t.citizen_id = u.id
      LEFT JOIN users assigned ON t.assigned_to = assigned.id
      WHERE t.id = $1
    `;

    const params = [id];

    // Citizens can only see their own transactions
    if (userRole === 'citizen') {
      queryText += ' AND t.citizen_id = $2';
      params.push(userId);
    }

    const result = await query(queryText, params);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'المعاملة غير موجودة'
      });
    }

    // Get documents
    const documents = await query(
      'SELECT * FROM transaction_documents WHERE transaction_id = $1 ORDER BY created_at DESC',
      [id]
    );

    // Get history
    const history = await query(
      `SELECT th.*, u.full_name as user_name
       FROM transaction_history th
       LEFT JOIN users u ON th.user_id = u.id
       WHERE th.transaction_id = $1
       ORDER BY th.created_at DESC`,
      [id]
    );

    const transaction = {
      ...result.rows[0],
      documents: documents.rows,
      history: history.rows
    };

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({
      success: false,
      error: 'حدث خطأ أثناء جلب المعاملة'
    });
  }
};

export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, status, department_id } = req.query;
    const userId = req.user!.userId;
    const userRole = req.user!.role;

    const { offset, limit: queryLimit } = getPagination(Number(page), Number(limit));

    let whereConditions = [];
    let params: any[] = [];
    let paramCount = 0;

    // Role-based filtering
    if (userRole === 'citizen') {
      whereConditions.push(`t.citizen_id = $${++paramCount}`);
      params.push(userId);
    } else if (userRole === 'government_employee') {
      whereConditions.push(`(t.assigned_to = $${++paramCount} OR t.department_id IN (
        SELECT id FROM departments WHERE province_id IN (
          SELECT province_id FROM departments d2 
          JOIN transactions t2 ON d2.id = t2.department_id 
          WHERE t2.assigned_to = $${paramCount}
          LIMIT 1
        )
      ))`);
      params.push(userId);
    }

    // Status filter
    if (status) {
      whereConditions.push(`t.status = $${++paramCount}`);
      params.push(status);
    }

    // Department filter
    if (department_id) {
      whereConditions.push(`t.department_id = $${++paramCount}`);
      params.push(department_id);
    }

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM transactions t ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    // Get transactions
    const result = await query(
      `SELECT t.*, 
              tt.name_ar as transaction_type_name,
              d.name_ar as department_name,
              u.full_name as citizen_name
       FROM transactions t
       JOIN transaction_types tt ON t.transaction_type_id = tt.id
       JOIN departments d ON t.department_id = d.id
       JOIN users u ON t.citizen_id = u.id
       ${whereClause}
       ORDER BY t.created_at DESC
       LIMIT $${++paramCount} OFFSET $${++paramCount}`,
      [...params, queryLimit, offset]
    );

    res.json({
      success: true,
      data: result.rows,
      pagination: getPaginationMeta(total, Number(page), Number(limit))
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      error: 'حدث خطأ أثناء جلب المعاملات'
    });
  }
};

export const updateTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const userRole = req.user!.role;
    const updates: TransactionUpdate = req.body;

    // Check permissions
    if (userRole === 'citizen') {
      return res.status(403).json({
        success: false,
        error: 'ليس لديك صلاحية لتحديث المعاملة'
      });
    }

    // Get current transaction
    const current = await query('SELECT * FROM transactions WHERE id = $1', [id]);
    
    if (current.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'المعاملة غير موجودة'
      });
    }

    const oldTransaction = current.rows[0];

    // Build update query
    const updateFields = [];
    const params = [];
    let paramCount = 0;

    if (updates.status) {
      updateFields.push(`status = $${++paramCount}`);
      params.push(updates.status);

      if (updates.status === 'under_review') {
        updateFields.push(`review_start_date = CURRENT_TIMESTAMP`);
      } else if (updates.status === 'completed') {
        updateFields.push(`completion_date = CURRENT_TIMESTAMP`);
      } else if (updates.status === 'rejected') {
        updateFields.push(`rejection_date = CURRENT_TIMESTAMP`);
      }
    }

    if (updates.rejection_reason !== undefined) {
      updateFields.push(`rejection_reason = $${++paramCount}`);
      params.push(updates.rejection_reason);
    }

    if (updates.rejection_category !== undefined) {
      updateFields.push(`rejection_category = $${++paramCount}`);
      params.push(updates.rejection_category);
    }

    if (updates.internal_notes !== undefined) {
      updateFields.push(`internal_notes = $${++paramCount}`);
      params.push(updates.internal_notes);
    }

    if (updates.assigned_to !== undefined) {
      updateFields.push(`assigned_to = $${++paramCount}`);
      params.push(updates.assigned_to);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'لا يوجد حقول للتحديث'
      });
    }

    params.push(id);

    const result = await query(
      `UPDATE transactions SET ${updateFields.join(', ')} WHERE id = $${++paramCount} RETURNING *`,
      params
    );

    const newTransaction = result.rows[0];

    // Add to history
    await query(
      `INSERT INTO transaction_history (transaction_id, user_id, action, old_status, new_status, changes)
       VALUES ($1, $2, 'تحديث المعاملة', $3, $4, $5)`,
      [id, userId, oldTransaction.status, newTransaction.status, JSON.stringify(updates)]
    );

    // Send notification to citizen
    if (updates.status && updates.status !== oldTransaction.status) {
      await query(
        `INSERT INTO notifications (user_id, type, title, message, link)
         VALUES ($1, 'transaction', 'تحديث حالة المعاملة', 'تم تحديث حالة معاملتك', '/transactions/${id}')`,
        [oldTransaction.citizen_id]
      );
    }

    res.json({
      success: true,
      message: 'تم تحديث المعاملة بنجاح',
      data: newTransaction
    });
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({
      success: false,
      error: 'حدث خطأ أثناء تحديث المعاملة'
    });
  }
};

export const deleteTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const userRole = req.user!.role;

    // Check if transaction exists
    const checkResult = await query(
      'SELECT * FROM transactions WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'المعاملة غير موجودة'
      });
    }

    const transaction = checkResult.rows[0];

    // Only citizens can delete their own draft transactions
    if (userRole === 'citizen') {
      if (transaction.citizen_id !== userId || transaction.status !== 'draft') {
        return res.status(403).json({
          success: false,
          error: 'لا يمكن حذف هذه المعاملة'
        });
      }
    } else if (userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'ليس لديك صلاحية لحذف المعاملة'
      });
    }

    await query('DELETE FROM transactions WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'تم حذف المعاملة بنجاح'
    });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({
      success: false,
      error: 'حدث خطأ أثناء حذف المعاملة'
    });
  }
};
