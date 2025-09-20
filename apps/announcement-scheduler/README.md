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
ROOT FOLDER: announcement-scheduler/
├── package.json              ← Main app configuration & dependencies
├── .env                      ← Environment variables (like API keys)
├── README.md                 ← Documentation for developers
├── INSTRUCTIONS.txt          ← This file!
├── 
├── server/                   ← BACKEND (The brain of your app)
│   ├── index.js             ← Main server file - handles API requests
│   ├── database.js          ← Database functions (save/load announcements)
│   └── announcements.db     ← SQLite database file (created automatically)
├── 
├── client/                   ← FRONTEND (Admin interface merchants see)
│   ├── package.json         ← React app configuration
│   ├── public/
│   │   └── index.html       ← Basic HTML template
│   └── src/
│       ├── index.js         ← React app entry point
│       ├── App.js           ← Main app wrapper with Shopify styling
│       └── components/
│           └── AnnouncementManager.js ← Admin interface component
└── 
└── theme-integration/        ← SHOPIFY THEME FILES
    └── announcement-bar.liquid ← Code to display announcements on storefront

```

## 🚀 Running the App
### 🔹 Option 1 – Local Setup (development)

This option is for running and modifying the app on your own machine.

1. Install dependencies

npm install
cd client && npm install && cd ..


2. Run development servers

npm run dev


Backend API → http://localhost:3000

Admin frontend → http://localhost:3001

3. Build frontend (only when changes are made in client/) - optional
This compiles the React app into static files so the backend can serve them.

cd client
npm run build
cd ..
npm start


Visit http://localhost:3000
 → you’ll see the admin panel served directly by the backend.

Reminder: run npm run build every time you change something in the client/ code and want to preview it without npm run dev.

4. Add to your Shopify theme
4.1. Copy integration files:

cp theme-integration/snippets/announcement-bar.liquid ../theme-amper/snippets/
cp theme-integration/assets/announcement-bar.css ../theme-amper/assets/
cp theme-integration/assets/announcement-bar.js ../theme-amper/assets/


4.2. Include snippet in theme.liquid (right after <body>):

{% render 'announcement-bar' %}

### 🔹 Option 2 – Hosted Demo (testing only)

For quick testing, the app is already deployed on Render.

Admin UI: https://shopify-portfolio.onrender.com

API: https://shopify-portfolio.onrender.com/api

This allows you to explore features without setting up locally.


### Admin Panel (http://localhost:3001 or http://localhost:3000 if served by backend)

- Create announcements with title, message, dates, and styles  
- Manage existing announcements (activate, edit, delete)  
- See active/inactive status  

### API Endpoints

- `GET /api/announcements` – List announcements  
- `POST /api/announcements` – Create announcement  
- `PUT /api/announcements/:id` – Update announcement  
- `DELETE /api/announcements/:id` – Delete announcement  
- `GET /api/announcements/active` – Get active announcement  
- `GET /api/reset` – Delete All Announcements

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