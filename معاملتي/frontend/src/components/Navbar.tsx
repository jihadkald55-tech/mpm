import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Bell, LogOut, User, Menu, X, FileText, LayoutDashboard } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <nav className="bg-dark-900 border-b border-dark-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 space-x-reverse">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">معاملتي</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 space-x-reverse">
            <Link to="/dashboard" className="flex items-center space-x-2 space-x-reverse text-gray-300 hover:text-white transition">
              <LayoutDashboard className="w-5 h-5" />
              <span>لوحة التحكم</span>
            </Link>
            <Link to="/transactions" className="flex items-center space-x-2 space-x-reverse text-gray-300 hover:text-white transition">
              <FileText className="w-5 h-5" />
              <span>المعاملات</span>
            </Link>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4 space-x-reverse">
            <Link to="/notifications" className="relative p-2 text-gray-400 hover:text-white transition">
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </Link>
            
            <Link to="/profile" className="flex items-center space-x-2 space-x-reverse text-gray-300 hover:text-white transition">
              <User className="w-5 h-5" />
              <span>{user?.full_name}</span>
            </Link>

            <button
              onClick={logout}
              className="flex items-center space-x-2 space-x-reverse text-red-400 hover:text-red-300 transition"
            >
              <LogOut className="w-5 h-5" />
              <span>تسجيل الخروج</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-dark-700 bg-dark-800">
          <div className="px-4 py-3 space-y-3">
            <Link
              to="/dashboard"
              className="flex items-center space-x-2 space-x-reverse text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-dark-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>لوحة التحكم</span>
            </Link>
            <Link
              to="/transactions"
              className="flex items-center space-x-2 space-x-reverse text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-dark-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FileText className="w-5 h-5" />
              <span>المعاملات</span>
            </Link>
            <Link
              to="/profile"
              className="flex items-center space-x-2 space-x-reverse text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-dark-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <User className="w-5 h-5" />
              <span>الملف الشخصي</span>
            </Link>
            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              className="flex items-center space-x-2 space-x-reverse text-red-400 hover:text-red-300 px-3 py-2 rounded-lg hover:bg-dark-700 w-full"
            >
              <LogOut className="w-5 h-5" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
