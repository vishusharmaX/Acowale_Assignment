# Acowale CRM - Customer Feedback CRM

An enterprise-ready, full-stack Customer Feedback CRM containing a **Public Feedback Portal** and a **Real-Time Admin Dashboard**. Built as a robust SaaS application with responsive layouts, premium animations, rate-limiting, and detailed charts analytics.

Developed by **Vishwajeet Sharma**.

---

## 🐮 Key Features

### 1. Public Feedback Portal
* **High-Converting Landing UI**: Purple-to-indigo gradient patterns, glassmorphic content cards, and smooth hover transformations.
* **star rating selection**: Dynamic star ratings with micro-animations and highlight states on hover.
* **Form Validation**: Client-side validation managed through Zod and React Hook Form (email validation, character bounds).
* **Toast Alerts**: Success and failure alerts provided instantly by React Hot Toast.

### 2. Admin CRM Dashboard
* **Dynamic Metric Cards**: Calculates total volume, today's submission counts, weekly totals, and average star ratings on load with custom count-up animations.
* **Recharts Visualization**:
  * **Feedback Trend**: A line chart plotting submission patterns over the last 7 days.
  * **Category Distribution**: A pie chart showing the percentage of each submission topic.
  * **Feedback Volume**: A bar chart comparing total submissions across categories.
* **Data Grid Table**: Responsive table showing customer name, email, category badge, message preview, and creation date.
* **Search & Filter Panel**: Real-time search with a debounced input delay, filterable categories, and rating volume filters.
* **Details Preview Drawer**: View the full message, metadata, and copy customer email addresses to the clipboard with one click.
* **Delete Modality**: Safely delete records with a verification popup to prevent accidental data loss.

### 3. Production & Security Configurations
* **Helmet Security Headers**: Secured Express endpoints against scripting exploits.
* **Morgan Logger**: Unified terminal streams logging requests and status returns.
* **API Rate Limiter**: Strict IP-based rate limiting on feedback submissions to prevent spam.
* **Centralized Error Boundary**: Custom express catcher converting database schema exceptions and CastErrors to formatted JSON.

### 4. Advanced Extras
* **Dark Mode Native Support**: Toggles dark mode styling classes across the DOM, persisting configurations to `localStorage`.
* **CSV Statistics Exporter**: Download filtered CRM records into spreadsheet files directly from the browser.
* **Mock Seeder Tool**: Seed 9 pre-filled mock feedback entries to test dashboard charts immediately.

---

## 📂 Project Structure

```text
acowale-crm/ (workspace root)
├── client/                     # Frontend (React + Vite + Tailwind)
│   ├── src/
│   │   ├── components/         # Reusable UI widgets (ThemeToggle, Sidebar, Form, Modal)
│   │   ├── context/            # Persisted state providers (ThemeContext)
│   │   ├── hooks/              # Custom React utilities (useDebounce)
│   │   ├── layouts/            # Page structures (AdminLayout, PublicLayout)
│   │   ├── pages/              # Landing portal and Dashboard pages
│   │   ├── services/           # Axios endpoints declarations (api.js)
│   │   ├── utils/              # Client-side tools (csvExport.js)
│   │   ├── routes/             # Client routing mapping (AppRoutes.jsx)
│   │   ├── App.jsx             # React entry wrapper
│   │   ├── index.css           # Global custom styles and Tailwind imports
│   │   └── main.jsx            # DOM compiler mount
│   ├── tailwind.config.js      # Styling design tokens config
│   └── package.json            # Frontend script dependencies
│
├── server/                     # Backend MVC API (Node + Express)
│   ├── config/                 # Database configurations (db.js)
│   ├── controllers/            # Route logic (feedbackController, analyticsController)
│   ├── middlewares/            # Error catches and Rate limiters
│   ├── models/                 # Database schema templates (Feedback.js)
│   ├── routes/                 # Express API routes mapping
│   ├── utils/                  # JSON response formatters
│   ├── validators/             # Body validator constraints (feedbackValidator.js)
│   ├── index.js                # Server express engine boots
│   └── package.json            # Server script dependencies
│
├── DECISIONS.md                # Structural rationales & scalability reports
├── .env.example                # Shared environment variable placeholders
└── .gitignore                  # Git tracking exclusion list
```

---

## 🛠️ Installation & Local Setup

### Prerequisites
* **Node.js** (v18.0.0 or higher recommended)
* **MongoDB** (A local database running on port `27017` OR a MongoDB Atlas cluster URI)

### Steps

