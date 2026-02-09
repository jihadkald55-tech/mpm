import { v4 as uuidv4 } from 'uuid';

export const generateTrackingNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `TXN-${timestamp}-${random}`;
};

export const generateReference = (prefix: string = 'REF'): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

export const sanitizeFilename = (filename: string): string => {
  // Remove any path traversal attempts
  const safeName = filename.replace(/\.\./g, '').replace(/[\/\\]/g, '');
  
  // Generate unique filename
  const ext = safeName.substring(safeName.lastIndexOf('.'));
  const name = safeName.substring(0, safeName.lastIndexOf('.'));
  const uuid = uuidv4().substring(0, 8);
  const timestamp = Date.now();
  
  return `${name}-${timestamp}-${uuid}${ext}`;
};

export const formatCurrency = (amount: number, currency: string = 'IQD'): string => {
  return new Intl.NumberFormat('ar-IQ', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount);
};

export const calculateEstimatedDate = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

export const getPagination = (page: number = 1, limit: number = 10) => {
  const offset = (page - 1) * limit;
  return {
    limit,
    offset,
    page
  };
};

export const getPaginationMeta = (total: number, page: number, limit: number) => {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
  };
};
