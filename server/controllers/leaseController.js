import db from '../db.js';

// GET /api/leases
export const getLeases = (req, res) => {
  const leases = db.prepare(`
    SELECT l.*, t.full_name as tenant_name, t.phone as tenant_phone,
      p.name as property_name
    FROM leases l
    JOIN tenants t ON l.tenant_id = t.id
    JOIN properties p ON l.property_id = p.id
    WHERE l.user_id = ?
    ORDER BY l.created_at DESC
  `).all(req.user.id);
  res.json({ success: true, leases });
};

// POST /api/leases
export const createLease = (req, res) => {
  const { tenant_id, property_id, monthly_rent, security_deposit, start_date, end_date, due_day } = req.body;
  if (!tenant_id || !property_id || !monthly_rent || !start_date) {
    return res.status(400).json({ success: false, message: 'Tenant, property, rent and start date are required.' });
  }

  // Verify tenant and property belong to user
  const tenant = db.prepare('SELECT id FROM tenants WHERE id = ? AND user_id = ?').get(tenant_id, req.user.id);
  if (!tenant) return res.status(403).json({ success: false, message: 'Invalid tenant.' });

  // Deactivate any previous active lease for tenant
  db.prepare("UPDATE leases SET status = 'expired' WHERE tenant_id = ? AND status = 'active'").run(tenant_id);

  const result = db.prepare(
    'INSERT INTO leases (user_id, tenant_id, property_id, monthly_rent, security_deposit, start_date, end_date, due_day) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(req.user.id, tenant_id, property_id, monthly_rent, security_deposit || 0,
        start_date, end_date || null, due_day || 1);

  const lease = db.prepare('SELECT * FROM leases WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ success: true, message: 'Lease created successfully!', lease });
};

// PUT /api/leases/:id/status
export const updateLeaseStatus = (req, res) => {
  const { status } = req.body;
  const existing = db.prepare('SELECT * FROM leases WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Lease not found.' });

  db.prepare('UPDATE leases SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ success: true, message: 'Lease status updated.' });
};

// DELETE /api/leases/:id
export const deleteLease = (req, res) => {
  const existing = db.prepare('SELECT * FROM leases WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Lease not found.' });
  db.prepare('DELETE FROM leases WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: 'Lease deleted.' });
};
