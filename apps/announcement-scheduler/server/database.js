const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database file
const dbPath = path.join(__dirname, 'announcements.db');
const db = new sqlite3.Database(dbPath);

// Initialize database
function initDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create announcements table
      db.run(`CREATE TABLE IF NOT EXISTS announcements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        start_date DATETIME NOT NULL,
        end_date DATETIME NOT NULL,
        is_active BOOLEAN DEFAULT 1,
        background_color TEXT DEFAULT '#000000',
        text_color TEXT DEFAULT '#ffffff',
        link_url TEXT,
        shop_domain TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) {
          console.error('Error creating table:', err);
          reject(err);
        } else {
          console.log('Database initialized successfully');
          resolve();
        }
      });
    });
  });
}

// Database operations
const dbOperations = {
  // Get all announcements for a shop
  getAllAnnouncements: (shopDomain) => {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM announcements WHERE shop_domain = ? ORDER BY created_at DESC",
        [shopDomain],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  },

  // Get active announcement for current date
  getActiveAnnouncement: (shopDomain) => {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      db.get(
        `SELECT * FROM announcements 
         WHERE shop_domain = ? 
         AND is_active = 1 
         AND start_date <= ? 
         AND end_date >= ? 
         ORDER BY created_at DESC 
         LIMIT 1`,
        [shopDomain, now, now],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  },

  // Create new announcement
  createAnnouncement: (announcement) => {
    return new Promise((resolve, reject) => {
      const {
        title, message, start_date, end_date, background_color,
        text_color, link_url, shop_domain
      } = announcement;
      
      db.run(
        `INSERT INTO announcements 
         (title, message, start_date, end_date, background_color, text_color, link_url, shop_domain)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, message, start_date, end_date, background_color, text_color, link_url, shop_domain],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...announcement });
        }
      );
    });
  },

  // Update announcement
  updateAnnouncement: (id, announcement) => {
    return new Promise((resolve, reject) => {
      const {
        title, message, start_date, end_date, is_active,
        background_color, text_color, link_url
      } = announcement;
      
      db.run(
        `UPDATE announcements 
         SET title = ?, message = ?, start_date = ?, end_date = ?, 
             is_active = ?, background_color = ?, text_color = ?, link_url = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [title, message, start_date, end_date, is_active, background_color, text_color, link_url, id],
        function(err) {
          if (err) reject(err);
          else resolve({ id, ...announcement });
        }
      );
    });
  },

  // Delete announcement
  deleteAnnouncement: (id) => {
    return new Promise((resolve, reject) => {
      db.run("DELETE FROM announcements WHERE id = ?", [id], function(err) {
        if (err) reject(err);
        else resolve({ deletedId: id });
      });
    });
  },

  // Reset DB - Remove all Announcements
  deleteAllAnnouncements: async () => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM announcements', function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ changes: this.changes });
      }
    });
  });
}

};

module.exports = { initDatabase, dbOperations, db };
