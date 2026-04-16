import { useEffect, useState } from 'react';
import API from '../lib/api';
import toast from 'react-hot-toast';
import { Users, Plus, Pencil, Trash2, X, Phone, Mail, Building2 } from 'lucide-react';

const emptyForm = { property_id: '', full_name: '', email: '', phone: '', unit_number: '' };

export default function Tenants() {
  const [tenants, setTenants]         = useState([]);
  const [properties, setProperties]   = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showModal, setShowModal]     = useState(false);
  const [editing, setEditing]         = useState(null);
  const [form, setForm]               = useState(emptyForm);
  const [saving, setSaving]           = useState(false);
  const [search, setSearch]           = useState('');

  const load = async () => {
    try {
      const [tRes, pRes] = await Promise.all([API.get('/tenants'), API.get('/properties')]);
      setTenants(tRes.data.tenants);
      setProperties(pRes.data.properties);
    } catch { toast.error('Failed to load tenants.'); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd  = ()  => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (t) => {
    setEditing(t);
    setForm({ property_id: t.property_id, full_name: t.full_name, email: t.email || '', phone: t.phone, unit_number: t.unit_number || '' });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await API.put(`/tenants/${editing.id}`, form);
        toast.success('Tenant updated!');
      } else {
        await API.post('/tenants', form);
        toast.success('Tenant added!');
      }
      setShowModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove tenant "${name}"?`)) return;
    try { await API.delete(`/tenants/${id}`); toast.success('Tenant removed.'); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed to delete.'); }
  };

  const filtered = tenants.filter(t =>
    t.full_name.toLowerCase().includes(search.toLowerCase()) ||
    t.phone.includes(search) ||
    (t.property_name || '').toLowerCase().includes(search.toLowerCase())
  );

  const initials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <>
      <div className="topbar">
        <div className="topbar-title">Tenants</div>
        <button id="btn-add-tenant" className="btn btn-primary btn-sm" onClick={openAdd}>
          <Plus size={16} /> Add Tenant
        </button>
      </div>

      <div className="page-content">
        <div className="page-header">
          <div>
            <div className="page-header-title">Your Tenants</div>
            <div className="page-header-subtitle">{tenants.filter(t => t.status === 'active').length} active tenants</div>
          </div>
          <input className="form-control" style={{ width: 260 }} placeholder="Search tenants..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {loading ? (
          <div className="page-loader"><div className="loading-spinner dark" style={{ width: 36, height: 36 }} /></div>
        ) : filtered.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-icon"><Users size={32} /></div>
              <h3>{search ? 'No results found' : 'No tenants yet'}</h3>
              <p>{search ? 'Try a different search term.' : 'Add your first tenant to start tracking rent payments.'}</p>
              {!search && <button className="btn btn-primary" onClick={openAdd}><Plus size={16} /> Add Tenant</button>}
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
                    <th>Unit</th>
                    <th>Phone</th>
                    <th>Lease Rent</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(t => (
                    <tr key={t.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="avatar">{initials(t.full_name)}</div>
                          <div>
                            <div style={{ fontWeight: 600 }}>{t.full_name}</div>
                            {t.email && <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{t.email}</div>}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                          <Building2 size={13} color="var(--gray-400)" />
                          {t.property_name || '—'}
                        </div>
                      </td>
                      <td>{t.unit_number || '—'}</td>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap: 6, fontSize: 13 }}>
                          <Phone size={13} color="var(--gray-400)" />
                          {t.phone}
                        </div>
                      </td>
                      <td>{t.monthly_rent ? <strong>₹{Number(t.monthly_rent).toLocaleString('en-IN')}</strong> : '—'}</td>
                      <td>
                        <span className={`badge badge-${t.status === 'active' ? 'success' : 'gray'}`}>
                          {t.status === 'active' ? '● Active' : '● Inactive'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(t)} title="Edit"><Pencil size={14} /></button>
                          <button className="btn btn-danger btn-icon btn-sm" onClick={() => handleDelete(t.id, t.full_name)} title="Delete"><Trash2 size={14} /></button>
                        </div>
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
              <h3>{editing ? 'Edit Tenant' : 'Add Tenant'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Property *</label>
                  <select className="form-control" value={form.property_id} onChange={e => setForm({ ...form, property_id: e.target.value })} required>
                    <option value="">Select property</option>
                    {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Tenant Full Name *</label>
                  <input className="form-control" placeholder="Amit Sharma" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Phone *</label>
                    <div className="input-group">
                      <span className="input-group-prefix">+91</span>
                      <input className="form-control" placeholder="9876543210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Unit / Flat No.</label>
                    <input className="form-control" placeholder="A-101" value={form.unit_number} onChange={e => setForm({ ...form, unit_number: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email (optional)</label>
                  <input type="email" className="form-control" placeholder="tenant@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <span className="loading-spinner" /> : editing ? 'Save Changes' : 'Add Tenant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
