(function() {
  // Configuration: Remote and local API URLs
  const APP_URL = 'https://shopify-portfolio.onrender.com'; // Deployed backend (Render)
  const LOCAL_APP_URL = 'http://localhost:3000';            // Local development backend - for testing

  // Use local API if running on localhost, otherwise use the deployed API
  const API_BASE = window.location.hostname === 'localhost' ? LOCAL_APP_URL : APP_URL;

  // Store domain (used to scope announcements per shop)
  const shopDomain = window.location.hostname;

  // Fetch active announcement from backend
  async function loadAnnouncement() {
    try {
      const response = await fetch(`${API_BASE}/api/announcements/active?shop=${shopDomain}`);
      const data = await response.json();
      if (data.success && data.data) {
        displayAnnouncement(data.data);
      }
    } catch (error) {
      console.error('Error loading announcement:', error);
    }
  }

  // Render announcement bar in the storefront
  function displayAnnouncement(announcement) {
    const container = document.getElementById('announcement-bar-container');
    if (!container) return;

    // Skip if user already dismissed this announcement
    const dismissedKey = `announcement-dismissed-${announcement.id}`;
    if (localStorage.getItem(dismissedKey)) return;

    // Create main wrapper
    const bar = document.createElement('div');
    bar.id = 'announcement-bar';
    bar.style.backgroundColor = announcement.background_color || '#000000';
    bar.style.color = announcement.text_color || '#ffffff';

    // Build content (message + optional link)
    let content = announcement.message;
    if (announcement.link_url) {
      content = `<a href="${announcement.link_url}">${content}</a>`;
    }

    // Add dismiss/close button
    content += `<button class="close-btn" onclick="dismissAnnouncement(${announcement.id})">&times;</button>`;
    bar.innerHTML = content;
    container.appendChild(bar);

    // Expose dismiss logic to global scope
    window.dismissAnnouncement = function(announcementId) {
      localStorage.setItem(`announcement-dismissed-${announcementId}`, 'true');
      const bar = document.getElementById('announcement-bar');
      if (bar) bar.style.display = 'none';
    };
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAnnouncement);
  } else {
    loadAnnouncement();
  }
})();