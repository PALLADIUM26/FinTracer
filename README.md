<!---```markdown-->
# 💰 FinTracer

FinTracer is a full-stack personal finance tracker that allows users to log, manage, and visualize their income and expenses. It supports CSV/PDF export, JWT authentication, and clean UI features like dark mode and category-wise charts.

---

## ⚙️ Tech Stack

**Frontend**  
- HTML, CSS, JavaScript  
- Charts via Chart.js

**Backend**  
- Python, Flask  
- Flask-JWT-Extended for auth  
- SQLAlchemy ORM  
- MySQL database

---

## 📁 Project Structure

```
FinTracer/
│
├── frontend/              # Frontend static files
│   ├── index.html
│   ├── app.js
│   └── styles.css
│
├── backend/
│   ├── app.py             # Main Flask application
│   ├── db.py              # DB init logic
│   ├── models/            # SQLAlchemy models
│   │   ├── user.py
│   │   └── transaction.py
│   ├── routes/            # Modular routes (Blueprints)
│   │   ├── auth.py
│   │   ├── transactions.py
│   │   └── export.py
|   ├── requirements.txt   # Python dependencies
│   └── .env               # Environment variables
│
├── .gitignore             # gitignore file
│
└── README.md              # You're here!
```
<!--│   ├── fonts/             # Font for PDF generation-->
---

## 🚀 Features

- ✅ User authentication (register/login) with JWT
- ✅ Add/view/delete income & expenses
- ✅ Filter and group by date/category/type
- ✅ Export transactions as CSV or PDF
- ✅ Dual pie charts (expense vs income, and expense category-wise)
- ✅ Dark mode toggle

---

## 🛠️ Setup Instructions

### 1. Clone the repo

  ```bash
    git clone https://github.com/PALLADIUM26/FinTracer.git
    cd FinTracer
  ```

### 2. Set up the backend

1. Create a virtual environment (optional but recommended):

   ```bash
   python -m venv venv
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   ```

2. Install dependencies:

   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. Configure `.env` in the `backend/` folder:

   ```env
   DATABASE_URL=mysql+pymysql://root:yourpassword@localhost/db2
   JWT_SECRET_KEY=your-secret-key
   ```

4. Run the backend server:

   ```bash
   cd backend
   python app.py
   ```

> ✅ Runs on: `http://localhost:5000`

---

### 3. Set up the frontend

1. Go to the frontend directory:

   ```bash
   cd frontend
   ```

2. Start a local server:

   * If using VS Code, run **Live Server**
   * Or use:

   ```bash
   python -m http.server 5500
   ```

> ✅ Opens at: `http://localhost:5500`

---

## 🔑 API Overview

| Method | Route                | Description               |
| ------ | -------------------- | ------------------------- |
| POST   | `/auth/register`     | Register a new user       |
| POST   | `/auth/login`        | Login and get JWT token   |
| GET    | `/transactions`      | Fetch user's transactions |
| POST   | `/transactions`      | Add new transaction       |
| DELETE | `/transactions/<id>` | Delete transaction        |
| GET    | `/export/csv`        | Download CSV              |
| GET    | `/export/pdf`        | Download PDF              |

**Note**: Authenticated routes require `Authorization: Bearer <token>` in headers.

---

## 📸 Screenshots/Demo

<!--*Add screenshots here of your app UI, charts, login page, etc.*-->
<img alt="page"><br>
<img alt="charts"><br>
<img alt="downloads"><br>


---

## 📌 To Do

* [ ] Add update/edit transaction feature
* [ ] Add recurring transactions
* [ ] Deploy <!--to Render/Netlify/Vercel-->
* [ ] Add unit tests

---

## 🧑‍💻 Author

**Pranith Dutta**
🔗 [GitHub](https://github.com/PALLADIUM26)

