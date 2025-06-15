# 🧠 MindFlow - A MERN Stack Social Media Platform

MindFlow is a modern social media application built with the **MERN** stack (MongoDB, Express, React, Node.js). It allows users to register, connect with others, share thoughts via posts, comment, follow/unfollow, and personalize their profiles—all with real-time experiences and a clean, responsive UI.

## Screenshot Video and Image:

Homepage
![MindFlow Screenshot](https://raw.githubusercontent.com/emancht/MindFlow/refs/heads/main/frontend/src/assets/screencapture-localhost-5173-feed.png)

Login
![MindFlow Screenshot](https://raw.githubusercontent.com/emancht/MindFlow/refs/heads/main/frontend/src/assets/screencapture-localhost-5173-login.png)

Profile
![MindFlow Screenshot](https://raw.githubusercontent.com/emancht/MindFlow/refs/heads/main/frontend/src/assets/screencapture-localhost-5173-profile.png)

---

## 🔧 Tech Stack

### 🖥️ Frontend

- React (with Vite)
- Tailwind CSS
- Lucide React Icons
- React Router DOM

### 🌐 Backend

- Node.js & Express
- MongoDB with Mongoose
- JWT (JSON Web Token) Authentication
- Nodemailer (for OTP-based verification)
- Express Middleware (e.g., `cors`, `express.json`)

---

## 🚀 Features

- 🔐 **User Authentication**
  - OTP-based registration and email verification
  - JWT-secured login and session management
- 📝 **Post Management**
  - Create, update, and delete posts with image uploads
  - Like and dislike posts
  - Tagging system with popular tags feed
- 💬 **Comment System**
  - Add, view, and delete comments on posts
- 🧑‍🤝‍🧑 **User Interaction**
  - Follow/unfollow users
  - Suggested users to connect with
  - View and edit profiles
- 📰 **News Feed**
  - Personalized feed based on followed users

---

## 🔐 Environment Variables (`.env`)

Set these in both frontend and backend for correct configuration:

```env
# Backend
PORT=port
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLIENT_URL=your-client-url

EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

## 🧪 Sample Routes

### 🔑 Auth

```http
POST   /api/auth/register
POST   /api/auth/verify-otp
POST   /api/auth/resend-otp
POST   /api/auth/login
GET    /api/auth/logout
GET    /api/auth/me
```

### 🧵 Posts

```http
POST   /api/posts/
GET    /api/posts/
GET    /api/posts/feed
GET    /api/posts/tags
GET    /api/posts/:id
PUT    /api/posts/:id
PUT    /api/posts/:id/like
PUT    /api/posts/:id/dislike
DELETE /api/posts/:id
```

### 💬 Comments

```http
POST   /api/comments/:postId
GET    /api/comments/:postId
DELETE /api/comments/:id
```

### 👤 User

```http
GET    /api/users/profile/:id
PUT    /api/users/profile
PUT    /api/users/follow/:id
PUT    /api/users/unfollow/:id
GET    /api/users/suggestions
```

---

## 🛠️ Setup Instructions

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🤝 Contribution

Feel free to fork the repo and submit pull requests to improve the platform!

---

## 📝 License

MIT License

---

## 👨‍💻 Author

- **Eman Chakma**
