import db from '../db.js';

// GET /api/payments
export const getPayments = (req, res) => {
  const { lease_id, status, month } = req.query;
  let query = `
    SELECT pay.*, t.full_name as tenant_name, t.phone as tenant_phone,
      p.name as property_name, l.monthly_rent
    FROM payments pay
    JOIN leases l ON pay.lease_id = l.id
    JOIN tenants t ON pay.tenant_id = t.id
    JOIN properties p ON l.property_id = p.id
    WHERE pay.user_id = ?
  `;
  const params = [req.user.id];
  if (lease_id) { query += ' AND pay.lease_id = ?'; params.push(lease_id); }
  if (status)   { query += ' AND pay.status = ?';   params.push(status); }
  if (month)    { query += ' AND pay.month = ?';    params.push(month); }
  query += ' ORDER BY pay.created_at DESC';

  const payments = db.prepare(query).all(...params);
  res.json({ success: true, payments });
};

// POST /api/payments
export const createPayment = (req, res) => {
  const { lease_id, tenant_id, amount, month, status, payment_mode, upi_ref, paid_date, notes } = req.body;
  if (!lease_id || !tenant_id || !amount || !month) {
    return res.status(400).json({ success: false, message: 'Lease, tenant, amount and month are required.' });
  }

  const lease = db.prepare('SELECT * FROM leases WHERE id = ? AND user_id = ?').get(lease_id, req.user.id);
  if (!lease) return res.status(403).json({ success: false, message: 'Invalid lease.' });

  const result = db.prepare(
    'INSERT INTO payments (user_id, lease_id, tenant_id, amount, month, status, payment_mode, upi_ref, paid_date, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(req.user.id, lease_id, tenant_id, amount, month, status || 'pending',
        payment_mode || 'upi', upi_ref || null, paid_date || null, notes || null);

  const payment = db.prepare('SELECT * FROM payments WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ success: true, message: 'Payment recorded!', payment });
};

// PUT /api/payments/:id
export const updatePayment = (req, res) => {
  const { status, payment_mode, upi_ref, paid_date, notes } = req.body;
  const existing = db.prepare('SELECT * FROM payments WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Payment not found.' });

  db.prepare(
    'UPDATE payments SET status=?, payment_mode=?, upi_ref=?, paid_date=?, notes=? WHERE id=?'
  ).run(status || existing.status, payment_mode || existing.payment_mode,
        upi_ref ?? existing.upi_ref, paid_date ?? existing.paid_date,
        notes ?? existing.notes, req.params.id);

  const payment = db.prepare('SELECT * FROM payments WHERE id = ?').get(req.params.id);
  res.json({ success: true, message: 'Payment updated!', payment });
};

// DELETE /api/payments/:id
export const deletePayment = (req, res) => {
  const existing = db.prepare('SELECT * FROM payments WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Payment not found.' });
  db.prepare('DELETE FROM payments WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: 'Payment deleted.' });
};

// GET /api/payments/stats — dashboard summary
export const getPaymentStats = (req, res) => {
  const userId = req.user.id;
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  const totalCollected = db.prepare(
    "SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE user_id = ? AND status = 'paid'"
  ).get(userId).total;

  const monthCollected = db.prepare(
    "SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE user_id = ? AND status = 'paid' AND month = ?"
  ).get(userId, currentMonth).total;

  const pendingCount = db.prepare(
    "SELECT COUNT(*) as cnt FROM payments WHERE user_id = ? AND status = 'pending'"
  ).get(userId).cnt;

  const overdueCount = db.prepare(
    "SELECT COUNT(*) as cnt FROM payments WHERE user_id = ? AND status = 'overdue'"
  ).get(userId).cnt;

  res.json({ success: true, stats: { totalCollected, monthCollected, pendingCount, overdueCount, currentMonth } });
};
