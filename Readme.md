# Knock Notifications System

A complete notification system with Express.js backend and Expo React Native frontend, integrated with Knock.app for email and push notifications.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Expo CLI: `npm install -g @expo/eas-cli`
- Physical device or emulator for testing push notifications

### Install Dependencies
```bash
npm install
```

### Environment Setup
Create `backend/.env` file:
```env
KNOCK_SECRET_API_KEY=your_knock_secret_key_here
PORT=3000
```

### Run Both Services
```bash
# Start both backend and expo dev server
npm run dev

# Backend only
npm run backend

# Expo only  
npm run expo
```

## 📱 Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both backend and Expo dev server |
| `npm run backend` | Start Express.js backend only |
| `npm run expo` | Start Expo development server only |
| `npm run build:android` | Build Android APK with EAS |
| `npm run build:ios` | Build iOS app with EAS |

## 🏗️ Project Structure

```
knock-notifications/
├── backend/                 # Express.js API server
│   ├── routes/
│   │   └── notifications.js # All notification endpoints
│   ├── server.js           # Main server file
│   ├── package.json
│   └── .env               # Environment variables
├── expo-push-demo/         # Expo React Native app
│   ├── App.js             # Main app component
│   ├── app.json           # Expo configuration
│   ├── eas.json           # EAS Build configuration
│   └── package.json
└── package.json           # Root package for concurrently
```

## 🔧 Services

### Backend API (Port 3000)
- **Base URL**: `http://localhost:3000/api/notifications`
- **Provider**: Knock.app integration
- **Features**: Email notifications, push notifications, delayed delivery, user management

### Expo App
- **Platform**: React Native with Expo
- **Build**: EAS Build for production
- **Features**: Push notification handling, token registration, real device testing

## 🎯 Core Features

### ✅ Implemented
- [x] Third-party notification provider (Knock.app)
- [x] Delayed notifications (email & push)
- [x] Push notifications to Expo app
- [x] Email notifications
- [x] User management
- [x] Workflow cancellation
- [x] Token registration

### 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/push-notification` | Send immediate push notification |
| POST | `/delayed-push` | Send delayed push notification |
| POST | `/register-push-token` | Register Expo push token |
| POST | `/immediate-email` | Send immediate email |
| POST | `/delayed-email` | Send delayed email |
| POST | `/cancel` | Cancel delayed notification |
| GET | `/user/:userId` | Get user data |
| POST | `/test-all` | Test all notification types |

## 🔐 Environment Variables

### Backend (.env)
```env
KNOCK_SECRET_API_KEY=sk_test_your_secret_key
PORT=3000
```

## 🧪 Testing

### Test Push Notifications
```bash
curl -X POST http://localhost:3000/api/notifications/push-notification \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-123",
    "title": "Test Push",
    "body": "Testing push notification"
  }'
```

### Test Email Notifications
```bash
curl -X POST http://localhost:3000/api/notifications/immediate-email \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user",
    "userEmail": "test@example.com",
    "userName": "Test User",
    "subject": "Test Email",
    "message": "This is a test email notification"
  }'
```

## 📱 Mobile App Setup

1. **Install EAS CLI**: `npm install -g @expo/eas-cli`
2. **Login to Expo**: `eas login`
3. **Build for development**: `npm run build:android`
4. **Install on device**: Follow EAS build instructions

## 🐛 Troubleshooting

### Common Issues

**Backend not starting:**
- Check `.env` file exists with valid `KNOCK_SECRET_API_KEY`
- Verify port 3000 is available

**Push notifications not working:**
- Ensure using physical device (not simulator)
- Check FCM configuration in Knock dashboard
- Verify Expo project ID matches in Knock channel

**Email notifications not working:**
- Verify Knock email channel is configured
- Check API key permissions in Knock dashboard

## 📚 Documentation

- [Backend API Documentation](./backend/README.md)
- [Expo App Documentation](./expo-push-demo/README.md)
- [Knock.app Documentation](https://docs.knock.app)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.