# Urvann Mini Plant Store 🌱

A full-stack mini plant store application built with **Node.js + Express + MongoDB (Mongoose)** for backend and **React.js** for frontend.  

This project allows users to browse plants, filter by category, search, and manage plant inventory. It also includes auto-seeding of plants if the database is empty and works with in-memory storage as a fallback.

---

## **Features**

- Browse plant listings with categories and prices
- Search plants by name or category
- Filter by category or availability (`inStock`)
- Add, edit, and delete plants (via API)
- Auto-seed database with sample plant data
- Fallback to in-memory storage if MongoDB is not connected
- Serves React frontend from `/client/build` if available
- Responsive and easy-to-use interface

---

## **Project Structure**

```
project-root/
├── client/             # React frontend
│   ├── public/
│   └── src/
├── server.js           # Express backend
├── package.json
├── package-lock.json
└── .gitignore
```

---

## **Tech Stack**

- **Frontend:** React.js, CSS  
- **Backend:** Node.js, Express.js, MongoDB via Mongoose  
- **Database:** MongoDB Atlas (cloud)  
- **Deployment:** Railway (or any Node.js compatible platform)  

---

## **Setup Instructions (Local)**

1. Clone the repository:

```bash
git clone <your-repo-url>
cd <repo-folder>
```

2. Install backend dependencies:

```bash
npm install
```

3. Install frontend dependencies and build:

```bash
cd client
npm install
npm run build
cd ..
```

4. Create a `.env` file in the root folder:

```env
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=your_database_name   # optional if included in URI
PORT=4000                       # optional, defaults to 4000
```

5. Start the server:

```bash
node server.js
```

6. Open in browser:  
```
http://localhost:4000
```

---

## **API Endpoints**

- `GET /api/health` → Check server & DB status  
- `GET /api/plants` → List all plants (query params: `search`, `category`, `inStock`)  
- `GET /api/plants/sample` → Get sample plants (6)  
- `POST /api/plants` → Add a new plant  
- `PUT /api/plants/:id` → Edit plant by ID  
- `DELETE /api/plants/:id` → Delete plant by ID  
- `GET /api/categories` → List all categories  

---

## **Deployment on Railway**

1. Connect your GitHub repository to Railway.  
2. Set environment variables in Railway:

```
MONGODB_URI=your_mongodb_uri
MONGODB_DB=plantstore           # optional if included in URI
PORT= (leave empty, Railway sets automatically)
```

3. Pre-deploy command (optional, for React build):

```bash
cd client && npm install --omit=dev && npm run build && cd ..
```

4. Deploy the project → Railway assigns a public URL.  
5. Check API health:

```
https://your-railway-project.up.railway.app/api/health
```

---

## **Notes**

- Do **not commit `.env` or sensitive information** to GitHub.  
- MongoDB must allow **network access** (add Railway’s IP in Atlas if needed).  
- For production, React frontend API calls should use **relative paths** (`/api/...`) instead of `localhost`.  

---

## **License**

MIT License © 2025

---

## **Author**

Yatish Verma

