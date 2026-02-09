import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { query } from '../config/database';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import { sendWelcomeEmail } from '../utils/email';
import { UserRegistration, UserLogin, User } from '../types';
import { AuthRequest } from '../middleware/auth';

export const register = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const userData: UserRegistration = req.body;
    
    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [userData.email]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'البريد الإلكتروني مستخدم مسبقاً'
      });
    }

    // Hash password
    const password_hash = await hashPassword(userData.password);

    // Insert user
    const result = await query(
      `INSERT INTO users (email, password_hash, full_name, phone, role, id_number, province, city, address)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, email, full_name, phone, role, created_at`,
      [
        userData.email,
        password_hash,
        userData.full_name,
        userData.phone || null,
        userData.role,
        userData.id_number || null,
        userData.province || null,
        userData.city || null,
        userData.address || null
      ]
    );

    const user = result.rows[0];

    // Send welcome email (non-blocking)
    sendWelcomeEmail(user as User).catch(err => 
      console.error('Failed to send welcome email:', err)
    );

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    res.status(201).json({
      success: true,
      message: 'تم التسجيل بنجاح',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'حدث خطأ أثناء التسجيل'
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password }: UserLogin = req.body;

    // Get user
    const result = await query(
      `SELECT id, email, password_hash, full_name, phone, role, is_active, is_verified
       FROM users WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      });
    }

    const user = result.rows[0];

    // Check if user is active
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        error: 'الحساب غير مفعل'
      });
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      });
    }

    // Update last login
    await query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    // Remove password from response
    delete user.password_hash;

    res.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'حدث خطأ أثناء تسجيل الدخول'
    });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      `SELECT id, email, full_name, phone, role, id_number, province, city, address, 
              is_active, is_verified, created_at, last_login
       FROM users WHERE id = $1`,
      [req.user!.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'المستخدم غير موجود'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'حدث خطأ أثناء جلب البيانات'
    });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { full_name, phone, province, city, address } = req.body;

    const result = await query(
      `UPDATE users 
       SET full_name = COALESCE($1, full_name),
           phone = COALESCE($2, phone),
           province = COALESCE($3, province),
           city = COALESCE($4, city),
           address = COALESCE($5, address)
       WHERE id = $6
       RETURNING id, email, full_name, phone, role, province, city, address`,
      [full_name, phone, province, city, address, req.user!.userId]
    );

    res.json({
      success: true,
      message: 'تم تحديث البيانات بنجاح',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'حدث خطأ أثناء تحديث البيانات'
    });
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { current_password, new_password } = req.body;

    // Get current password hash
    const result = await query(
      'SELECT password_hash FROM users WHERE id = $1',
      [req.user!.userId]
    );

    const user = result.rows[0];
    
    // Verify current password
    const isValid = await comparePassword(current_password, user.password_hash);
    
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: 'كلمة المرور الحالية غير صحيحة'
      });
    }

    // Hash new password
    const new_hash = await hashPassword(new_password);
    
    // Update password
    await query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [new_hash, req.user!.userId]
    );

    res.json({
      success: true,
      message: 'تم تغيير كلمة المرور بنجاح'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      error: 'حدث خطأ أثناء تغيير كلمة المرور'
    });
  }
};
