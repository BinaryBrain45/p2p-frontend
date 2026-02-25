# 🚀 AI-Powered Procure-to-Pay (P2P) Matching Engine

### **Live Demo:** [CLICK HERE TO OPEN APP](https://p2p-frontend-woad.vercel.app/)

![Java](https://img.shields.io/badge/Backend-Java%20Spring%20Boot-red)
![React](https://img.shields.io/badge/Frontend-React.js-blue)
![Database](https://img.shields.io/badge/Database-H2%20In--Memory-green)
![Deployment](https://img.shields.io/badge/Cloud-Vercel%20%2B%20Render-orange)

## 📖 Project Overview
This is a full-stack financial reconciliation system designed to automate the **3-Way Matching Process** used in enterprise ERP systems (like SAP/Oracle). 

It validates payments by comparing three critical documents:
1.  **Purchase Order (PO):** What we ordered.
2.  **Goods Receipt (GRN):** What we actually received.
3.  **Vendor Invoice:** What we are being charged.

## 🧠 Key Features & Algorithms
* **Dual-Tolerance Verification:** Implements a smart logic that auto-approves minor discrepancies based on:
    * **Percentage Rule:** Allows variance up to **2%** of the total value.
    * **Hard Cap Rule:** Maximum allowed variance is **$50.00**.
    * *Logic:* The system applies whichever limit is stricter to prevent overpayment.
* **Real-Time Validation:** React Frontend calculates potential matches instantly before sending data to the backend.
* **Microservices Architecture:** * **Frontend:** Hosted on Vercel (React).
    * **Backend:** Hosted on Render (Java Spring Boot REST API).

## 🛠️ Tech Stack
* **Frontend:** Angular.
* **Backend:** Java 17, Spring Boot 3, Hibernate/JPA.
* **Database:** H2 (In-Memory for demo speed).

## 📂 Repository Links
* **Frontend Code:** [\[Current Repo\]](https://github.com/BinaryBrain45/p2p-frontend)
* **Backend API Code:** [\[Backend GitHub Repo\]](https://github.com/BinaryBrain45/p2p-backend)

---
*Built by Jaya Prakash - 2026*
