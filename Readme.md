# 📊 **KAM Lead Management System**

A **Key Account Manager (KAM) Lead Management System** built to efficiently manage **Restaurants**, **Contacts**, and **Interactions**, providing an intuitive interface for streamlined operations.

---

## 🚀 **Features**

- 🏢 **Manage Restaurants:** Add, update, and track restaurant details.  
- 📇 **Manage Contacts:** Maintain and organize contacts effortlessly.  
- 📅 **Manage Interactions:** Keep track of communications and follow-ups.  
- 🔒 **Authentication:** User login and access control.  
- 📊 **Metrics Dashboard:** Analytics and key performance indicators (KPIs).  
- 🌐 **Tech Stack:**  
   - **Frontend:** React.js, Vite with Material-UI  
   - **Backend:** Flask with SQLAlchemy + Redis + Gunicorn  
   - **Database:** PostgreSQL  

---

## 📋 **Prerequisites**

Ensure the following tools are installed on your system:

- **Node.js** (v16+)
- **Python** (v3.8+)
- **PostgreSQL**
- **Git**
- **Redis (v6+)**
- **Gunicorn**
- **npm** or **yarn**
- **pip**

---

## ⚙️ **Setup Instructions**

### 🛠️ **1. Clone the Repository**
```bash
git clone https://github.com/CulturalProfessor/kam-system
cd kam-system
```

---

### 🐍 Backend Setup

1. **Navigate to the Backend Directory:**
   ```bash
   cd server
   ```

2. **Create and Activate a Virtual Environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables:**  
   Create a `.env` file in the **server** directory with the following content:
   ```
   SECRET_KEY=some-super-secret-key
   DATABASE_URL=your-db-url
   JWT_SECRET_KEY=some-random-value
   CACHE_REDIS_URL=redis://localhost:6379/0
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_DB=0
   API_URL=http://127.0.0.1:5000/api
   ```

5. **Initialize and Apply Migrations:**
   ```bash
   flask db init
   flask db migrate -m "Initial migration"
   flask db upgrade
   ```

6. **Run the Backend Server:**
   ```bash
   python3 app.py
   ```
   The backend will be accessible at [http://127.0.0.1:5000](http://127.0.0.1:5000).

---

### Frontend Setup

1. **Navigate to the Frontend Directory:**
   ```bash
   cd client
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```
   (Or `yarn install` if you prefer Yarn.)

3. **Configure Environment Variables:**  
   Create a `.env` file in the **frontend** directory with the following content:
   ```
   VITE_SERVER_URL=http://127.0.0.1:5000/api
   ```

4. **Start the Frontend Server:**
   ```bash
   npm run dev
   ```
   The frontend will be accessible at [http://127.0.0.1:5173](http://127.0.0.1:5173).

---

## Running the Full Application

1. **Start the Backend Server:**  
   Open a terminal and run:
   ```bash
   flask run
   ```

2. **Start the Frontend Server:**  
   Open another terminal and run:
   ```bash
   npm run dev
   ```
   Now you can access the full application at [http://127.0.0.1:5173](http://127.0.0.1:5173).

---

## 🚀 **Deployment Guide**

### **Backend Deployment with Gunicorn & Redis**

#### 1. **Choose a Platform for Deployment**
You can deploy the backend on platforms like **Render**, **Heroku**, or **AWS EC2**.  
We'll use **Render** for this example.

#### 2. **Setup Redis on Render:**
- Add a **Redis Addon** in Render (if using free tier).
- The **Redis URL** will be provided by Render, and should replace the local Redis URL in the `.env` file.

#### 3. **Deploy the Backend on Render:
- Push your code to a GitHub repository and connect it with Render.
- Set up the environment variables in Render’s dashboard.
- Deploy the app using Gunicorn with:
```bash
gunicorn -b 0.0.0.0:5000 app:flask_app
```

### **Frontend Deployment on Vercel**
#### 1. Vercel Deployment:
Connect your GitHub repository to Vercel.
Vercel automatically detects the frontend framework (Vite) and handles the build and deployment.
#### 2. Environment Variables on Vercel:
Set the following environment variable for the frontend on Vercel:

```bash
VITE_SERVER_URL=https://your-backend-url.onrender.com/api
```

---

## Additional Notes

- Ensure PostgreSQL is running locally or have any other deployed instance, and the `DATABASE_URL` in the `.env` file matches your database configuration.
- Use `npm` or `yarn` based on your preference to install and manage frontend dependencies.
- For any issues, check the terminal logs for debugging information.
