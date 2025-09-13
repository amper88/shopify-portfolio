# Announcement Scheduler - Shopify App

A custom Shopify app that lets you schedule announcement bars with start and end dates, fully manageable from an admin panel.

## Main Features

- Schedule announcements with start and end dates  
- Customize background and text colors  
- Optional links to make announcements clickable  
- Responsive design for desktop and mobile  
- Admin panel built with Shopify Polaris  
- Dismissible announcements (customers can close the bar)  
- Lightweight SQLite database for storage  

## Project Structure

```
announcement-scheduler/
├── server/                 # Backend (Node.js + Express)
│   ├── index.js
│   ├── database.js
│   └── announcements.db
├── client/                 # Frontend (React + Polaris)
│   ├── src/
│   │   ├── App.js
│   │   └── components/
│   │       └── AnnouncementManager.js
│   └── package.json
├── theme-integration/      # Shopify theme integration
│   └── announcement-bar.liquid
└── package.json
```

## Quick Start

1. **Install dependencies**

```bash
npm install
cd client && npm install && cd ..
```

2. **Run development servers**

```bash
npm run dev
```

- Backend API: http://localhost:3000  
- Admin frontend: http://localhost:3001  

3. **Add to your Shopify theme**

Copy the snippet:

```bash
cp theme-integration/announcement-bar.liquid ../theme-amper/snippets/
```

Include it in `layout/theme.liquid` right after `<body>`:

```liquid
{% render 'announcement-bar' %}
```

## Usage

### Admin Panel (http://localhost:3001)

- Create announcements with title, message, dates, and styles  
- Manage existing announcements (activate, edit, delete)  
- See active/inactive status  

### API Endpoints

- `GET /api/announcements` – List announcements  
- `POST /api/announcements` – Create announcement  
- `PUT /api/announcements/:id` – Update announcement  
- `DELETE /api/announcements/:id` – Delete announcement  
- `GET /api/announcements/active` – Get active announcement  

## Testing

1. Create a test announcement in the admin panel (e.g., “Welcome! 20% OFF today”).  
2. Update your theme with the snippet.  
3. Preview the store: the announcement bar should appear at the top.  

## Storefront Behavior

- Displays automatically when within date range  
- Applies chosen colors and message  
- Clickable if a link is set  
- Can be dismissed (saved in localStorage)  
- Works across desktop and mobile  

## Database Schema

```sql
CREATE TABLE announcements (
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
);
```