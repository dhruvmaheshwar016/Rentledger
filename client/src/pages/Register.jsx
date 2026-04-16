import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { IndianRupee, MessageSquare, FileText, Shield, TrendingUp } from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters.');
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome to RentLedger 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
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

        <h1>Join thousands of landlords managing efficiently</h1>
        <p>
          Purpose-built for Indian landlords with 2–10 properties. 
          Replace WhatsApp chaos with a professional rent management system.
        </p>

        <div className="auth-brand-features">
          {[
            { icon: TrendingUp,    text: '₹2.4Cr+ rent collected this month' },
            { icon: MessageSquare, text: 'Automated WhatsApp + UPI reminders' },
            { icon: FileText,      text: 'GST-ready rent receipts' },
            { icon: Shield,        text: 'Data backed up securely' },
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
            <h2>Create your account</h2>
            <p>
              Already have an account?{' '}
              <Link to="/login">Sign in</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                id="reg-name"
                type="text"
                className="form-control"
                placeholder="Rajesh Kumar"
                value={form.full_name}
                onChange={e => setForm({ ...form, full_name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email address</label>
              <input
                id="reg-email"
                type="email"
                className="form-control"
                placeholder="landlord@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div className="input-group">
                <span className="input-group-prefix">🇮🇳 +91</span>
                <input
                  id="reg-phone"
                  type="tel"
                  className="form-control"
                  placeholder="98765 43210"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                id="reg-password"
                type="password"
                className="form-control"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <button id="btn-register" type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? <span className="loading-spinner" /> : 'Create free account'}
            </button>

            <p style={{ fontSize: 12, color: 'var(--gray-400)', textAlign: 'center', marginTop: 16 }}>
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
