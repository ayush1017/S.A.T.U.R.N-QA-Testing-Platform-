# SATURN – Software Assurance Testing & Unified Reporting Network

An AI-powered QA assistant that helps software testers generate test cases, create structured bug reports, generate test data, and get instant answers to software testing queries.

Built with **React**, **Node.js**, and **Generative AI** (Gemini / OpenAI).

## Features

| Feature | Description |
|---------|-------------|
| **Test Case Generator** | Generate scenarios, positive, negative, and edge cases from requirements |
| **Bug Report Generator** | Create professional bug reports with severity, priority, and steps |
| **QA Chat Assistant** | Ask testing questions, get explanations, generate automation scripts |
| **Test Data Generator** | Generate names, emails, phones, addresses for form testing |
| **PDF Export** | Export test cases, bug reports, and test data as PDF |

## Tech Stack

- **Frontend:** React, Tailwind CSS, React Router, jsPDF
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **AI:** Google Gemini API or OpenAI API

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local install or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A Gemini API key ([Google AI Studio](https://aistudio.google.com/apikey)) or OpenAI API key

### 1. Clone and install

```bash
cd SATURN

# Backend
cd backend
cp .env.example .env
# Edit .env and add your API key
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment

Edit `backend/.env`:

```env
PORT=3001
MONGODB_URI=mongodb://127.0.0.1:27017/saturn
AI_PROVIDER=gemini
GEMINI_API_KEY=your_actual_api_key_here
JWT_SECRET=your_jwt_secret_here
AUTH_USERNAME=admin
AUTH_PASSWORD=saturn123

# Feedback emails (Gmail: enable 2FA and create an App Password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FEEDBACK_TO_EMAIL=your_email@gmail.com
```

To use OpenAI instead:

```env
AI_PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Run the app

```bash
# Terminal 1 – Backend
cd backend
npm run dev

# Terminal 2 – Frontend
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

Sign in with the default admin account: **admin** / **saturn123** (created automatically on first startup).

## Database

SATURN uses MongoDB to store:

- **Users** – login credentials (passwords hashed with bcrypt)
- **Test Cases** – generated test case history per user
- **Bug Reports** – generated bug report history per user
- **Chat Messages** – QA chat conversation history per user
- **Test Data** – generated test data history per user

Make sure MongoDB is running before starting the backend. On first launch, a default admin user is seeded if one does not exist.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |
| GET | `/api/auth/me` | Get current user (requires auth) |
| POST | `/api/test-cases/generate` | Generate test cases |
| GET | `/api/test-cases/history` | Get test case history |
| POST | `/api/bug-reports/generate` | Generate bug report |
| GET | `/api/bug-reports/history` | Get bug report history |
| POST | `/api/chat` | QA chat assistant |
| GET | `/api/chat/history` | Get chat history |
| POST | `/api/test-data/generate` | Generate test data |
| GET | `/api/test-data/history` | Get test data history |

## Project Structure

```
SATURN/
├── backend/
│   ├── config/          # DB connection & seed
│   ├── models/          # Mongoose models (User, TestCase, etc.)
│   ├── routes/          # API route handlers
│   ├── middleware/      # Auth middleware
│   ├── services/        # AI service (Gemini/OpenAI)
│   ├── server.js        # Express server
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/  # Shared UI components
│   │   ├── pages/       # Feature pages
│   │   ├── services/    # API client
│   │   └── utils/       # PDF export utilities
│   └── public/
└── README.md
```

## Roadmap (v2.0)

- Playwright / Selenium script generation
- API testing module
- Jira integration
- AI defect analysis
- Test execution tracking

## License

MIT
