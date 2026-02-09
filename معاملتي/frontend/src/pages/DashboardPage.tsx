import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { generalService } from '../services/generalService';
import Layout from '../components/Layout';
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp,
  Users,
  Building2
} from 'lucide-react';
import { Statistics } from '../types';
import Loading from '../components/Loading';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const data = await generalService.getStatistics();
      setStats(data);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Loading text="جاري تحميل لوحة التحكم..." />
      </Layout>
    );
  }

  const renderCitizenDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="مسودات"
        value={stats?.draft || 0}
        icon={<FileText />}
        color="gray"
      />
      <StatCard
        title="قيد المراجعة"
        value={stats?.under_review || 0}
        icon={<Clock />}
        color="yellow"
      />
      <StatCard
        title="موافق عليها"
        value={stats?.approved || 0}
        icon={<CheckCircle />}
        color="green"
      />
      <StatCard
        title="مرفوضة"
        value={stats?.rejected || 0}
        icon={<XCircle />}
        color="red"
      />
    </div>
  );

  const renderEmployeeDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <StatCard
        title="معاملات جديدة"
        value={stats?.pending || 0}
        icon={<FileText />}
        color="blue"
      />
      <StatCard
        title="المعاملات المسندة لي"
        value={stats?.my_reviews || 0}
        icon={<Clock />}
        color="yellow"
      />
      <StatCard
        title="الإجمالي"
        value={stats?.total || 0}
        icon={<TrendingUp />}
        color="green"
      />
    </div>
  );

  const renderAdminDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="معاملات مقدمة"
          value={stats?.submitted || 0}
          icon={<FileText />}
          color="blue"
        />
        <StatCard
          title="قيد المراجعة"
          value={stats?.under_review || 0}
          icon={<Clock />}
          color="yellow"
        />
        <StatCard
          title="مكتملة"
          value={stats?.completed || 0}
          icon={<CheckCircle />}
          color="green"
        />
        <StatCard
          title="الإجمالي"
          value={stats?.total || 0}
          icon={<TrendingUp />}
          color="purple"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="المواطنون"
          value={stats?.citizens || 0}
          icon={<Users />}
          color="blue"
        />
        <StatCard
          title="الموظفون"
          value={stats?.employees || 0}
          icon={<Building2 />}
          color="green"
        />
        <StatCard
          title="المستشارون القانونيون"
          value={stats?.advisors || 0}
          icon={<Users />}
          color="purple"
        />
      </div>
    </>
  );

  return (
    <Layout>
      <div className="animate-fadeIn">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            مرحباً، {user?.full_name}
          </h1>
          <p className="text-gray-400">
            {user?.role === 'citizen' && 'هنا يمكنك متابعة معاملاتك ورفع معاملات جديدة'}
            {user?.role === 'government_employee' && 'هنا يمكنك مراجعة المعاملات المسندة لك'}
            {user?.role === 'admin' && 'لوحة التحكم الشاملة للمنصة'}
            {user?.role === 'supervisor' && 'لوحة المراقبة والإشراف'}
          </p>
        </div>

        {/* Statistics */}
        {user?.role === 'citizen' && renderCitizenDashboard()}
        {user?.role === 'government_employee' && renderEmployeeDashboard()}
        {(user?.role === 'admin' || user?.role === 'supervisor') && renderAdminDashboard()}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user?.role === 'citizen' && (
            <>
              <QuickAction
                title="معاملة جديدة"
                description="ابدأ معاملة حكومية جديدة"
                link="/transactions/new"
                icon={<FileText className="w-8 h-8" />}
                color="blue"
              />
              <QuickAction
                title="معاملاتي"
                description="تصفح جميع معاملاتك"
                link="/transactions"
                icon={<FileText className="w-8 h-8" />}
                color="green"
              />
            </>
          )}
          
          {user?.role !== 'citizen' && (
            <QuickAction
              title="جميع المعاملات"
              description="عرض وإدارة المعاملات"
              link="/transactions"
              icon={<FileText className="w-8 h-8" />}
              color="blue"
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'from-blue-600 to-blue-700',
    green: 'from-green-600 to-green-700',
    red: 'from-red-600 to-red-700',
    yellow: 'from-yellow-600 to-yellow-700',
    purple: 'from-purple-600 to-purple-700',
    gray: 'from-gray-600 to-gray-700',
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div className={`w-14 h-14 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center text-white`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

interface QuickActionProps {
  title: string;
  description: string;
  link: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple';
}

const QuickAction: React.FC<QuickActionProps> = ({ title, description, link, icon, color }) => {
  const colorClasses = {
    blue: 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
    green: 'from-green-600 to-green-700 hover:from-green-700 hover:to-green-800',
    purple: 'from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800',
  };

  return (
    <Link
      to={link}
      className={`card bg-gradient-to-br ${colorClasses[color]} border-0 hover:scale-105 transition-all cursor-pointer`}
    >
      <div className="flex items-center gap-4">
        <div className="text-white/90">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
          <p className="text-white/80 text-sm">{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default DashboardPage;
