# Fullstack Rating App

## How to Run

### 1. Backend

- Copy `.env.example` to `.env` and fill in your database credentials.
- Install dependencies:
  ```
  cd backend
  npm install
  ```
- Start the backend server:
  ```
  node server.js
  ```
  (or `npx nodemon server.js`)

### 2. Frontend

- Install dependencies:
  ```
  cd frontend
  npm install
  ```
- Start the frontend:
  ```
  npm start
  ```

### 3. Database

- Make sure PostgreSQL is running.
- Create the database and tables as described in your backend code or provide a SQL file if needed.

---

- Backend runs at [http://localhost:5000](http://localhost:5000)
- Frontend runs at [http://localhost:3000](http://localhost:3000)

---

### 1. Clean Up Your Project

- **Delete all `node_modules` folders** from both `backend` and `frontend`:
  - Open `c:\Users\LENOVO\fullstack-rating-app\backend` and delete the `node_modules` folder.
  - Open `c:\Users\LENOVO\fullstack-rating-app\frontend` and delete the `node_modules` folder.

---

### 2. Add a Sample Environment File

- In `c:\Users\LENOVO\fullstack-rating-app\backend`, create a file named `.env.example` with:
  ```
  DATABASE_URL=postgres://youruser:yourpassword@localhost:5432/ratings
  JWT_SECRET=your_jwt_secret
  ```

---

### 3. Add a README File

- In `c:\Users\LENOVO\fullstack-rating-app`, create a file named `README.md` with these instructions:
