import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { transactionService } from '../services/transactionService';
import Layout from '../components/Layout';
import Loading from '../components/Loading';
import { Transaction } from '../types';
import { getStatusText, getStatusColor, formatDateShort } from '../utils/helpers';
import { Plus, Search, FileText, Eye } from 'lucide-react';

const TransactionsPage: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadTransactions();
  }, [statusFilter]);

  const loadTransactions = async () => {
    try {
      const response = await transactionService.getAll({
        page: 1,
        limit: 50,
        status: statusFilter || undefined,
      });
      setTransactions(response.data || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter((t) =>
    t.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.transaction_type_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Layout>
        <Loading text="جاري تحميل المعاملات..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">المعاملات</h1>
            <p className="text-gray-400">إدارة ومتابعة جميع المعاملات</p>
          </div>
          
          {user?.role === 'citizen' && (
            <Link to="/transactions/new" className="btn-primary flex items-center gap-2">
              <Plus className="w-5 h-5" />
              <span>معاملة جديدة</span>
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="بحث برقم المتابعة أو نوع المعاملة..."
                className="input pr-10"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="">جميع الحالات</option>
              <option value="draft">مسودة</option>
              <option value="submitted">مقدمة</option>
              <option value="under_review">قيد المراجعة</option>
              <option value="pending_documents">بانتظار المستندات</option>
              <option value="rejected">مرفوضة</option>
              <option value="approved">موافق عليها</option>
              <option value="completed">مكتملة</option>
            </select>
          </div>
        </div>

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <div className="card text-center py-12">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">لا توجد معاملات</h3>
            <p className="text-gray-500 mb-6">
              {user?.role === 'citizen'
                ? 'لم تقم بإنشاء أي معاملات بعد'
                : 'لا توجد معاملات متاحة'}
            </p>
            {user?.role === 'citizen' && (
              <Link to="/transactions/new" className="btn-primary mx-auto">
                إنشاء معاملة جديدة
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredTransactions.map((transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

interface TransactionCardProps {
  transaction: Transaction;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => {
  return (
    <Link to={`/transactions/${transaction.id}`} className="card hover:border-primary-600 transition-all">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-white">
              {transaction.transaction_type_name}
            </h3>
            <span className={`badge ${getStatusColor(transaction.status)}`}>
              {getStatusText(transaction.status)}
            </span>
          </div>
          
          <div className="space-y-1 text-sm text-gray-400">
            <p>
              <span className="font-medium">رقم المتابعة:</span> {transaction.tracking_number}
            </p>
            <p>
              <span className="font-medium">الدائرة:</span> {transaction.department_name}
            </p>
            <p>
              <span className="font-medium">تاريخ الإنشاء:</span> {formatDateShort(transaction.created_at)}
            </p>
            {transaction.citizen_name && (
              <p>
                <span className="font-medium">المواطن:</span> {transaction.citizen_name}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-primary-400">
          <Eye className="w-5 h-5" />
          <span className="text-sm font-medium">عرض التفاصيل</span>
        </div>
      </div>
    </Link>
  );
};

export default TransactionsPage;
