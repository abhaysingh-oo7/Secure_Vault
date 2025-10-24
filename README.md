# 🛡️ Secure Vault

![Static Badge](https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge&logo=react)
![Static Badge](https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge&logo=node.js)
![Static Badge](https://img.shields.io/badge/Database-MongoDB-darkgreen?style=for-the-badge&logo=mongodb)

> _"Your passwords deserve Gotham-level protection — welcome to Secure Vault."_

---

## ✨ Overview

**Secure Vault** is a modern, end-to-end encrypted password manager built with **React**, **Node.js**, and **MongoDB**.  
All passwords are encrypted **client-side** using **AES-GCM** before they ever touch the database — ensuring **zero-knowledge security**.

---


Vault
# Vault Project Screenshots

## 1. Vault (Home Page)
<p align="center">
  <img src="https://github.com/abhaysingh-oo7/Secure_Vault/blob/main/Frontend/src/assets/home%20page.png?raw=true" width="400" style="border-radius:10px; box-shadow: 2px 2px 12px rgba(0,0,0,0.3);">
</p>
<p align="center"><em>The landing page of the Vault app, showing an overview of available features.</em></p>

---

## 2. Login Page
<p align="center">
  <img src="https://github.com/abhaysingh-oo7/Secure_Vault/blob/main/Frontend/src/assets/loginpage.png?raw=true" width="400" style="border-radius:10px; box-shadow: 2px 2px 12px rgba(0,0,0,0.3);">
</p>
<p align="center"><em>Users can securely log in to access their personal vault items.</em></p>

---

## 3. Add Item Page
<p align="center">
  <img src="https://github.com/abhaysingh-oo7/Secure_Vault/blob/main/Frontend/src/assets/items%20page.png?raw=true" width="400" style="border-radius:10px; box-shadow: 2px 2px 12px rgba(0,0,0,0.3);">
</p>
<p align="center"><em>Interface for adding new items to the vault with details and encryption.</em></p>

---

## 🚀 Features

✅ **User Authentication**  
- Secure JWT-based registration & login  
- Automatic logout on inactivity  

✅ **Client-Side Encryption**  
- AES-GCM encryption before saving data  
- Decryption only happens locally on the client  

✅ **Vault Management**  
- Add, view, and delete encrypted items  
- Show/hide decrypted passwords securely  
- Elegant, animated, and responsive design  

✅ **Security-First Architecture**  
- Per-user encryption key derived via PBKDF2  
- Passwords never transmitted in plaintext  
- Token-based authentication on all routes  

---

## 🧱 Tech Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend** | React, Tailwind CSS, Lucide Icons |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose |
| **Encryption** | Web Crypto API (AES-GCM, PBKDF2) |
| **Auth** | JWT (JSON Web Tokens) |

---


---

## ⚡ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/secure-vault.git
cd secure-vault
```

### 2️⃣ Setup the Backend
```bash
cd Backend
npm install
```
### 3️⃣ Setup the Frontend
```bash
cd Frontend
npm install
npm run dev
```

## 🔐 Security Architecture

- 🧩 **Passwords and vault data are never sent in plaintext.**

- 🔑 A **unique AES-GCM encryption key** is derived from each user's password using **PBKDF2** with a per-user salt.

- 🗄️ The backend only stores:
  - `title`
  - `username`
  - `notes`
  - Encrypted `ciphertext`
  - Initialization vector `iv`

- 💻 The decrypted password exists **only in memory** during your active session and is never saved to disk or transmitted to the server.

> 🧠 **Even if the database is compromised**, attackers cannot decrypt passwords without the user's derived encryption key.

### 🧩 Encryption & Decryption Flow

```
flowchart LR
    A[User enters Master Password] --> B[PBKDF2 Derives AES Key (with Salt)]
    B --> C[Encrypt Password using AES-GCM]
    C --> D[Send Encrypted Data + IV to Backend]
    D -->|Store Only Encrypted Fields| E[(Database)]
    
    E --> F[User Logs In Again]
    F --> G[Derive Same AES Key Locally]
    G --> H[Decrypt Ciphertext → Plain Password in Memory]
```

## 🕒 Auto Logout on Inactivity

- ⏳ The app includes an **automatic logout mechanism** that monitors user activity such as **mouse movement** and **keyboard input**.  
- 💤 If the user remains inactive beyond a specified threshold (**default: 10 minutes**), their session is automatically terminated.  
- 🔐 Upon timeout:
  - The user's **JWT token is cleared** from local storage.
  - The user is **securely redirected** to the login page.
  - All in-memory sensitive data (like decrypted passwords) is cleared.



## 🙏 Thank You



