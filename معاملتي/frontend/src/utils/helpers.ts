import { TransactionStatus } from '../types';

export const getStatusText = (status: TransactionStatus): string => {
  const statusMap: Record<TransactionStatus, string> = {
    draft: 'مسودة',
    submitted: 'مقدمة',
    under_review: 'قيد المراجعة',
    pending_documents: 'بانتظار المستندات',
    rejected: 'مرفوضة',
    approved: 'موافق عليها',
    completed: 'مكتملة',
    cancelled: 'ملغاة',
  };
  return statusMap[status] || status;
};

export const getStatusColor = (status: TransactionStatus): string => {
  const colorMap: Record<TransactionStatus, string> = {
    draft: 'badge-gray',
    submitted: 'badge-info',
    under_review: 'badge-warning',
    pending_documents: 'badge-warning',
    rejected: 'badge-danger',
    approved: 'badge-success',
    completed: 'badge-success',
    cancelled: 'badge-gray',
  };
  return colorMap[status] || 'badge-gray';
};

export const formatDate = (date: string | Date | undefined): string => {
  if (!date) return '-';
  
  const d = new Date(date);
  return new Intl.DateTimeFormat('ar-IQ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
};

export const formatDateShort = (date: string | Date | undefined): string => {
  if (!date) return '-';
  
  const d = new Date(date);
  return new Intl.DateTimeFormat('ar-IQ', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ar-IQ', {
    style: 'decimal',
    minimumFractionDigits: 0,
  }).format(amount) + ' د.ع';
};

export const getRoleText = (role: string): string => {
  const roleMap: Record<string, string> = {
    citizen: 'مواطن',
    government_employee: 'موظف حكومي',
    legal_advisor: 'مستشار قانوني',
    supervisor: 'مشرف',
    admin: 'مدير النظام',
  };
  return roleMap[role] || role;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const downloadFile = (url: string, filename: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
