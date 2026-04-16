import { Link } from 'react-router-dom';
import {
  IndianRupee, MessageSquare, FileText, Shield, CheckCircle, X,
  Zap, BarChart3, Bell, Smartphone, Building2, Users
} from 'lucide-react';

const features = [
  {
    icon: MessageSquare, color: '#EFF6FF', iconColor: '#1D4ED8',
    title: 'Auto WhatsApp Reminders',
    desc: 'On the 1st of every month, your tenants get a WhatsApp message with their UPI payment link. No more manual reminders.',
  },
  {
    icon: IndianRupee, color: '#FFF7ED', iconColor: '#EA580C',
    title: 'UPI Payment Links',
    desc: 'Generate tenant-specific UPI deep-links for instant payment. Works with PhonePe, GPay, Paytm — every UPI app.',
  },
  {
    icon: FileText, color: '#F0FDF4', iconColor: '#16A34A',
    title: 'Digital Rent Receipts',
    desc: 'Automatically generate GST-ready PDF receipts after every payment. Share via WhatsApp or email in one tap.',
  },
  {
    icon: BarChart3, color: '#FDF4FF', iconColor: '#7C3AED',
    title: 'Compliance & Reports',
    desc: 'Get annual rent statements ready for ITR filing. Track TDS deductions and generate Form 16A-ready reports.',
  },
  {
    icon: Bell, color: '#FFFBEB', iconColor: '#D97706',
    title: 'Smart Overdue Alerts',
    desc: 'Escalating reminders — day 3, day 7, day 15. Tenants get polite nudges; you get a clear overdue dashboard.',
  },
  {
    icon: Shield, color: '#EFF6FF', iconColor: '#1D4ED8',
    title: 'Secure & Private',
    desc: 'Your data is encrypted and stored securely. No third party ever sees your tenant or financial information.',
  },
];

const steps = [
  { n: 1, title: 'Add your properties', desc: 'Register each property with address, type, and number of units.' },
  { n: 2, title: 'Add tenants', desc: 'Enter tenant name, phone (+91), and assign to a property.' },
  { n: 3, title: 'Create a lease', desc: 'Set monthly rent, due day, and security deposit. RentLedger takes over.' },
  { n: 4, title: 'Collect on autopilot', desc: 'Tenants pay via UPI. Records update automatically. You track everything.' },
];

const plans = [
  {
    name: 'Free', price: '₹0', period: '/month', desc: 'For landlords just getting started.',
    features: ['Up to 2 properties', '5 tenants', 'Payment tracking', 'Basic receipts', null, null],
    cta: 'Get started free', ctaLink: '/register', featured: false,
  },
  {
    name: 'Pro', price: '₹499', period: '/month', desc: 'For active landlords with multiple properties.',
    features: ['Up to 10 properties', 'Unlimited tenants', 'WhatsApp automation', 'GST-ready receipts', 'ITR reports', 'Priority support'],
    cta: 'Start free trial', ctaLink: '/register', featured: true,
  },
  {
    name: 'Business', price: '₹1,499', period: '/month', desc: 'For property managers with larger portfolios.',
    features: ['Unlimited properties', 'Unlimited tenants', 'Everything in Pro', 'CA-ready statements', 'API access', 'Dedicated support'],
    cta: 'Contact sales', ctaLink: '/register', featured: false,
  },
];

