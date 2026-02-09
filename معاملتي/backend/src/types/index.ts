// User types
export type UserRole = 'citizen' | 'government_employee' | 'legal_advisor' | 'supervisor' | 'admin';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  id_number?: string;
  province?: string;
  city?: string;
  address?: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: Date;
  updated_at: Date;
  last_login?: Date;
}

export interface UserRegistration {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  id_number?: string;
  province?: string;
  city?: string;
  address?: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

// Transaction types
export type TransactionStatus = 
  | 'draft' 
  | 'submitted' 
  | 'under_review' 
  | 'pending_documents' 
  | 'rejected' 
  | 'approved' 
  | 'completed' 
  | 'cancelled';

export type TransactionPriority = 'normal' | 'high' | 'urgent';

export interface Transaction {
  id: string;
  citizen_id: string;
  transaction_type_id: number;
  department_id: number;
  status: TransactionStatus;
  priority: TransactionPriority;
  is_priority_service: boolean;
  submission_date?: Date;
  review_start_date?: Date;
  completion_date?: Date;
  rejection_date?: Date;
  rejection_reason?: string;
  rejection_category?: string;
  notes?: string;
  internal_notes?: string;
  tracking_number: string;
  assigned_to?: string;
  data?: any;
  created_at: Date;
  updated_at: Date;
}

export interface TransactionCreate {
  transaction_type_id: number;
  department_id: number;
  notes?: string;
  data?: any;
  is_priority_service?: boolean;
}

export interface TransactionUpdate {
  status?: TransactionStatus;
  rejection_reason?: string;
  rejection_category?: string;
  notes?: string;
  internal_notes?: string;
  assigned_to?: string;
  data?: any;
}

// Department types
export interface Department {
  id: number;
  name_ar: string;
  name_en: string;
  type: string;
  province_id: number;
  description?: string;
  contact_phone?: string;
  contact_email?: string;
  address?: string;
  is_active: boolean;
  created_at: Date;
}

// Transaction type
export interface TransactionType {
  id: number;
  name_ar: string;
  name_en: string;
  description?: string;
  department_type: string;
  required_documents: string[];
  base_price: number;
  estimated_days: number;
  is_active: boolean;
  created_at: Date;
}

// Document types
export interface TransactionDocument {
  id: string;
  transaction_id: string;
  document_type: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  uploaded_by: string;
  is_verified: boolean;
  verified_by?: string;
  verification_date?: Date;
  notes?: string;
  created_at: Date;
}

// Legal consultation types
export type ConsultationStatus = 'pending' | 'in_progress' | 'answered' | 'closed';

export interface LegalConsultation {
  id: string;
  citizen_id: string;
  transaction_id?: string;
  advisor_id?: string;
  question: string;
  answer?: string;
  status: ConsultationStatus;
  is_paid: boolean;
  price?: number;
  priority: string;
  created_at: Date;
  answered_at?: Date;
  updated_at: Date;
}

export interface ConsultationCreate {
  transaction_id?: string;
  question: string;
  priority?: string;
}

// Notification types
export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  read_at?: Date;
  created_at: Date;
}

// Province types
export interface Province {
  id: number;
  name_ar: string;
  name_en: string;
  code: string;
  is_active: boolean;
}

// Rejection reason types
export interface RejectionReason {
  id: number;
  category: string;
  reason_ar: string;
  reason_en: string;
  solution_ar?: string;
  solution_en?: string;
  is_active: boolean;
}

// Payment types
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Payment {
  id: string;
  user_id: string;
  transaction_id?: string;
  consultation_id?: string;
  service_type: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_method?: string;
  payment_reference?: string;
  created_at: Date;
  completed_at?: Date;
}

// Audit log types
export interface AuditLog {
  id: number;
  user_id?: string;
  action: string;
  entity_type?: string;
  entity_id?: string;
  details?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: Date;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: any[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// JWT Payload
export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
}

// Request with user
export interface AuthRequest extends Request {
  user?: JWTPayload;
}
