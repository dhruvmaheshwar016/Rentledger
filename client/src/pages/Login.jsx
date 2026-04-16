import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { IndianRupee, CheckCircle, MessageSquare, FileText, Shield } from 'lucide-react';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      {/* Brand Panel */}
      <div className="auth-brand">
        <div className="auth-brand-logo">
          <div className="auth-brand-icon">
            <IndianRupee size={24} color="white" />
          </div>
          <span className="auth-brand-name">RentLedger</span>
        </div>

        <h1>Automate rent collection for India's landlords</h1>
        <p>
          Stop managing rent via WhatsApp screenshots. Get automated
          UPI payment links, digital receipts, and compliance reports — all in one place.
        </p>

        <div className="auth-brand-features">
          {[
            { icon: MessageSquare, text: 'Auto WhatsApp reminders on the 1st' },
            { icon: IndianRupee, text: 'UPI payment links per tenant' },
            { icon: FileText, text: 'Instant digital rent receipts' },
            { icon: Shield, text: 'Compliance reports for ITR filing' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="auth-feature-item">
              <div className="auth-feature-icon"><Icon size={16} /></div>
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* Form Panel */}
      <div className="auth-form-side">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h2>Welcome back</h2>
            <p>
              Don't have an account?{' '}
              <Link to="/register">Sign up free</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input
                id="login-email"
                type="email"
                className="form-control"
                placeholder="landlord@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                id="login-password"
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <button id="btn-login" type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? <span className="loading-spinner" /> : 'Sign in'}
            </button>
          </form>

          <div style={{ marginTop: 24, padding: 16, background: '#FFF7ED', borderRadius: 8, border: '1px solid #FED7AA' }}>
            <p style={{ fontSize: 13, color: '#92400E', fontWeight: 500 }}>
              🔐 <strong>Demo:</strong> Register a free account to explore the dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