#### 1. Clone & Navigate
Ensure you are in the workspace directory containing both the `client/` and `server/` folders.

#### 2. Configure Environment Variables
Create a `.env` file in the **server** directory:
```bash
# server/.env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/acowale-crm
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Create a `.env` file in the **client** directory:
```bash
# client/.env
VITE_API_URL=http://localhost:5000
```

#### 3. Install & Start Backend Server
Navigate to the `server/` directory, install packages, and start the development server:
```bash
cd server
npm install
npm run dev
```
The server will connect to MongoDB and start listening on port `5000`.

#### 4. Install & Start Frontend Client
In a new terminal window, navigate to the `client/` directory, install packages, and start Vite:
```bash
cd client
npm install
npm run dev
```
The client dashboard will compile and open at `http://localhost:5173`.

---

## 📡 API Documentation

### 1. Health Status Check
* **Endpoint**: `GET /health`
* **Access**: Public
* **Response**:
  ```json
  {
    "status": "OK",
    "uptime": 234.56,
    "timestamp": "2026-06-26T03:39:55.000Z",
    "env": "development"
  }
  ```

### 2. Submit Customer Feedback
* **Endpoint**: `POST /api/feedback`
* **Access**: Public (Subject to strict rate limiting: max 10 requests / 10 minutes)
* **Headers**: `Content-Type: application/json`
* **Payload**:
  ```json
  {
    "name": "Sarah Connor",
    "email": "sarah@connor.com",
    "category": "Bug Report",
    "message": "The analytics graphs flicker on loading. Kindly review.",
    "rating": 4
  }
  ```
* **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Feedback submitted successfully",
    "data": {
      "_id": "648f...",
      "name": "Sarah Connor",
      "email": "sarah@connor.com",
      "category": "Bug Report",
      "message": "The analytics graphs flicker on loading. Kindly review.",
      "rating": 4,
      "createdAt": "2026-06-26T03:40:00.000Z",
      "updatedAt": "2026-06-26T03:40:00.000Z"
    }
  }
  ```

### 3. Fetch Feedbacks (Paginated, Searchable & Filterable)
* **Endpoint**: `GET /api/feedback`
* **Access**: Admin Console
* **Query Parameters**:
  * `page` (default: 1)
  * `limit` (default: 10)
  * `search` (Search on name, email, and message body)
  * `category` (Filter: 'Bug Report', 'Feature Request', etc.)
  * `rating` (Filter: 1-5)
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Feedback entries retrieved successfully",
    "data": {
      "feedbacks": [ ... ],
      "pagination": {
        "totalCount": 42,
        "totalPages": 5,
        "currentPage": 1,
        "limit": 10
      }
    }
  }
  ```

### 4. Delete Feedback Record
* **Endpoint**: `DELETE /api/feedback/:id`
* **Access**: Admin Console
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Feedback record deleted successfully"
  }
  ```

### 5. Fetch Dashboard Analytics Aggregations
* **Endpoint**: `GET /api/analytics`
* **Access**: Admin Console
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Dashboard analytics retrieved successfully",
    "data": {
      "summary": {
        "totalFeedback": 9,
        "averageRating": 4.2,
        "todayFeedback": 3,
        "weeklyFeedback": 9,
        "monthlyFeedback": 9
      },
      "categoryDistribution": [
        { "category": "Bug Report", "count": 2 },
        { "category": "Feature Request", "count": 1 }
        // ...
      ],
      "trendData": [
        { "date": "2026-06-20", "count": 0 },
        { "date": "2026-06-26", "count": 3 }
      ],
      "recentActivity": [ ... ]
    }
  }
  ```

---

## 🚀 Deployment Playbook

### Backend API → Render
1. Create a Web Service on **Render**.
2. Connect your GitHub repository.
3. Configure the environment properties:
   * **Root Directory**: `server`
   * **Build Command**: `npm install`
   * **Start Command**: `npm start`
4. Set the Environment Variables under Render dashboard settings:
   * `NODE_ENV=production`
   * `PORT=10000`
   * `MONGO_URI=mongodb+srv://...` (Your MongoDB Atlas connection URI)
   * `CLIENT_URL=https://your-app-front.vercel.app` (Your front-end domain)

### Frontend App → Vercel
1. Create a new project on **Vercel** and connect your GitHub repository.
2. Select your repository. Under **Project Settings**:
   * **Framework Preset**: `Vite`
   * **Root Directory**: `client`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
3. Add the Environment Variable:
   * `VITE_API_URL=https://your-app-back.onrender.com` (Your Render deployment URL)
4. Deploy the project.
