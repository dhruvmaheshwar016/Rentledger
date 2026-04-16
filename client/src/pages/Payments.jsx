import { useEffect, useState } from 'react';
import API from '../lib/api';
import toast from 'react-hot-toast';
import { CreditCard, Plus, X, CheckCircle, Clock, AlertCircle, Pencil, Trash2, IndianRupee } from 'lucide-react';

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
const emptyForm = { lease_id: '', tenant_id: '', amount: '', month: new Date().toISOString().slice(0, 7), status: 'paid', payment_mode: 'upi', upi_ref: '', paid_date: new Date().toISOString().slice(0, 10), notes: '' };

export default function Payments() {
  const [payments, setPayments]     = useState([]);
  const [leases, setLeases]         = useState([]);
  const [stats, setStats]           = useState(null);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [editModal, setEditModal]   = useState(null);
  const [form, setForm]             = useState(emptyForm);
  const [editForm, setEditForm]     = useState({});
  const [saving, setSaving]         = useState(false);
  const [filter, setFilter]         = useState('all');

  const load = async () => {
    try {
      const [payRes, leaseRes, statsRes] = await Promise.all([
        API.get('/payments'), API.get('/leases'), API.get('/payments/stats')
      ]);
      setPayments(payRes.data.payments);
      setLeases(leaseRes.data.leases.filter(l => l.status === 'active'));
      setStats(statsRes.data.stats);
    } catch { toast.error('Failed to load payments.'); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleLeaseChange = (leaseId) => {
    const l = leases.find(l => l.id === +leaseId);
    setForm(f => ({ ...f, lease_id: leaseId, tenant_id: l ? String(l.tenant_id) : '', amount: l ? String(l.monthly_rent) : '' }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.post('/payments', form);
      toast.success('Payment recorded!');
      setShowModal(false); setForm(emptyForm); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed.'); }
    finally { setSaving(false); }
  };

  const openEdit = (p) => {
    setEditModal(p);
    setEditForm({ status: p.status, payment_mode: p.payment_mode, upi_ref: p.upi_ref || '', paid_date: p.paid_date || '', notes: p.notes || '' });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.put(`/payments/${editModal.id}`, editForm);
      toast.success('Payment updated!');
      setEditModal(null); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this payment record?')) return;
    try { await API.delete(`/payments/${id}`); toast.success('Payment deleted.'); load(); }
    catch { toast.error('Failed to delete.'); }
  };

  const statusBadge = (s) => ({
    paid:    <span className="badge badge-success"><CheckCircle size={11} /> Paid</span>,
    pending: <span className="badge badge-warning"><Clock size={11} /> Pending</span>,
    overdue: <span className="badge badge-danger"><AlertCircle size={11} /> Overdue</span>,
  }[s] || <span className="badge badge-gray">{s}</span>);

  const filtered = filter === 'all' ? payments : payments.filter(p => p.status === filter);

  return (
    <>
      <div className="topbar">
        <div className="topbar-title">Payments</div>
        <button id="btn-add-payment" className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Record Payment
        </button>
      </div>

      <div className="page-content">
        {/* Stats Row */}
        {stats && (
          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 28 }}>
            <div className="stat-card">
              <div className="stat-card-icon green"><IndianRupee size={22} /></div>
              <div className="stat-card-value">{fmt(stats.monthCollected)}</div>
              <div className="stat-card-label">This Month</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon blue"><IndianRupee size={22} /></div>
              <div className="stat-card-value">{fmt(stats.totalCollected)}</div>
              <div className="stat-card-label">Total Collected</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon orange"><Clock size={22} /></div>
              <div className="stat-card-value">{stats.pendingCount}</div>
              <div className="stat-card-label">Pending</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon red"><AlertCircle size={22} /></div>
              <div className="stat-card-value">{stats.overdueCount}</div>
              <div className="stat-card-label">Overdue</div>
            </div>
          </div>
        )}

        <div className="card">
          <div className="card-header">
            <span className="card-title">Payment History</span>
            <div style={{ display: 'flex', gap: 8 }}>
              {['all', 'paid', 'pending', 'overdue'].map(f => (
                <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ textTransform: 'capitalize' }} onClick={() => setFilter(f)}>{f}</button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="page-loader"><div className="loading-spinner dark" style={{ width: 36, height: 36 }} /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><CreditCard size={32} /></div>
              <h3>No payments {filter !== 'all' ? `with status "${filter}"` : 'yet'}</h3>
              <p>Record a payment when a tenant pays via UPI or cash.</p>
              <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Record Payment</button>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Tenant</th>
                    <th>Property</th>
                    <th>Month</th>
                    <th>Amount</th>
                    <th>Mode</th>
                    <th>Status</th>
                    <th>Paid On</th>
                    <th>UPI Ref</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => (
                    <tr key={p.id}>
                      <td><strong>{p.tenant_name}</strong></td>
                      <td style={{ fontSize: 13 }}>{p.property_name}</td>
                      <td><span className="payment-month-label">{p.month}</span></td>
                      <td><strong style={{ color: 'var(--primary)' }}>{fmt(p.amount)}</strong></td>
                      <td>
                        <span className="badge badge-gray" style={{ textTransform: 'uppercase', fontSize: 11 }}>
                          {p.payment_mode}
                        </span>
                      </td>
                      <td>{statusBadge(p.status)}</td>
                      <td style={{ fontSize: 13 }}>{p.paid_date ? new Date(p.paid_date).toLocaleDateString('en-IN') : '—'}</td>
                      <td style={{ fontSize: 12, color: 'var(--gray-400)', fontFamily: 'monospace' }}>{p.upi_ref || '—'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(p)}><Pencil size={14} /></button>
                          <button className="btn btn-danger btn-icon btn-sm" onClick={() => handleDelete(p.id)}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Payment Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Record Payment</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Select Lease *</label>
                  <select className="form-control" value={form.lease_id} onChange={e => handleLeaseChange(e.target.value)} required>
                    <option value="">Choose tenant lease</option>
                    {leases.map(l => <option key={l.id} value={l.id}>{l.tenant_name} — {l.property_name} (₹{Number(l.monthly_rent).toLocaleString('en-IN')}/mo)</option>)}
                  </select>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Amount (₹) *</label>
                    <input type="number" min={0} className="form-control" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Month *</label>
                    <input type="month" className="form-control" value={form.month} onChange={e => setForm({ ...form, month: e.target.value })} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Payment Mode</label>
                    <select className="form-control" value={form.payment_mode} onChange={e => setForm({ ...form, payment_mode: e.target.value })}>
                      {['upi', 'cash', 'neft', 'imps', 'cheque'].map(m => <option key={m} value={m}>{m.toUpperCase()}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select className="form-control" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                      {['paid', 'pending', 'overdue'].map(s => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Paid Date</label>
                    <input type="date" className="form-control" value={form.paid_date} onChange={e => setForm({ ...form, paid_date: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">UPI Reference</label>
                    <input className="form-control" placeholder="e.g. 421566789012" value={form.upi_ref} onChange={e => setForm({ ...form, upi_ref: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Notes (optional)</label>
                  <textarea className="form-control" rows={2} placeholder="Any notes..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-success" disabled={saving}>
                  {saving ? <span className="loading-spinner" /> : 'Save Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Payment Modal */}
      {editModal && (
        <div className="modal-overlay" onClick={() => setEditModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Update Payment</h3>
              <button className="modal-close" onClick={() => setEditModal(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="modal-body">
                <div style={{ background: 'var(--gray-50)', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 13 }}>
                  <strong>{editModal.tenant_name}</strong> · {editModal.month} · {fmt(editModal.amount)}
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select className="form-control" value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })}>
                      {['paid', 'pending', 'overdue'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Payment Mode</label>
                    <select className="form-control" value={editForm.payment_mode} onChange={e => setEditForm({ ...editForm, payment_mode: e.target.value })}>
                      {['upi', 'cash', 'neft', 'imps', 'cheque'].map(m => <option key={m} value={m}>{m.toUpperCase()}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Paid Date</label>
                    <input type="date" className="form-control" value={editForm.paid_date} onChange={e => setEditForm({ ...editForm, paid_date: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">UPI Reference</label>
                    <input className="form-control" value={editForm.upi_ref} onChange={e => setEditForm({ ...editForm, upi_ref: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Notes</label>
                  <textarea className="form-control" rows={2} value={editForm.notes} onChange={e => setEditForm({ ...editForm, notes: e.target.value })} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setEditModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <span className="loading-spinner" /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
