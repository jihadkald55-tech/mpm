import { body, ValidationChain } from 'express-validator';

export const registerValidation: ValidationChain[] = [
  body('email')
    .isEmail()
    .withMessage('البريد الإلكتروني غير صالح')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('كلمة المرور يجب أن تحتوي على حرف كبير، حرف صغير، رقم، ورمز خاص'),
  body('full_name')
    .trim()
    .isLength({ min: 3 })
    .withMessage('الاسم الكامل يجب أن يكون 3 أحرف على الأقل'),
  body('role')
    .isIn(['citizen', 'government_employee', 'legal_advisor', 'supervisor', 'admin'])
    .withMessage('نوع المستخدم غير صالح'),
  body('phone')
    .optional()
    .matches(/^07[3-9]\d{8}$/)
    .withMessage('رقم الهاتف غير صالح (يجب أن يبدأ بـ 07)'),
];

export const loginValidation: ValidationChain[] = [
  body('email')
    .isEmail()
    .withMessage('البريد الإلكتروني غير صالح')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('كلمة المرور مطلوبة'),
];

export const createTransactionValidation: ValidationChain[] = [
  body('transaction_type_id')
    .isInt()
    .withMessage('نوع المعاملة مطلوب'),
  body('department_id')
    .isInt()
    .withMessage('الدائرة مطلوبة'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('الملاحظات طويلة جداً'),
];

export const updateTransactionValidation: ValidationChain[] = [
  body('status')
    .optional()
    .isIn(['draft', 'submitted', 'under_review', 'pending_documents', 'rejected', 'approved', 'completed', 'cancelled'])
    .withMessage('حالة المعاملة غير صالحة'),
  body('rejection_reason')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('سبب الرفض طويل جداً'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('الملاحظات طويلة جداً'),
];

export const createConsultationValidation: ValidationChain[] = [
  body('question')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('السؤال يجب أن يكون بين 10 و 2000 حرف'),
  body('transaction_id')
    .optional()
    .isUUID()
    .withMessage('معرف المعاملة غير صالح'),
];
