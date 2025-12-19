# Smart Student Complaint Management System

## 📌 Project Overview
The Smart Student Complaint Management System is a web-based application designed to digitize and streamline the process of handling student complaints in educational institutions. It provides a structured platform where students can raise complaints online, and administrators can efficiently track, manage, and resolve them.

The system improves transparency, reduces manual effort, and ensures accountability by allowing real-time status tracking and admin responses.

---

## 🎯 Objectives
- To digitize the traditional student complaint process
- To reduce manual paperwork and delays
- To ensure faster and transparent complaint resolution
- To provide real-time complaint tracking
- To improve communication between students and administrators

---

## 🧑‍🎓 Student Features
- Secure login and registration
- Submit complaints with title, description, and category
- Upload attachments (image / PDF if enabled)
- View complaint status (Pending / In-Progress / Resolved)
- View admin responses and resolution details
- Transparent tracking of complaint history

---

## 👨‍💼 Admin Features
- Secure admin login
- View all complaints submitted by students
- Separate views for:
  - All Complaints
  - Pending Complaints
  - In-Progress Complaints
  - Resolved Complaints
- Update complaint status
- Add admin response or resolution message
- Responses are stored and visible to students
- Improved accountability and complaint handling

---

## ⚙️ System Workflow
1. Student logs into the system
2. Student submits a complaint
3. Complaint is stored in MongoDB
4. Admin reviews the complaint
5. Admin updates status and adds response
6. Student views updated status and admin response

---

## 🧠 AI-Based Features
- **Complaint Summarization:**  
  Automatically generates a short summary of complaint descriptions to reduce admin reading time.

- **Priority Prediction:**  
  Assigns priority levels (Low / Medium / High) based on complaint content.

*(AI features are designed to assist admins and improve decision-making.)*

---

## 🏗️ System Architecture

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MongoDB

---

## 🧪 Algorithms & Logic Used
- Rule-based logic for complaint categorization
- AI-assisted logic for complaint summary generation
- AI-assisted logic for priority assignment
- REST API-based CRUD operations

---

## 🗃️ Database Design (MongoDB)
Each complaint record contains:
- Student Email
- Complaint Title
- Description
- Category
- Priority
- Status
- Admin Response
- Created Date
- Updated Date

---

## 📊 Result Analysis
- Complaints are successfully submitted and stored
- Admin updates reflect instantly for students
- Improved transparency in complaint handling
- Reduced response time compared to manual systems
- Organized complaint tracking using status-based views

---

## 🚀 How to Run the Project

### Prerequisites
- Node.js installed
- MongoDB running locally or on cloud

### Steps
1. Clone the repository
2. Navigate to backend folder
3. Install dependencies:
npm install

4. Start backend server:


node index.js

5. Open frontend HTML files in browser

---

## 🔮 Future Enhancements
- Mobile application integration
- Email / SMS notifications
- Advanced ML models for priority prediction
- Analytics dashboard for admin insights
- Multi-role support (faculty, warden, department admin)

---

## 🏁 Conclusion
The Smart Student Complaint Management System provides an efficient, transparent, and organized approach to managing student grievances. By combining web technologies with AI-assisted features, the system enhances communication, accountability, and user experience.

---

## 👥 Team Details
- **Afifa Taskeen** – 4MH23CA002  
- **Charitha H K** – 4MH23CA010  

**Project Coordinator:**  
Dr. Agughasi Victor I
