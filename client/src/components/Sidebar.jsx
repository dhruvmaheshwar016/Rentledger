import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard, Building2, Users, FileText, CreditCard,
  LogOut, ChevronRight, IndianRupee, Bell
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Properties', icon: Building2, to: '/properties' },
  { label: 'Tenants', icon: Users, to: '/tenants' },
  { label: 'Leases', icon: FileText, to: '/leases' },
  { label: 'Payments', icon: CreditCard, to: '/payments' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'RL';

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <IndianRupee size={20} color="white" />
        </div>
        <span className="sidebar-logo-text">RentLedger</span>
        <span className="sidebar-logo-badge">BETA</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <span className="sidebar-section-label">Menu</span>
        {navItems.map(({ label, icon: Icon, to }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <Icon className="sidebar-link-icon" size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.full_name}</div>
            <div className="sidebar-user-email">{user?.email}</div>
          </div>
        </div>
        <button className="sidebar-link" onClick={handleLogout} style={{ width: '100%', marginTop: 4 }}>
          <LogOut className="sidebar-link-icon" size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
