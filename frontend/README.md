# 🧰 Syntra Safety Defect Reporting System

A minimal full-stack web app where **employees** can report safety defects and **admins** can view, manage, and update them.  
Built as part of **The Syntra** coding challenge.

---

## 🚀 Tech Stack

**Frontend:** React.js + Axios + Tailwind CSS  
**Backend:** Node.js + Express.js  
**Database:** MongoDB (Mongoose ODM)

---

## 📂 Folder Structure

syntra/
│
├── backend/
│ ├── models/
│ │ └── Defect.js
│ ├── routes/
│ │ └── defectRoutes.js
│ ├── server.js
│ └── .env
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── EmployeeForm.jsx
│ │ │ ├── EmployeeList.jsx
│ │ │ └── AdminPanel.jsx
│ │ ├── api/
│ │ │ └── axiosInstance.js
│ │ └── App.jsx
│ └── package.json
│
└── README.md

yaml
Copy code

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repo
```bash
git clone https://github.com/anwerfaiz86/syntra-repository.git
cd syntra
2️⃣ Backend Setup
bash
Copy code
cd backend
npm install
Create .env file inside backend/:

ini
Copy code
PORT=5000
MONGO_URI=your_mongodb_connection_string
Run backend:

bash
Copy code
npm start
3️⃣ Frontend Setup
bash
Copy code
cd ../frontend
npm install
npm run dev
🌐 API Endpoints
Method	Endpoint	Description
POST	/api/defects	Create new defect
GET	/api/defects	List all defects (Admin)
GET	/api/defects?role=employee&id=<empId>	Get employee-specific defects
PATCH	/api/defects/:id	Update defect status or notes
GET	/api/defects/counts	(Optional) Summary counts

💡 Features
Employee defect reporting form

Image upload support

Admin dashboard for managing defects

Status update & notes

Real-time refresh/polling (optional)

Clean folder structure

Simple role toggle (Employee/Admin)

🧾 Deliverables
✅ Working app hosted or local

✅ Short walkthrough video (2–5 min)

✅ GitHub repo with clean commits

✅ README with setup & scope

