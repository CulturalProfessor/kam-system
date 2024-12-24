# KAM Lead Management System

This project is a Key Account Manager (KAM) Lead Management System designed to manage restaurants, contacts, and interactions efficiently.

## Features

- Manage Restaurants, Contacts, and Interactions
- Backend: Flask with SQLAlchemy
- Frontend: React with Material-UI
- PostgreSQL database integration

## Prerequisites

- **Node.js** (v16+)
- **Python** (v3.8+)
- **PostgreSQL**
- **Git**
- **npm** or **yarn**
- **pip**

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-folder>
```

---

### Backend Setup

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
   SECRET_KEY=your-secret-key
   DATABASE_URL=postgresql://username:password@localhost/db_name
   ```

5. **Initialize and Apply Migrations:**
   ```bash
   flask db init
   flask db migrate -m "Initial migration"
   flask db upgrade
   ```

6. **Run the Backend Server:**
   ```bash
   flask run
   ```
   The backend will be accessible at [http://127.0.0.1:5000](http://127.0.0.1:5000).

---

### Frontend Setup

1. **Navigate to the Frontend Directory:**
   ```bash
   cd frontend
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

## Additional Notes

- Ensure PostgreSQL is running locally, and the `DATABASE_URL` in the `.env` file matches your database configuration.
- Use `npm` or `yarn` based on your preference to install and manage frontend dependencies.
- For any issues, check the terminal logs for debugging information.
