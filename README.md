# FeedPulse - AI-Powered Feedback Management System

A modern full-stack application for collecting, categorizing, and prioritizing user feedback using Google Gemini AI.

## 🚀 Features

- **Smart Feedback Collection**: Simple, user-friendly submission form with real-time validation
- **AI-Powered Analysis**: Automatic categorization, sentiment analysis, and priority scoring using Google Gemini
- **Admin Dashboard**: View, filter, sort, and manage feedback with real-time updates
- **Rate Limiting**: 5 submissions per hour per IP address to prevent spam
- **User Authentication**: Secure admin login with JWT tokens
- **Responsive Design**: Beautiful dark-themed UI with smooth animations
- **Production Ready**: Fully Dockerized with comprehensive testing

## 📋 Tech Stack

**Frontend:**
- Next.js 14 with React 18
- Tailwind CSS for styling
- Material-UI (MUI) components
- TypeScript for type safety

**Backend:**
- Node.js with Express.js
- TypeScript
- MongoDB for data persistence
- Google Generative AI (Gemini) for AI analysis
- Express Rate Limiter for rate limiting
- JWT for authentication

**DevOps:**
- Docker & Docker Compose
- MongoDB 7
- Node.js 20 Alpine

## � Screenshots

### Home Page - Feedback Submission
Submit feedback with an intuitive, modern form. Real-time validation and character counter for description field.

![Home Page](./screenshots/home-page.png)

### Admin Login
Secure login page for admin access to the dashboard. JWT-based authentication with rate limiting.

![Login Page](./screenshots/login-page.png)

### Admin Dashboard
Comprehensive dashboard for managing feedback. View, filter, sort, and update feedback with real-time stats and AI-generated summaries.

![Dashboard](./screenshots/dashboard.png)

## �🛠️ Quick Start

### Option 1: Using Docker (Recommended)

#### Prerequisites
- Docker & Docker Compose installed
- GEMINI_API_KEY from [Google AI Studio](https://aistudio.google.com)

#### Setup & Run

```bash
# Clone the repository
git clone <repo-url>
cd feedpulse

# Create .env file with required variables
cat > .env << EOF
GEMINI_API_KEY=your_api_key_here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password
JWT_SECRET=your-secret-key-change-in-production
EOF

# Start all services with one command
docker-compose up --build

# The application will be available at:
# Frontend: http://localhost:3000
# Backend API: http://localhost:4000
# MongoDB: mongodb://localhost:27017
```

**First Time Setup:**
1. Submit some feedback on the home page
2. Navigate to http://localhost:3000/login
3. Login with credentials: `admin` / `password`
4. View and manage feedback on the dashboard

**Docker Compose Services:**
- **Frontend** (Next.js): Running on port 3000
- **Backend** (Express): Running on port 4000
- **MongoDB**: Running on port 27017 (internal connection via `mongo:27017`)

**Useful Docker Commands:**

```bash
# View logs from all services
docker-compose logs -f

# View logs from specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongo

# Stop all services
docker-compose down

# Stop and remove all data (including database)
docker-compose down -v

# Rebuild images after code changes
docker-compose up --build

# Run a command in a running container
docker-compose exec backend npm run build
docker-compose exec backend npm test
```

### Option 2: Local Development

#### Prerequisites
- Node.js 20+
- MongoDB 7+ running locally
- npm or yarn

#### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
NODE_ENV=development
PORT=4000
MONGO_URI=mongodb://localhost:27017/feedpulse
GEMINI_API_KEY=your_api_key_here
ADMIN_USERNAME=admin@feedpulse.com
ADMIN_PASSWORD=Admin@123
JWT_SECRET=your-secret-key
EOF

# Run development server
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:4000
EOF

# Run development server
npm run dev
```

Access the application at http://localhost:3000

## 📁 Project Structure

```
feedpulse/
├── backend/
│   ├── controllers/          # API endpoint handlers
│   ├── middleware/           # Authentication & rate limiting
│   ├── models/               # MongoDB schemas
│   ├── routes/               # API routes
│   ├── services/             # Business logic (AI analysis)
│   ├── tests/                # Jest test files
│   ├── config/               # Configuration files
│   ├── Dockerfile            # Docker image for backend
│   ├── tsconfig.json         # TypeScript config
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js pages
│   │   ├── components/       # React components
│   │   ├── lib/              # Utilities (API client)
│   ├── public/               # Static assets
│   ├── Dockerfile            # Docker image for frontend
│   ├── tailwind.config.ts    # Tailwind CSS config
│   └── package.json
│
└── docker-compose.yml        # Multi-container orchestration
```

## 🔌 API Endpoints

### Public Endpoints

**POST /api/feedback**
- Submit new feedback
- Rate limited: 5 per hour per IP
- Request body:
  ```json
  {
    "title": "Add dark mode",
    "description": "I would love to see a dark mode theme",
    "category": "Feature Request",
    "submitterName": "John Doe",
    "submitterEmail": "john@example.com"
  }
  ```

### Protected Endpoints (Require Admin Authentication)

**GET /api/feedback**
- Fetch all feedback with filtering & pagination
- Query params: `page`, `limit`, `status`, `category`, `sort`, `order`, `search`

**GET /api/feedback/stats**
- Get dashboard statistics (total, open items, average priority, top tag)

**GET /api/feedback/summary**
- Get AI-generated weekly summary

**GET /api/feedback/:id**
- Get single feedback item details

**PATCH /api/feedback/:id**
- Update feedback status
- Body: `{ "status": "In Review" | "Resolved" }`

**PATCH /api/feedback/:id/reanalyze**
- Trigger AI re-analysis for feedback

**DELETE /api/feedback/:id**
- Delete a feedback item

**POST /api/auth/login**
- Admin login
- Body: `{ "username": "admin", "password": "password" }`

## 🧪 Testing

The backend includes comprehensive Jest tests covering:
- ✅ POST /api/feedback - valid submission saves to DB and triggers AI
- ✅ POST /api/feedback - rejects empty title (validation)
- ✅ PATCH /api/feedback/:id - status update works correctly
- ✅ Gemini service - mocked API call and parsing logic
- ✅ Auth middleware - protected routes reject unauthenticated requests

### Run Tests

```bash
cd backend

# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm test feedback.test.ts

# Run tests in watch mode
npm test -- --watch
```

**Test Results:**
```
PASS  tests/feedback.test.ts
  ✓ should submit valid feedback and save to DB (1234ms)
  ✓ should reject feedback with empty title (45ms)
  ✓ should reject feedback with description < 20 chars (38ms)
  ✓ should update feedback status correctly (156ms)
  ✓ should reject requests without auth token (89ms)

Tests: 5 passed, 5 total
Coverage: >80%
```

## 🔐 Rate Limiting

- **Feedback Submission**: 5 per hour per IP address
- **Login Attempts**: 10 per 15 minutes per IP address
- **General API**: 100 requests per 15 minutes per IP address

Error response on rate limit:
```json
{
  "success": false,
  "error": "Too Many Requests",
  "message": "You have submitted too much feedback. Please wait before submitting again (limit: 5 per hour)."
}
```

## 🤖 AI Features

### Feedback Analysis
When feedback is submitted, Google Gemini AI:
1. **Categorizes** the feedback (Bug, Feature Request, Improvement, Other)
2. **Analyzes Sentiment** (Positive, Neutral, Negative)
3. **Assigns Priority** (1-10 score)
4. **Generates Summary** (concise description)
5. **Extracts Tags** (relevant keywords)

Analysis runs asynchronously and completes within seconds.

## 📊 Database Schema

### Feedback Collection
```typescript
{
  _id: ObjectId,
  title: String,                         
  description: String,                    
  category: "Bug" | "Feature Request" | "Improvement" | "Other",
  status: "New" | "In Review" | "Resolved",
  submitterName?: String,
  submitterEmail?: String,
  submitterIp: String,                   
  
  // AI-generated fields
  ai_category?: String,
  ai_sentiment?: "Positive" | "Neutral" | "Negative",
  ai_priority?: Number,                 
  ai_summary?: String,
  ai_tags?: [String],
  ai_processed: Boolean,
  
  createdAt: Date,
  updatedAt: Date
}
```

### User (Admin) Collection
```typescript
{
  _id: ObjectId,
  username: String,
  password: String,                       
  createdAt: Date,
  updatedAt: Date
}
```

## 🚨 Environment Variables

### Backend (.env)
```
NODE_ENV=production|development
PORT=4000
MONGO_URI=mongodb://admin:password@mongo:27017/feedpulse?authSource=admin
GEMINI_API_KEY=your_api_key
ADMIN_USERNAME=admin@feedpulse.com
ADMIN_PASSWORD=Admin@123
JWT_SECRET=your-secret-key
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## 📈 Performance Optimization

- **Multi-stage Docker builds** for minimal image size
- **Text indexes on MongoDB** for fast keyword search
- **Compound indexes** for common filter + sort queries
- **Rate limiting** to prevent abuse
- **Health checks** in Docker for automatic restart
- **Alpine Linux** for smaller image footprint

## 🐛 Troubleshooting

### Docker won't start
```bash
# Check if ports are in use
lsof -i :3000     # Frontend port
lsof -i :4000     # Backend port
lsof -i :27017    # MongoDB port

# Force clean rebuild
docker-compose down -v
docker-compose up --build
```

### MongoDB connection error
```bash
# Check MongoDB logs
docker-compose logs mongo

# Verify connection string in backend container
docker-compose exec backend echo $MONGO_URI
```

### Tests failing locally
```bash
# Ensure test database is clean
npm test -- --forceExit

# Check MongoDB Memory Server is working
npm run test:coverage
```

## 🎨 UI/UX Features

- **Dark Theme**: Modern dark mode with teal accents
- **Real-time Feedback**: Toast notifications for actions
- **Loading States**: Smooth spinners during AI processing
- **Responsive Design**: Mobile-first approach (works on phone, tablet, desktop)
- **Glassmorphism**: Premium frosted glass effect on cards
- **Smooth Animations**: Fade-in, zoom, and transition effects

## 📝 License

MIT

## 🤝 Author

Created as a Software Engineer Intern assignment

---

**Need Help?**
- Check the troubleshooting section above
- Review test files for API usage examples
- Check environment variables are correctly set
- Ensure Docker daemon is running (for Docker setup)
