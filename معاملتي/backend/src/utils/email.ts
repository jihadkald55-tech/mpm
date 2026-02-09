import nodemailer from 'nodemailer';
import { User, Transaction } from '../types';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
): Promise<boolean> => {
  try {
    if (!process.env.SMTP_USER) {
      console.log('Email sending disabled (SMTP not configured)');
      return false;
    }

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@moamalaty.iq',
      to,
      subject,
      html,
    });
    
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

export const sendWelcomeEmail = async (user: User): Promise<boolean> => {
  const subject = 'مرحباً بك في منصة معاملتي';
  const html = `
    <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1e40af;">مرحباً ${user.full_name}</h2>
      <p>نشكرك على التسجيل في منصة معاملتي.</p>
      <p>منصتنا تساعدك على إدارة ومتابعة معاملاتك الحكومية بكل سهولة.</p>
      <p>يمكنك الآن:</p>
      <ul>
        <li>رفع المعاملات الجديدة</li>
        <li>متابعة حالة معاملاتك</li>
        <li>الحصول على استشارات قانونية</li>
        <li>التواصل مع الدوائر الحكومية</li>
      </ul>
      <p style="margin-top: 30px;">مع تحيات،<br/>فريق معاملتي</p>
    </div>
  `;
  
  return await sendEmail(user.email, subject, html);
};

export const sendTransactionStatusEmail = async (
  user: User,
  transaction: Transaction,
  transactionType: string
): Promise<boolean> => {
  let subject = '';
  let message = '';
  
  switch (transaction.status) {
    case 'submitted':
      subject = 'تم استلام معاملتك';
      message = `تم استلام معاملتك "${transactionType}" بنجاح. رقم المتابعة: ${transaction.tracking_number}`;
      break;
    case 'under_review':
      subject = 'معاملتك قيد المراجعة';
      message = `معاملتك "${transactionType}" قيد المراجعة من قبل الدائرة المختصة.`;
      break;
    case 'approved':
      subject = 'تمت الموافقة على معاملتك';
      message = `تمت الموافقة على معاملتك "${transactionType}". يمكنك متابعة الإجراءات النهائية.`;
      break;
    case 'rejected':
      subject = 'تم رفض معاملتك';
      message = `تم رفض معاملتك "${transactionType}". السبب: ${transaction.rejection_reason}`;
      break;
    case 'completed':
      subject = 'اكتملت معاملتك';
      message = `اكتملت معاملتك "${transactionType}" بنجاح!`;
      break;
    default:
      return false;
  }
  
  const html = `
    <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1e40af;">${subject}</h2>
      <p>عزيزي ${user.full_name},</p>
      <p>${message}</p>
      <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>رقم المتابعة:</strong> ${transaction.tracking_number}</p>
        <p><strong>نوع المعاملة:</strong> ${transactionType}</p>
        <p><strong>الحالة:</strong> ${getStatusText(transaction.status)}</p>
      </div>
      <p>يمكنك متابعة تفاصيل معاملتك من خلال لوحة التحكم.</p>
      <p style="margin-top: 30px;">مع تحيات،<br/>فريق معاملتي</p>
    </div>
  `;
  
  return await sendEmail(user.email, subject, html);
};

export const sendConsultationReplyEmail = async (
  user: User,
  question: string,
  answer: string
): Promise<boolean> => {
  const subject = 'تم الرد على استشارتك القانونية';
  const html = `
    <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1e40af;">تم الرد على استشارتك</h2>
      <p>عزيزي ${user.full_name},</p>
      <p>تم الرد على استشارتك القانونية من قبل مستشار قانوني متخصص.</p>
      <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>سؤالك:</strong></p>
        <p>${question}</p>
        <hr style="border: 0; border-top: 1px solid #ddd; margin: 15px 0;">
        <p><strong>الرد:</strong></p>
        <p>${answer}</p>
      </div>
      <p>يمكنك مراجعة الاستشارة كاملة من خلال لوحة التحكم.</p>
      <p style="margin-top: 30px;">مع تحيات،<br/>فريق معاملتي</p>
    </div>
  `;
  
  return await sendEmail(user.email, subject, html);
};

const getStatusText = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    'draft': 'مسودة',
    'submitted': 'مقدمة',
    'under_review': 'قيد المراجعة',
    'pending_documents': 'بانتظار المستندات',
    'rejected': 'مرفوضة',
    'approved': 'موافق عليها',
    'completed': 'مكتملة',
    'cancelled': 'ملغاة'
  };
  
  return statusMap[status] || status;
};
