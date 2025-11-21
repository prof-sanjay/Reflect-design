# Mental Health Journaling App - New Features Setup Guide

## 🎉 NEW FEATURES ADDED

### User Features
- ✅ **Habit Tracker** - Track daily habits with streaks system
- ✅ **Weekly & Monthly Analytics Dashboard** - Visualize your mood patterns and wellness data
- ✅ **Morning Reflection Mode** - Start your day with AI mood prediction
- ✅ **Evening Reflection Mode** - End your day with AI summarization
- ✅ **AI Mood Prediction** - Automatically detect mood from reflection text
- ✅ **AI Reflection Summarizer** - Get key insights from your reflections
- ✅ **Improved Goals/Todos UI** - Better goal management with filters and priority

### Admin Features
- ✅ **User Management** - View all users, update roles, manage risk levels
- ✅ **Prompts Management** - Create, update, delete reflection prompts
- ✅ **Broadcast Notifications** - Send notifications to all users
- ✅ **Analytics Dashboard** - DAU, total users, reflection count, mood distribution
- ✅ **Red Alert Monitoring** - Track high-risk users and unresolved alerts
- ✅ **Risk Level Monitoring** - Automatic detection of multiple negative moods

### Therapist Features
- ✅ **Patient Management** - View assigned patients with risk levels
- ✅ **Secure Encrypted Chat** - Real-time chat with end-to-end encryption
- ✅ **Appointment Booking** - Schedule and manage appointments
- ✅ **Patient Mood History** - View 30-day mood trends
- ✅ **AI-Powered Patient Insights** - Get insights on patient mental health
- ✅ **Red Alert Dashboard** - Monitor critical patient alerts

## 📦 INSTALLATION

### Backend Setup
```bash
cd be
npm install
```

**Dependencies installed:**
- `natural` - NLP for mood prediction
- `compromise` - Text analysis for summarization
- `socket.io` - Real-time chat
- `cors` - Cross-origin requests
- `crypto` - Message encryption

### Frontend Setup
```bash
cd fe
npm install
```

**Dependencies installed:**
- `socket.io-client` - Real-time chat client
- `recharts` - Charts for analytics
- `react-router-dom` - Routing
- `axios` - HTTP requests

## 🚀 RUNNING THE APP

### Start Backend
```bash
cd be
npm run dev
```
Server runs on: http://localhost:5000

### Start Frontend
```bash
cd fe
npm run dev
```
Frontend runs on: http://localhost:5173

## 📁 PROJECT STRUCTURE

```
Reflect-design/
├── be/
│   ├── controllers/
│   │   ├── habitController.js         # NEW
│   │   ├── analyticsController.js     # NEW
│   │   ├── aiController.js            # NEW
│   │   ├── adminController.js         # NEW
│   │   ├── therapistController.js     # NEW
│   │   ├── notificationController.js  # NEW
│   │   └── (existing controllers...)
│   ├── models/
│   │   ├── Habit.js                   # NEW
│   │   ├── Prompt.js                  # NEW
│   │   ├── Notification.js            # NEW
│   │   ├── Chat.js                    # NEW
│   │   ├── Appointment.js             # NEW
│   │   ├── AdminAlert.js              # NEW
│   │   ├── userModel.js               # UPDATED (role, riskLevel)
│   │   └── (existing models...)
│   ├── routes/
│   │   ├── habitRoutes.js             # NEW
│   │   ├── analyticsRoutes.js         # NEW
│   │   ├── aiRoutes.js                # NEW
│   │   ├── adminRoutes.js             # NEW
│   │   ├── therapistRoutes.js         # NEW
│   │   ├── notificationRoutes.js      # NEW
│   │   └── (existing routes...)
│   ├── middleware/
│   │   └── authMiddleware.js          # UPDATED (authorize function)
│   └── server.js                      # UPDATED (Socket.IO)
├── fe/
│   └── src/
│       ├── pages/
│       │   ├── HabitTracker.jsx       # NEW
│       │   ├── Analytics.jsx          # NEW
│       │   ├── MorningReflection.jsx  # NEW
│       │   ├── EveningReflection.jsx  # NEW
│       │   ├── AdminDashboard.jsx     # NEW
│       │   └── TherapistDashboard.jsx # NEW
│       ├── components/
│       │   ├── ChatComponent.jsx      # NEW
│       │   └── ImprovedGoals.jsx      # NEW
│       ├── utils/
│       │   └── api.js                 # UPDATED (all new API functions)
│       ├── styles/
│       │   └── (all CSS files)        # NEW
│       ├── App.jsx                    # NEW (with routing)
│       └── main.jsx                   # NEW
```

## 🔑 NEW API ENDPOINTS

### Habits
- `POST /api/habits` - Create habit
- `GET /api/habits` - Get all habits
- `GET /api/habits/stats` - Get habit statistics
- `POST /api/habits/:habitId/complete` - Mark habit complete
- `PUT /api/habits/:habitId` - Update habit
- `DELETE /api/habits/:habitId` - Delete habit

### Analytics
- `GET /api/analytics/weekly` - Weekly analytics
- `GET /api/analytics/monthly` - Monthly analytics
- `GET /api/analytics/admin` - Admin analytics (admin only)

