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
    // Display announcement
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

        // Create message (with optional link)
        let contentElement;
        if (announcement.link_url) {
            contentElement = document.createElement('a');
            contentElement.href = announcement.link_url;
            contentElement.textContent = announcement.message;
        } else {
            contentElement = document.createElement('span');
            contentElement.textContent = announcement.message;
        }
        bar.appendChild(contentElement);

        // Create close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-btn';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', () => {
            localStorage.setItem(dismissedKey, 'true');
            bar.style.display = 'none';
        });
        bar.appendChild(closeBtn);

        // Append to container
        container.appendChild(bar);
    }


  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAnnouncement);
  } else {
    loadAnnouncement();
  }
})();