// User types
export type UserRole = 'citizen' | 'government_employee' | 'legal_advisor' | 'supervisor' | 'admin';

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  id_number?: string;
  province?: string;
  city?: string;
  address?: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  last_login?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
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

export interface AuthResponse {
  user: User;
  token: string;
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

export interface Transaction {
  id: string;
  citizen_id: string;
  transaction_type_id: number;
  transaction_type_name: string;
  department_id: number;
  department_name: string;
  status: TransactionStatus;
  priority: string;
  is_priority_service: boolean;
  submission_date?: string;
  review_start_date?: string;
  completion_date?: string;
  rejection_date?: string;
  rejection_reason?: string;
  rejection_category?: string;
  notes?: string;
  internal_notes?: string;
  tracking_number: string;
  assigned_to?: string;
  assigned_to_name?: string;
  citizen_name?: string;
  estimated_days?: number;
  data?: any;
  created_at: string;
  updated_at: string;
  documents?: TransactionDocument[];
  history?: TransactionHistory[];
}

export interface TransactionCreate {
  transaction_type_id: number;
  department_id: number;
  notes?: string;
  data?: any;
  is_priority_service?: boolean;
}

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
  verification_date?: string;
  notes?: string;
  created_at: string;
}

export interface TransactionHistory {
  id: number;
  transaction_id: string;
  user_id?: string;
  user_name?: string;
  action: string;
  old_status?: string;
  new_status?: string;
  changes?: any;
  notes?: string;
  created_at: string;
}

// General data types
export interface Province {
  id: number;
  name_ar: string;
  name_en: string;
  code: string;
  is_active: boolean;
}

export interface Department {
  id: number;
  name_ar: string;
  name_en: string;
  type: string;
  province_id: number;
  province_name?: string;
  description?: string;
  contact_phone?: string;
  contact_email?: string;
  address?: string;
  is_active: boolean;
}

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
}

export interface RejectionReason {
  id: number;
  category: string;
  reason_ar: string;
  reason_en: string;
  solution_ar?: string;
  solution_en?: string;
  is_active: boolean;
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
  read_at?: string;
  created_at: string;
}

// Statistics types
export interface Statistics {
  draft?: number;
  submitted?: number;
  under_review?: number;
  approved?: number;
  rejected?: number;
  completed?: number;
  pending?: number;
  my_reviews?: number;
  total?: number;
  citizens?: number;
  employees?: number;
  advisors?: number;
  total_users?: number;
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
