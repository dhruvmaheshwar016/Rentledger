import db from '../db.js';

// GET /api/properties
export const getProperties = (req, res) => {
  const properties = db.prepare(`
    SELECT p.*, 
      (SELECT COUNT(*) FROM tenants t WHERE t.property_id = p.id AND t.status = 'active') as active_tenants
    FROM properties p WHERE p.user_id = ? ORDER BY p.created_at DESC
  `).all(req.user.id);
  res.json({ success: true, properties });
};

// GET /api/properties/:id
export const getProperty = (req, res) => {
  const property = db.prepare('SELECT * FROM properties WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!property) return res.status(404).json({ success: false, message: 'Property not found.' });
  res.json({ success: true, property });
};

// POST /api/properties
export const createProperty = (req, res) => {
  const { name, address, city, state, pincode, property_type, total_units } = req.body;
  if (!name || !address || !city || !state || !pincode) {
    return res.status(400).json({ success: false, message: 'Name, address, city, state and pincode are required.' });
  }
  const result = db.prepare(
    'INSERT INTO properties (user_id, name, address, city, state, pincode, property_type, total_units) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(req.user.id, name, address, city, state, pincode, property_type || 'residential', total_units || 1);

  const property = db.prepare('SELECT * FROM properties WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ success: true, message: 'Property added successfully!', property });
};

// PUT /api/properties/:id
export const updateProperty = (req, res) => {
  const { name, address, city, state, pincode, property_type, total_units } = req.body;
  const existing = db.prepare('SELECT * FROM properties WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Property not found.' });

  db.prepare(
    'UPDATE properties SET name=?, address=?, city=?, state=?, pincode=?, property_type=?, total_units=? WHERE id=?'
  ).run(name || existing.name, address || existing.address, city || existing.city,
        state || existing.state, pincode || existing.pincode,
        property_type || existing.property_type, total_units || existing.total_units, req.params.id);

  const property = db.prepare('SELECT * FROM properties WHERE id = ?').get(req.params.id);
  res.json({ success: true, message: 'Property updated!', property });
};

// DELETE /api/properties/:id
export const deleteProperty = (req, res) => {
  const existing = db.prepare('SELECT * FROM properties WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Property not found.' });
  db.prepare('DELETE FROM properties WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: 'Property deleted.' });
};
