# 🧠 MindJournal - Mental Health Journaling Application

A comprehensive mental health journaling application built with React frontend and Node.js backend, designed to help users track their mood, productivity, and overall mental wellness.

## ✨ Features

- **Journal Entries**: Create, read, update, and delete journal entries
- **Mood Tracking**: Rate your mood on a scale of 1-10 with visual indicators
- **Productivity Monitoring**: Track daily productivity levels
- **Sentiment Analysis**: Automatic sentiment detection based on journal content
- **Analytics Dashboard**: Visual charts and insights into mood patterns
- **User Authentication**: Secure login/registration with JWT tokens
- **Responsive Design**: Mobile-first design that works on all devices
- **Dark Mode**: Toggle between light and dark themes
- **Data Export**: Export your journal data for backup

## 🏗️ Architecture

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB
- **Authentication**: JWT + bcrypt
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate Limiting

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp env.example .env
   ```

4. **Configure environment variables:**
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/mindjournal
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   ```

5. **Start the server:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend/journal
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173`

## 🔑 Demo Credentials

For testing purposes, you can use these demo credentials:

**Register a new account:**
- Name: Any name you prefer
- Email: `demo@example.com`
- Password: `demo123`

**Or use existing account:**
- Email: `demo@example.com`
- Password: `demo123`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Profile
```http
GET /auth/profile
Authorization: Bearer <JWT_TOKEN>
```

#### Update Profile
```http
PUT /auth/profile
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "name": "John Smith",
  "preferences": {
    "darkMode": true
  }
}
```

#### Change Password
```http
PUT /auth/change-password
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "currentPassword": "password123",
  "newPassword": "newpassword123"
}
```

### Journal Endpoints

#### Create Journal Entry
```http
POST /journal
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "content": "Today was a great day! I accomplished many things.",
  "mood": 8,
  "productivity": 7,
  "weather": {
    "condition": "Sunny",
    "temperature": 75,
    "location": "New York"
  },
  "tags": ["productive", "happy"],
  "moodFactors": {
    "sleep": 8,
    "exercise": 7,
    "social": 9,
    "work": 8
  }
}
```

#### Get All Entries
```http
GET /journal?page=1&limit=10&sort=-createdAt
Authorization: Bearer <JWT_TOKEN>
```

#### Get Single Entry
```http
GET /journal/:entryId
Authorization: Bearer <JWT_TOKEN>
```

#### Update Entry
```http
PUT /journal/:entryId
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "mood": 9,
  "content": "Updated content here"
}
```

#### Delete Entry
```http
DELETE /journal/:entryId
Authorization: Bearer <JWT_TOKEN>
```

#### Get Analytics
```http
GET /journal/analytics?timeRange=week
Authorization: Bearer <JWT_TOKEN>
```

#### Search Entries
```http
GET /journal/search?q=happy&page=1&limit=10
Authorization: Bearer <JWT_TOKEN>
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with configurable salt rounds
- **Rate Limiting**: Prevents abuse with configurable limits
- **Input Validation**: Comprehensive validation using express-validator
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet Security**: Various HTTP headers for security
- **MongoDB Injection Protection**: Mongoose prevents NoSQL injection

## 📊 Data Models

### User Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  preferences: {
    darkMode: Boolean,
    notifications: {
      dailyReminder: Boolean,
      weeklyReport: Boolean,
      moodAlerts: Boolean
    }
  },
  isActive: Boolean,
  timestamps: true
}
```

### Journal Entry Schema
```javascript
{
  user: ObjectId (ref: User),
  content: String (required),
  mood: Number (1-10, required),
  productivity: Number (1-10, required),
  weather: {
    condition: String,
    temperature: Number,
    location: String,
    icon: String
  },
  sentiment: String (positive/negative/neutral),
  tags: [String],
  moodFactors: {
    sleep: Number (1-10),
    exercise: Number (1-10),
    social: Number (1-10),
    work: Number (1-10)
  },
  activities: [String],
  goals: [String],
  gratitude: [String],
  timestamps: true
}
```

## 🎨 Frontend Components

- **Dashboard**: Overview of mood, productivity, and recent entries
- **Journal Entry**: Form for creating new journal entries
- **Analytics**: Charts and insights into mood patterns
- **Settings**: User preferences and account management
- **Navigation**: Responsive navigation with mobile support

## 🚀 Deployment

### Backend Deployment
1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set strong JWT secret
4. Use PM2 or similar process manager
5. Set up reverse proxy (Nginx)

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy to Vercel, Netlify, or similar
3. Update API base URL in production

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend/journal
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

If you encounter any issues:

1. Check the console for error messages
2. Verify MongoDB connection
3. Check environment variables
4. Review API documentation
5. Open an issue on GitHub

## 🔮 Future Enhancements

- [ ] Weather API integration
- [ ] AI-powered mood insights
- [ ] Social features and sharing
- [ ] Mobile app (React Native)
- [ ] Export to various formats (PDF, CSV)
- [ ] Integration with health apps
- [ ] Reminder notifications
- [ ] Group therapy features

---

**Built with ❤️ for mental health awareness and wellness tracking.**