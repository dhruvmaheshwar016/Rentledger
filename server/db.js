import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, 'rentledger.db'));

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ─── Schema ───────────────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name   TEXT    NOT NULL,
    email       TEXT    NOT NULL UNIQUE,
    phone       TEXT    NOT NULL,
    password    TEXT    NOT NULL,
    created_at  TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS properties (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id      INTEGER NOT NULL,
    name         TEXT    NOT NULL,
    address      TEXT    NOT NULL,
    city         TEXT    NOT NULL,
    state        TEXT    NOT NULL,
    pincode      TEXT    NOT NULL,
    property_type TEXT   DEFAULT 'residential',
    total_units  INTEGER DEFAULT 1,
    created_at   TEXT    DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS tenants (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id      INTEGER NOT NULL,
    property_id  INTEGER NOT NULL,
    full_name    TEXT    NOT NULL,
    email        TEXT,
    phone        TEXT    NOT NULL,
    unit_number  TEXT,
    status       TEXT    DEFAULT 'active',
    created_at   TEXT    DEFAULT (datetime('now')),
    FOREIGN KEY (user_id)     REFERENCES users(id)       ON DELETE CASCADE,
    FOREIGN KEY (property_id) REFERENCES properties(id)  ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS leases (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER NOT NULL,
    tenant_id       INTEGER NOT NULL,
    property_id     INTEGER NOT NULL,
    monthly_rent    REAL    NOT NULL,
    security_deposit REAL   DEFAULT 0,
    start_date      TEXT    NOT NULL,
    end_date        TEXT,
    due_day         INTEGER DEFAULT 1,
    status          TEXT    DEFAULT 'active',
    created_at      TEXT    DEFAULT (datetime('now')),
    FOREIGN KEY (user_id)     REFERENCES users(id)       ON DELETE CASCADE,
    FOREIGN KEY (tenant_id)   REFERENCES tenants(id)     ON DELETE CASCADE,
    FOREIGN KEY (property_id) REFERENCES properties(id)  ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS payments (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id      INTEGER NOT NULL,
    lease_id     INTEGER NOT NULL,
    tenant_id    INTEGER NOT NULL,
    amount       REAL    NOT NULL,
    month        TEXT    NOT NULL,
    status       TEXT    DEFAULT 'pending',
    payment_mode TEXT    DEFAULT 'upi',
    upi_ref      TEXT,
    paid_date    TEXT,
    notes        TEXT,
    created_at   TEXT    DEFAULT (datetime('now')),
    FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE CASCADE,
    FOREIGN KEY (lease_id)  REFERENCES leases(id)  ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
  );
`);

export default db;
