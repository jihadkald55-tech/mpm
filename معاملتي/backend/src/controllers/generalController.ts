import { Response } from 'express';
import { query } from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getProvinces = async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      'SELECT * FROM provinces WHERE is_active = true ORDER BY name_ar'
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get provinces error:', error);
    res.status(500).json({
      success: false,
      error: 'حدث خطأ أثناء جلب المحافظات'
    });
  }
};

export const getDepartments = async (req: AuthRequest, res: Response) => {
  try {
    const { province_id, type } = req.query;

    let queryText = 'SELECT d.*, p.name_ar as province_name FROM departments d JOIN provinces p ON d.province_id = p.id WHERE d.is_active = true';
    const params: any[] = [];
    let paramCount = 0;

    if (province_id) {
      queryText += ` AND d.province_id = $${++paramCount}`;
      params.push(province_id);
    }

    if (type) {
      queryText += ` AND d.type = $${++paramCount}`;
      params.push(type);
    }

    queryText += ' ORDER BY d.name_ar';

    const result = await query(queryText, params);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({
      success: false,
      error: 'حدث خطأ أثناء جلب الدوائر'
    });
  }
};

export const getTransactionTypes = async (req: AuthRequest, res: Response) => {
  try {
    const { department_type } = req.query;

    let queryText = 'SELECT * FROM transaction_types WHERE is_active = true';
    const params: any[] = [];

    if (department_type) {
      queryText += ' AND department_type = $1';
      params.push(department_type);
    }

    queryText += ' ORDER BY name_ar';

    const result = await query(queryText, params);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get transaction types error:', error);
    res.status(500).json({
      success: false,
      error: 'حدث خطأ أثناء جلب أنواع المعاملات'
    });
  }
};

export const getRejectionReasons = async (req: AuthRequest, res: Response) => {
  try {
    const { category } = req.query;

    let queryText = 'SELECT * FROM rejection_reasons WHERE is_active = true';
    const params: any[] = [];

    if (category) {
      queryText += ' AND category = $1';
      params.push(category);
    }

    queryText += ' ORDER BY category, reason_ar';

    const result = await query(queryText, params);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get rejection reasons error:', error);
    res.status(500).json({
      success: false,
      error: 'حدث خطأ أثناء جلب أسباب الرفض'
    });
  }
};

export const getStatistics = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const userRole = req.user!.role;

    let stats: any = {};

    if (userRole === 'citizen') {
      // Citizen statistics
      const result = await query(
        `SELECT 
          COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft,
          COUNT(CASE WHEN status = 'submitted' THEN 1 END) as submitted,
          COUNT(CASE WHEN status = 'under_review' THEN 1 END) as under_review,
          COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved,
          COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
          COUNT(*) as total
        FROM transactions
        WHERE citizen_id = $1`,
        [userId]
      );
      stats = result.rows[0];
    } else if (userRole === 'government_employee') {
      // Employee statistics
      const result = await query(
        `SELECT 
          COUNT(CASE WHEN status = 'submitted' THEN 1 END) as pending,
          COUNT(CASE WHEN status = 'under_review' AND assigned_to = $1 THEN 1 END) as my_reviews,
          COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved,
          COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected,
          COUNT(*) as total
        FROM transactions
        WHERE assigned_to = $1 OR department_id IN (
          SELECT department_id FROM transactions WHERE assigned_to = $1 LIMIT 1
        )`,
        [userId]
      );
      stats = result.rows[0];
    } else if (userRole === 'admin' || userRole === 'supervisor') {
      // Admin/Supervisor statistics
      const result = await query(
        `SELECT 
          COUNT(CASE WHEN status = 'submitted' THEN 1 END) as submitted,
          COUNT(CASE WHEN status = 'under_review' THEN 1 END) as under_review,
          COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved,
          COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
          COUNT(*) as total
        FROM transactions`
      );
      stats = result.rows[0];

      // Add user counts
      const userResult = await query(
        `SELECT 
          COUNT(CASE WHEN role = 'citizen' THEN 1 END) as citizens,
          COUNT(CASE WHEN role = 'government_employee' THEN 1 END) as employees,
          COUNT(CASE WHEN role = 'legal_advisor' THEN 1 END) as advisors,
          COUNT(*) as total_users
        FROM users`
      );
      stats = { ...stats, ...userResult.rows[0] };
    }

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      success: false,
      error: 'حدث خطأ أثناء جلب الإحصائيات'
    });
  }
};