export default function Landing() {
  return (
    <div className="landing">
      {/* Nav */}
      <nav className="nav">
        <div className="nav-logo">
          <div className="nav-logo-icon">
            <IndianRupee size={20} color="white" />
          </div>
          RentLedger
        </div>
        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#how-it-works">How It Works</a></li>
          <li><a href="#pricing">Pricing</a></li>
        </ul>
        <div className="nav-actions">
          <Link to="/login" className="btn btn-ghost btn-sm">Sign in</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Start free →</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">
          <Zap size={14} fill="currentColor" /> Built for Indian landlords
        </div>
        <h1>
          The easiest way for managing<br />
          your <span className="highlight">Rents</span>
        </h1>
        <p>
          RentLedger automates rent collection, invoicing & compliance for landlords
          with 2–10 properties across India. Set it up once, collect on autopilot.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn btn-primary btn-lg">Get started free</Link>
          <a href="#how-it-works" className="btn btn-ghost btn-lg">See how it works →</a>
        </div>
        <div className="hero-social-proof">
          <div className="hero-avatars">
            {['#1E3A8A', '#EA580C', '#16A34A', '#7C3AED'].map((c, i) => (
              <div key={i} className="avatar" style={{ background: c, borderRadius: '50%', width: 32, height: 32, fontSize: 12 }}>
                {['RK', 'AS', 'PD', 'MB'][i]}
              </div>
            ))}
          </div>
          <span>Join <strong>2,400+</strong> landlords already using RentLedger</span>
        </div>
      </section>

      {/* Features */}
      <section className="section" id="features">
        <div style={{ textAlign: 'center', marginBottom: 0 }}>
          <div className="section-label"><Zap size={14} /> Features</div>
          <div className="section-title">Everything a landlord needs</div>
          <div className="section-subtitle" style={{ margin: '0 auto 60px' }}>
            We've replaced every WhatsApp message, handwritten receipt, and spreadsheet
            with a single automated system.
          </div>
        </div>
        <div className="features-grid">
          {features.map(({ icon: Icon, color, iconColor, title, desc }) => (
            <div key={title} className="feature-card">
              <div className="feature-card-icon" style={{ background: color }}>
                <Icon size={24} color={iconColor} />
              </div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="section how-it-works" id="how-it-works">
        <div style={{ textAlign: 'center' }}>
          <div className="section-label">Process</div>
          <div className="section-title">Set up in 5 minutes</div>
          <div className="section-subtitle" style={{ margin: '0 auto 60px' }}>
            Add your properties and tenants once. RentLedger handles everything from the 1st of every month.
          </div>
        </div>
        <div className="steps-grid">
          {steps.map(s => (
            <div key={s.n} className="step-card">
              <div className="step-number">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="section" style={{ background: 'var(--primary)', padding: '80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 40, textAlign: 'center' }}>
          {[
            { value: '2,400+', label: 'Landlords', icon: Users },
            { value: '₹24Cr+', label: 'Rent Collected', icon: IndianRupee },
            { value: '8,900+', label: 'Properties', icon: Building2 },
            { value: '98%', label: 'On-time Collection', icon: CheckCircle },
          ].map(({ value, label, icon: Icon }) => (
            <div key={label}>
              <Icon size={32} color="rgba(255,255,255,0.5)" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: 40, fontWeight: 900, color: 'white', letterSpacing: -1 }}>{value}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="section" id="pricing" style={{ textAlign: 'center' }}>
        <div className="section-label">Pricing</div>
        <div className="section-title">Simple, transparent pricing</div>
        <div className="section-subtitle" style={{ margin: '0 auto 60px' }}>
          Start free. Upgrade when you need automation.
        </div>
        <div className="pricing-grid">
          {plans.map(plan => (
            <div key={plan.name} className={`pricing-card${plan.featured ? ' featured' : ''}`}>
              {plan.featured && <div className="pricing-badge">Most Popular</div>}
              <div className="pricing-plan">{plan.name}</div>
              <div className="pricing-price">{plan.price}<span>{plan.period}</span></div>
              <div className="pricing-desc">{plan.desc}</div>
              <ul className="pricing-features">
                {plan.features.map((f, i) => (
                  <li key={i}>
                    {f ? <CheckCircle size={16} className="check" /> : <X size={16} className="cross" />}
                    <span style={{ color: f ? 'var(--gray-700)' : 'var(--gray-300)' }}>{f || ['WhatsApp automation', 'ITR reports'][i - 4] || '—'}</span>
                  </li>
                ))}
              </ul>
              <Link to={plan.ctaLink} className={`btn btn-full ${plan.featured ? 'btn-primary' : 'btn-outline'} btn-lg`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Start collecting rent smarter today</h2>
        <p>Join 2,400+ Indian landlords who've automated their rent management.</p>
        <div className="cta-actions">
          <Link to="/register" className="btn btn-white btn-lg">Create free account →</Link>
          <Link to="/login" className="btn btn-white-outline btn-lg">Sign in</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, background: 'var(--accent)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IndianRupee size={18} color="white" />
              </div>
              <div className="footer-brand-name">RentLedger</div>
            </div>
            <div className="footer-brand-desc">
              Automating rent collection, invoicing, and compliance for small landlords across India. From WhatsApp chaos to autopilot.
            </div>
          </div>
          {[
            { title: 'Product', links: ['Features', 'How It Works', 'Pricing', 'Changelog'] },
            { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Data Processing'] },
            { title: 'Support', links: ['Help Center', 'Contact Us', 'Status', 'Community'] },
          ].map(col => (
            <div key={col.title} className="footer-col">
              <h4>{col.title}</h4>
              <ul>
                {col.links.map(l => <li key={l}><a href="#">{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <p>© 2024 RentLedger. Made with ❤️ for Indian landlords.</p>
          <p style={{ color: 'var(--gray-600)', fontSize: 12 }}>Secured with 256-bit encryption</p>
        </div>
      </footer>
    </div>
  );
}
