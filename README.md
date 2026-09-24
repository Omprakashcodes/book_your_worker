# BookYourWorker

BookYourWorker is a MERN stack web application designed to make it easier for users to discover and book skilled workers such as electricians, plumbers, cleaners, and other service professionals.

## 🚀 Project Overview

Finding a reliable worker for household or local services can be difficult and time-consuming. BookYourWorker aims to provide a simple platform where users can find workers, view their profiles, and book services.

## ✨ Features

- 🔐 User authentication and authorization
- 👤 User profile management
- 🧑‍🔧 Worker profile management
- 📄 Worker document upload
- 🔎 Worker discovery
- 📅 Worker booking system
- ⭐ Review and rating system
- 🔔 Notification system
- 💳 Payment integration
- 🛡️ Secure backend APIs
- ✅ Input validation and error handling

## 🛠️ Tech Stack

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3
- Vite

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Authentication & Security
- JWT
- bcrypt
- Express Validator
- Helmet
- CORS
- Cookie Parser

### Development Tools
- Git
- GitHub
- VS Code
- Thunder Client

## 📁 Project Structure

```text
BookYourWorker/
├── client/
├── server/
├── .gitignore
├── package.json
└── README.md
```

## Run Locally

Prerequisites: Node.js, Docker Desktop, and a Razorpay test account.

1. Start MongoDB:

	```powershell
	docker start bookmyworker-mongodb
	```

	If the container does not exist yet:

	```powershell
	docker run -d --name bookmyworker-mongodb -p 27017:27017 -v bookmyworker-mongodb-data:/data/db mongo:8
	```

2. Add Razorpay test credentials to `server/.env`:

	```env
	RAZORPAY_KEY_ID=rzp_test_your_key_id
	RAZORPAY_KEY_SECRET=your_razorpay_test_secret
	```

3. Start the backend in one terminal:

	```powershell
	cd server
	npm run dev
	```

4. Start the frontend in a second terminal:

	```powershell
	cd client
	npm run dev
	```

Open `http://localhost:3000`. A booking now creates a Razorpay test order and is only submitted after the backend verifies the payment signature.

Login currently uses email and password. Mobile OTP login is disabled until the feature is added again.

To create the development admin account once:

```powershell
cd server
node createAdmin.js
```