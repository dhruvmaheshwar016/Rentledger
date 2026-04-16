import { useEffect, useState } from 'react';
import API from '../lib/api';
import toast from 'react-hot-toast';
import { FileText, Plus, X, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const emptyForm = { tenant_id: '', property_id: '', monthly_rent: '', security_deposit: '', start_date: '', end_date: '', due_day: 1 };
const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export default function Leases() {
  const [leases, setLeases]         = useState([]);
  const [tenants, setTenants]       = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [form, setForm]             = useState(emptyForm);
  const [saving, setSaving]         = useState(false);

  const load = async () => {
    try {
      const [lRes, tRes, pRes] = await Promise.all([
        API.get('/leases'), API.get('/tenants'), API.get('/properties')
      ]);
      setLeases(lRes.data.leases);
      setTenants(tRes.data.tenants.filter(t => t.status === 'active'));
      setProperties(pRes.data.properties);
    } catch { toast.error('Failed to load leases.'); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // Auto-fill property when tenant changes
  const handleTenantChange = (tenantId) => {
    const t = tenants.find(t => t.id === +tenantId);
    setForm(f => ({ ...f, tenant_id: tenantId, property_id: t ? String(t.property_id) : f.property_id }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.post('/leases', form);
      toast.success('Lease created!');
      setShowModal(false); setForm(emptyForm); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to create lease.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this lease?')) return;
    try { await API.delete(`/leases/${id}`); toast.success('Lease deleted.'); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed.'); }
  };

  const statusBadge = (s) => {
    const map = { active: ['badge-success', <CheckCircle size={11} />], expired: ['badge-gray', <Clock size={11} />], terminated: ['badge-danger', <AlertCircle size={11} />] };
    const [cls, icon] = map[s] || ['badge-gray', null];
    return <span className={`badge ${cls}`}>{icon}{s}</span>;
  };

  return (
    <>
      <div className="topbar">
        <div className="topbar-title">Leases</div>
        <button id="btn-add-lease" className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Create Lease
        </button>
      </div>

      <div className="page-content">
        <div className="page-header">
          <div>
            <div className="page-header-title">Lease Agreements</div>
            <div className="page-header-subtitle">{leases.filter(l => l.status === 'active').length} active leases</div>
          </div>
        </div>

        {loading ? (
          <div className="page-loader"><div className="loading-spinner dark" style={{ width: 36, height: 36 }} /></div>
        ) : leases.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-icon"><FileText size={32} /></div>
              <h3>No leases yet</h3>
              <p>Create a lease to define rent amount and automate monthly payment collection.</p>
              <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Create Lease</button>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Tenant</th>
                    <th>Property</th>
                    <th>Monthly Rent</th>
                    <th>Deposit</th>
                    <th>Start Date</th>
                    <th>Due Day</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {leases.map(l => (
                    <tr key={l.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{l.tenant_name}</div>
                        <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{l.tenant_phone}</div>
                      </td>
                      <td>{l.property_name}</td>
                      <td><strong style={{ color: 'var(--primary)' }}>{fmt(l.monthly_rent)}</strong></td>
                      <td>{l.security_deposit ? fmt(l.security_deposit) : '—'}</td>
                      <td>{new Date(l.start_date).toLocaleDateString('en-IN')}</td>
                      <td>
                        <span className="badge badge-primary">{l.due_day}{l.due_day === 1 ? 'st' : l.due_day === 2 ? 'nd' : l.due_day === 3 ? 'rd' : 'th'}</span>
                      </td>
                      <td>{statusBadge(l.status)}</td>
                      <td>
                        <button className="btn btn-danger btn-icon btn-sm" onClick={() => handleDelete(l.id)}><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create Lease</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Tenant *</label>
                  <select className="form-control" value={form.tenant_id} onChange={e => handleTenantChange(e.target.value)} required>
                    <option value="">Select tenant</option>
                    {tenants.map(t => <option key={t.id} value={t.id}>{t.full_name} — {t.property_name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Property *</label>
                  <select className="form-control" value={form.property_id} onChange={e => setForm({ ...form, property_id: e.target.value })} required>
                    <option value="">Select property</option>
                    {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Monthly Rent (₹) *</label>
                    <input type="number" min={0} className="form-control" placeholder="25000" value={form.monthly_rent} onChange={e => setForm({ ...form, monthly_rent: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Security Deposit (₹)</label>
                    <input type="number" min={0} className="form-control" placeholder="50000" value={form.security_deposit} onChange={e => setForm({ ...form, security_deposit: e.target.value })} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Start Date *</label>
                    <input type="date" className="form-control" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Date (optional)</label>
                    <input type="date" className="form-control" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Rent Due Day (1–31)</label>
                  <input type="number" min={1} max={31} className="form-control" value={form.due_day} onChange={e => setForm({ ...form, due_day: +e.target.value })} />
                  <span style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 4, display: 'block' }}>Day of month when rent is due. Default: 1st.</span>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <span className="loading-spinner" /> : 'Create Lease'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