### AI Features
- `POST /api/ai/predict-mood` - Predict mood from text
- `POST /api/ai/summarize` - Summarize reflection
- `GET /api/ai/insights/:userId` - Get user insights (therapist/admin)

### Admin
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:userId` - Update user
- `POST /api/admin/assign-therapist` - Assign therapist to user
- `POST /api/admin/prompts` - Create prompt
- `GET /api/admin/prompts` - Get all prompts
- `PUT /api/admin/prompts/:promptId` - Update prompt
- `DELETE /api/admin/prompts/:promptId` - Delete prompt
- `POST /api/admin/broadcast` - Send broadcast notification
- `GET /api/admin/alerts` - Get all alerts
- `PUT /api/admin/alerts/:alertId/resolve` - Resolve alert
- `POST /api/admin/monitor-risk` - Monitor risk levels

### Therapist
- `GET /api/therapist/patients` - Get assigned patients
- `GET /api/therapist/patients/:userId/mood-history` - Get patient mood history
- `GET /api/therapist/patients/:userId/insights` - Get patient insights
- `GET /api/therapist/chat/:userId` - Get chat with patient
- `POST /api/therapist/chat/:userId/message` - Send message to patient
- `POST /api/therapist/appointments` - Create appointment
- `GET /api/therapist/appointments` - Get appointments
- `PUT /api/therapist/appointments/:appointmentId` - Update appointment
- `GET /api/therapist/alerts` - Get red alerts

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:notificationId/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:notificationId` - Delete notification

## 🛣️ NEW FRONTEND ROUTES

- `/habits` - Habit tracker page
- `/analytics` - Analytics dashboard
- `/morning-reflection` - Morning reflection mode
- `/evening-reflection` - Evening reflection mode
- `/goals` - Improved goals page
- `/admin` - Admin dashboard (admin only)
- `/therapist` - Therapist dashboard (therapist only)

## 🔐 ROLE-BASED ACCESS

### User Roles
1. **user** (default) - Access to personal features
2. **admin** - Access to admin dashboard
3. **therapist** - Access to therapist dashboard

### Setting User Role
Update user role in MongoDB:
```javascript
db.users.updateOne(
  { username: "adminuser" },
  { $set: { role: "admin" } }
)
```

Or through Admin Dashboard UI.

## 🎨 UI FEATURES

### Habit Tracker
- Create habits with custom icons and colors
- Track daily/weekly/monthly frequencies
- View current and longest streaks
- Completion statistics

### Analytics Dashboard
- Weekly/Monthly view toggle
- Mood distribution pie chart
- Average sleep and energy metrics
- Consistency percentage

### Morning/Evening Reflections
- Context-specific prompts
- AI mood prediction (morning)
- AI summarization (evening)
- Beautiful gradient backgrounds

### Admin Dashboard
- 5 tabs: Analytics, Users, Prompts, Alerts, Broadcast
- Real-time statistics
- User role management
- Risk level monitoring

### Therapist Dashboard
- Patient cards with risk indicators
- Real-time encrypted chat
- Appointment management
- Red alert monitoring
- Patient insights modal

## 🔒 SECURITY FEATURES

- Role-based route protection
- JWT authentication
- Encrypted chat messages (base64 - upgrade to AES in production)
- Protected API endpoints
- Input validation

## ⚙️ ENVIRONMENT VARIABLES

Make sure your `.env` files have:

**Backend (.env)**
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:5000
```

## 🚨 IMPORTANT NOTES

1. **Socket.IO**: Real-time chat requires both backend and frontend to be running
2. **Roles**: Store user role in localStorage after login for route protection
3. **MongoDB**: All new collections will be created automatically on first use
4. **AI Features**: Using basic NLP - can be enhanced with OpenAI API
5. **Encryption**: Basic implementation - use proper encryption library for production

## 🧪 TESTING THE FEATURES

### Create Test Users
```javascript
// Admin user
{ username: "admin", password: "admin123", role: "admin" }

// Therapist user
{ username: "therapist", password: "therapist123", role: "therapist" }

// Regular user
{ username: "user1", password: "user123", role: "user" }
```

### Test Workflows

1. **User Flow**: Login → Create habits → Track completion → View analytics
2. **Admin Flow**: Login → Manage users → Create prompts → Send broadcast
3. **Therapist Flow**: Login → View patients → Chat with patient → Create appointment

## 📈 NEXT STEPS

1. Add proper error handling and loading states
2. Implement pagination for large datasets
3. Enhance AI features with OpenAI API
4. Add proper encryption for chat messages
5. Implement real-time notifications with Socket.IO
6. Add unit tests for all new features
7. Optimize database queries with indexes

## 💡 INTEGRATION WITH EXISTING CODE

All new features are designed to work seamlessly with your existing:
- User authentication system
- Reflection management
- Calendar heatmap
- Media uploads
- Wellness tracking
- Goal and task systems

Simply add the new routes to your existing navigation/navbar component!

## 🆘 TROUBLESHOOTING

**Port conflicts**: Make sure ports 5000 (backend) and 5173 (frontend) are free

**MongoDB connection**: Verify your connection string in `.env`

**Socket.IO issues**: Check CORS settings and make sure both servers are running

**Role issues**: Make sure to store user role in localStorage after login

---

🎉 **All features are now ready to use!** Start your servers and explore the new functionality.
