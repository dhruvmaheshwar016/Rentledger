import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import API from '../lib/api';
import {
  Building2, Users, CreditCard, TrendingUp, IndianRupee,
  AlertCircle, CheckCircle, Clock, ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState({ properties: [], tenants: [], payments: null, recentPayments: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [propRes, tenantRes, statsRes, payRes] = await Promise.all([
          API.get('/properties'),
          API.get('/tenants'),
          API.get('/payments/stats'),
          API.get('/payments?status=pending'),
        ]);
        setData({
          properties: propRes.data.properties,
          tenants: tenantRes.data.tenants,
          payments: statsRes.data.stats,
          recentPayments: payRes.data.payments.slice(0, 5),
        });
      } catch (e) { /* silent */ }
      setLoading(false);
    };
    load();
  }, []);

  const month = new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' });

  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar-title">Dashboard</div>
        </div>
        <div className="topbar-actions">
          <span style={{ fontSize: 14, color: 'var(--gray-500)' }}>{month}</span>
        </div>
      </div>

      <div className="page-content">
        {/* Greeting */}
        <div className="page-header">
          <div>
            <div className="page-header-title">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.full_name?.split(' ')[0]} 👋
            </div>
            <div className="page-header-subtitle">Here's what's happening with your properties today.</div>
          </div>
          <Link to="/properties" className="btn btn-primary btn-sm">
            <Building2 size={15} /> Add Property
          </Link>
        </div>

        {/* Stats */}
        {loading ? (
          <div className="page-loader"><div className="loading-spinner dark" style={{ width: 36, height: 36 }} /></div>
        ) : (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-card-icon blue"><Building2 size={22} /></div>
                <div className="stat-card-value">{data.properties.length}</div>
                <div className="stat-card-label">Properties</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-icon orange"><Users size={22} /></div>
                <div className="stat-card-value">{data.tenants.filter(t => t.status === 'active').length}</div>
                <div className="stat-card-label">Active Tenants</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-icon green"><IndianRupee size={22} /></div>
                <div className="stat-card-value">{data.payments ? fmt(data.payments.monthCollected) : '—'}</div>
                <div className="stat-card-label">Collected This Month</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-icon red"><AlertCircle size={22} /></div>
                <div className="stat-card-value">{data.payments?.pendingCount ?? 0}</div>
                <div className="stat-card-label">Pending Payments</div>
              </div>
            </div>

            {/* Two-col layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {/* Pending Payments */}
              <div className="card">
                <div className="card-header">
                  <span className="card-title">Pending Payments</span>
                  <Link to="/payments" className="btn btn-ghost btn-sm">View all <ArrowUpRight size={14} /></Link>
                </div>
                <div className="card-body" style={{ padding: 0 }}>
                  {data.recentPayments.length === 0 ? (
                    <div className="empty-state" style={{ padding: '32px 24px' }}>
                      <div className="empty-icon"><CheckCircle size={28} color="var(--success)" /></div>
                      <h3>All paid up! 🎉</h3>
                      <p>No pending payments this month.</p>
                    </div>
                  ) : (
                    <div className="table-wrapper">
                      <table>
                        <thead><tr><th>Tenant</th><th>Month</th><th>Amount</th><th>Status</th></tr></thead>
                        <tbody>
                          {data.recentPayments.map(p => (
                            <tr key={p.id}>
                              <td><strong>{p.tenant_name}</strong></td>
                              <td className="payment-month-label">{p.month}</td>
                              <td><strong>{fmt(p.amount)}</strong></td>
                              <td><span className="badge badge-warning"><Clock size={11} /> Pending</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card">
                <div className="card-header">
                  <span className="card-title">Quick Actions</span>
                </div>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { to: '/properties', icon: Building2, color: 'blue', label: 'Add a Property', sub: 'Register a new rental property' },
                    { to: '/tenants',    icon: Users,     color: 'orange', label: 'Add a Tenant',  sub: 'Onboard a new tenant' },
                    { to: '/leases',     icon: CreditCard, color: 'green', label: 'Create a Lease', sub: 'Set rent amount & due date' },
                    { to: '/payments',   icon: IndianRupee, color: 'purple', label: 'Record Payment', sub: 'Mark a UPI payment as received' },
                  ].map(({ to, icon: Icon, color, label, sub }) => (
                    <Link key={to} to={to} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: 'var(--gray-50)', borderRadius: 10, border: '1px solid var(--gray-200)', transition: 'all 0.2s', textDecoration: 'none' }}
                      className="quick-action-item">
                      <div className={`stat-card-icon ${color}`} style={{ width: 40, height: 40, margin: 0, borderRadius: 10 }}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--gray-800)' }}>{label}</div>
                        <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{sub}</div>
                      </div>
                      <ArrowUpRight size={16} color="var(--gray-400)" style={{ marginLeft: 'auto' }} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Properties overview */}
            {data.properties.length > 0 && (
              <div className="card" style={{ marginTop: 24 }}>
                <div className="card-header">
                  <span className="card-title">Your Properties</span>
                  <Link to="/properties" className="btn btn-ghost btn-sm">Manage <ArrowUpRight size={14} /></Link>
                </div>
                <div className="card-body" style={{ padding: 0 }}>
                  <div className="table-wrapper">
                    <table>
                      <thead><tr><th>Property</th><th>City</th><th>Type</th><th>Active Tenants</th><th>Units</th></tr></thead>
                      <tbody>
                        {data.properties.map(p => (
                          <tr key={p.id}>
                            <td><strong>{p.name}</strong><div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{p.address}</div></td>
                            <td>{p.city}</td>
                            <td><span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>{p.property_type}</span></td>
                            <td>{p.active_tenants}</td>
                            <td>{p.total_units}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
