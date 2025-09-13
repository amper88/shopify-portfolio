const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initDatabase, dbOperations } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// Initialize database
initDatabase().catch(console.error);

// Helper function to get shop domain from request
function getShopDomain(req) {
  // In a real app, you'd get this from Shopify session/headers
  // For development, we'll use a query param or default
  return req.query.shop || req.headers['x-shop-domain'] || 'amper-myportfolio.myshopify.com';
}

// API Routes

// Get all announcements
app.get('/api/announcements', async (req, res) => {
  try {
    const shopDomain = getShopDomain(req);
    const announcements = await dbOperations.getAllAnnouncements(shopDomain);
    res.json({ success: true, data: announcements });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get active announcement (for storefront)
app.get('/api/announcements/active', async (req, res) => {
  try {
    const shopDomain = getShopDomain(req);
    const announcement = await dbOperations.getActiveAnnouncement(shopDomain);
    res.json({ success: true, data: announcement });
  } catch (error) {
    console.error('Error fetching active announcement:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new announcement
app.post('/api/announcements', async (req, res) => {
  try {
    const shopDomain = getShopDomain(req);
    const announcementData = {
      ...req.body,
      shop_domain: shopDomain
    };
    
    const newAnnouncement = await dbOperations.createAnnouncement(announcementData);
    res.status(201).json({ success: true, data: newAnnouncement });
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update announcement
app.put('/api/announcements/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAnnouncement = await dbOperations.updateAnnouncement(id, req.body);
    res.json({ success: true, data: updatedAnnouncement });
  } catch (error) {
    console.error('Error updating announcement:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete announcement
app.delete('/api/announcements/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await dbOperations.deleteAnnouncement(id);
    res.json({ success: true, message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Reset DB - Remove all announcements
// Reset announcements (solo testing/portfolio)
app.get('/api/reset', async (req, res) => {
  try {
    await dbOperations.deleteAllAnnouncements();
    res.json({ success: true, message: 'Database reset' });
  } catch (err) {
    console.error('Error resetting DB:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});



// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Announcement Scheduler API is running!' });
});

// Serve React app (for production) or simple admin page
app.get('/', (req, res) => {
  const buildPath = path.join(__dirname, '../client/build', 'index.html');
  try {
    res.sendFile(buildPath);
  } catch {
    res.send(`
      <h1>🎯 Announcement Scheduler Admin</h1>
      <p>Your Shopify app is running!</p>
      <h3>API Status: ✅ Active</h3>
      <p><strong>Next steps:</strong></p>
      <ol>
        <li>Build React admin: <code>cd client && npm run build</code></li>
        <li>Test API: <a href="/api/health">/api/health</a></li>
        <li>View announcements: <a href="/api/announcements">/api/announcements</a></li>
      </ol>
      <p><a href="https://github.com/shopify" target="_blank">📚 Shopify Development Docs</a></p>
    `);
  }
});

app.get('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Announcement Scheduler App running on port ${PORT}`);
  console.log(`📊 Admin interface: http://localhost:${PORT}`);
  console.log(`🔗 API endpoint: http://localhost:${PORT}/api`);
});

module.exports = app;
