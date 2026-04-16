import { useEffect, useState } from 'react';
import API from '../lib/api';
import toast from 'react-hot-toast';
import { Building2, Plus, Pencil, Trash2, X, MapPin, Home } from 'lucide-react';

const TYPES = ['residential', 'commercial', 'villa', 'apartment', 'plot'];

const emptyForm = { name: '', address: '', city: '', state: '', pincode: '', property_type: 'residential', total_units: 1 };

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const { data } = await API.get('/properties');
      setProperties(data.properties);
    } catch { toast.error('Failed to load properties.'); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (p) => { setEditing(p); setForm({ name: p.name, address: p.address, city: p.city, state: p.state, pincode: p.pincode, property_type: p.property_type, total_units: p.total_units }); setShowModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await API.put(`/properties/${editing.id}`, form);
        toast.success('Property updated!');
      } else {
        await API.post('/properties', form);
        toast.success('Property added!');
      }
      setShowModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save property.');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await API.delete(`/properties/${id}`);
      toast.success('Property deleted.');
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to delete.'); }
  };

  const EMOJI_MAP = { residential: '🏠', commercial: '🏢', villa: '🏡', apartment: '🏗️', plot: '🌿' };

  return (
    <>
      <div className="topbar">
        <div className="topbar-title">Properties</div>
        <button id="btn-add-property" className="btn btn-primary btn-sm" onClick={openAdd}>
          <Plus size={16} /> Add Property
        </button>
      </div>

      <div className="page-content">
        <div className="page-header">
          <div>
            <div className="page-header-title">Your Properties</div>
            <div className="page-header-subtitle">{properties.length} propert{properties.length === 1 ? 'y' : 'ies'} managed</div>
          </div>
        </div>

        {loading ? (
          <div className="page-loader"><div className="loading-spinner dark" style={{ width: 36, height: 36 }} /></div>
        ) : properties.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-icon"><Building2 size={32} /></div>
              <h3>No properties yet</h3>
              <p>Add your first rental property to get started with RentLedger.</p>
              <button className="btn btn-primary" onClick={openAdd}><Plus size={16} /> Add Property</button>
            </div>
          </div>
        ) : (
          <div className="property-grid">
            {properties.map(p => (
              <div key={p.id} className="property-card">
                <div className="property-card-header">
                  <span style={{ fontSize: 48 }}>{EMOJI_MAP[p.property_type] || '🏠'}</span>
                </div>
                <div className="property-card-body">
                  <div className="property-card-name">{p.name}</div>
                  <div className="property-card-address">
                    <MapPin size={12} style={{ display: 'inline', marginRight: 4 }} />
                    {p.address}, {p.city}, {p.state} — {p.pincode}
                  </div>
                  <div className="property-card-stats">
                    <div className="property-stat">
                      <div className="property-stat-value">{p.active_tenants}</div>
                      <div className="property-stat-label">Tenants</div>
                    </div>
                    <div className="property-stat">
                      <div className="property-stat-value">{p.total_units}</div>
                      <div className="property-stat-label">Units</div>
                    </div>
                    <div className="property-stat">
                      <div className="property-stat-value" style={{ textTransform: 'capitalize', fontSize: 13 }}>{p.property_type}</div>
                      <div className="property-stat-label">Type</div>
                    </div>
                  </div>
                  <div className="property-card-actions">
                    <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => openEdit(p)}>
                      <Pencil size={14} /> Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id, p.name)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editing ? 'Edit Property' : 'Add Property'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Property Name *</label>
                  <input className="form-control" placeholder="e.g. Sharma Residency A-101" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Full Address *</label>
                  <input className="form-control" placeholder="Street / Colony / Sector" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input className="form-control" placeholder="Mumbai" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State *</label>
                    <input className="form-control" placeholder="Maharashtra" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Pincode *</label>
                    <input className="form-control" placeholder="400001" value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Total Units</label>
                    <input type="number" min={1} className="form-control" value={form.total_units} onChange={e => setForm({ ...form, total_units: +e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Property Type</label>
                  <select className="form-control" value={form.property_type} onChange={e => setForm({ ...form, property_type: e.target.value })}>
                    {TYPES.map(t => <option key={t} value={t} style={{ textTransform: 'capitalize' }}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <span className="loading-spinner" /> : editing ? 'Save Changes' : 'Add Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
