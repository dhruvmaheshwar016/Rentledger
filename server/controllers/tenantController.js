import db from '../db.js';

// GET /api/tenants
export const getTenants = (req, res) => {
  const tenants = db.prepare(`
    SELECT t.*, p.name as property_name, p.address as property_address,
      l.monthly_rent, l.status as lease_status, l.id as lease_id
    FROM tenants t
    LEFT JOIN properties p ON t.property_id = p.id
    LEFT JOIN leases l ON l.tenant_id = t.id AND l.status = 'active'
    WHERE t.user_id = ?
    ORDER BY t.created_at DESC
  `).all(req.user.id);
  res.json({ success: true, tenants });
};

// GET /api/tenants/:id
export const getTenant = (req, res) => {
  const tenant = db.prepare(`
    SELECT t.*, p.name as property_name
    FROM tenants t LEFT JOIN properties p ON t.property_id = p.id
    WHERE t.id = ? AND t.user_id = ?
  `).get(req.params.id, req.user.id);
  if (!tenant) return res.status(404).json({ success: false, message: 'Tenant not found.' });
  res.json({ success: true, tenant });
};

// POST /api/tenants
export const createTenant = (req, res) => {
  const { property_id, full_name, email, phone, unit_number } = req.body;
  if (!property_id || !full_name || !phone) {
    return res.status(400).json({ success: false, message: 'Property, name and phone are required.' });
  }
  // Verify property belongs to user
  const property = db.prepare('SELECT id FROM properties WHERE id = ? AND user_id = ?').get(property_id, req.user.id);
  if (!property) return res.status(403).json({ success: false, message: 'Invalid property.' });

  const result = db.prepare(
    'INSERT INTO tenants (user_id, property_id, full_name, email, phone, unit_number) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(req.user.id, property_id, full_name, email || null, phone, unit_number || null);

  const tenant = db.prepare('SELECT * FROM tenants WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ success: true, message: 'Tenant added successfully!', tenant });
};

// PUT /api/tenants/:id
export const updateTenant = (req, res) => {
  const { full_name, email, phone, unit_number, status } = req.body;
  const existing = db.prepare('SELECT * FROM tenants WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Tenant not found.' });

  db.prepare(
    'UPDATE tenants SET full_name=?, email=?, phone=?, unit_number=?, status=? WHERE id=?'
  ).run(full_name || existing.full_name, email ?? existing.email, phone || existing.phone,
        unit_number ?? existing.unit_number, status || existing.status, req.params.id);

  const tenant = db.prepare('SELECT * FROM tenants WHERE id = ?').get(req.params.id);
  res.json({ success: true, message: 'Tenant updated!', tenant });
};

// DELETE /api/tenants/:id
export const deleteTenant = (req, res) => {
  const existing = db.prepare('SELECT * FROM tenants WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Tenant not found.' });
  db.prepare('DELETE FROM tenants WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: 'Tenant removed.' });
};
