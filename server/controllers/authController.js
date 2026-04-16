import db from '../db.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth.js';

// POST /api/auth/register
export const register = (req, res) => {
  const { full_name, email, phone, password } = req.body;

  if (!full_name || !email || !phone || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return res.status(409).json({ success: false, message: 'Email already registered. Please login.' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const result = db.prepare(
    'INSERT INTO users (full_name, email, phone, password) VALUES (?, ?, ?, ?)'
  ).run(full_name, email, phone, hashedPassword);

  const user = { id: result.lastInsertRowid, full_name, email, phone };
  const token = generateToken({ id: user.id, email: user.email });

  res.status(201).json({ success: true, message: 'Account created successfully!', token, user });
};

// POST /api/auth/login
export const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  const token = generateToken({ id: user.id, email: user.email });
  const { password: _, ...safeUser } = user;

  res.json({ success: true, message: 'Login successful!', token, user: safeUser });
};

// GET /api/auth/me
export const getMe = (req, res) => {
  const user = db.prepare('SELECT id, full_name, email, phone, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
  res.json({ success: true, user });
};
