# Knock Notifications System

Complete notification system with Express.js backend and React Native Expo frontend, integrated with Knock.app for email and push notifications with note management capabilities.

## Overview

This project demonstrates a full-stack notification system featuring:
- **Note Management App** with scheduled reminders
- **Push Notifications** via Firebase and Knock.app
- **Email Notifications** with delayed delivery
- **Notification Editing** (cancel and recreate functionality)
- **Cross-platform Mobile App** built with Expo

## Project Structure

```
knock-notifications/
├── backend/                    # Express.js API server
│   ├── routes/
│   │   ├── notifications.js    # Notification endpoints
│   │   └── notes.js           # Note CRUD operations
│   ├── server.js              # Main server file
│   ├── package.json
│   ├── .env                   # Environment variables
│   └── README.md              # Backend documentation
├── simple-push-test/          # Expo React Native app
│   ├── components/
│   │   ├── NotesScreen.js     # Note management UI
│   │   ├── CreateNoteScreen.js # Create/edit notes
│   │   └── PushTestScreen.js  # Push notification testing
│   ├── App.js                 # Main app with navigation
│   ├── app.config.js          # Expo configuration
│   ├── google-services.json   # Firebase configuration
│   ├── package.json
│   └── README.md              # App documentation
├── expo-push-demo/            # Original Expo demo (legacy)
└── package.json               # Root package manager
```

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Knock.app account with API keys
- Firebase project (for push notifications)
- Expo CLI: `npm install -g @expo/eas-cli`
- Physical device for push notification testing

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Backend Setup

Create `backend/.env` file:
```env
KNOCK_SECRET_KEY=sk_test_your_secret_key_here
KNOCK_PUBLIC_KEY=pk_test_your_public_key_here
KNOCK_SIGNING_KEY=your_signing_key_here
KNOCK_EXPO_CHANNEL_ID=your_expo_channel_id_here
PORT=3000
NODE_ENV=development
```

### 3. Mobile App Setup

Create `simple-push-test/.env` file:
```env
EXPO_PUBLIC_KNOCK_PUBLIC_KEY=pk_test_your_public_key_here
EXPO_PUBLIC_KNOCK_EXPO_CHANNEL_ID=your_expo_channel_id_here
EXPO_PUBLIC_BACKEND_URL=https://your-ngrok-url.ngrok-free.app
EXPO_PUBLIC_PROJECT_ID=your_expo_project_id_here
```

### 4. Start Development

**Option 1: Start both services:**
```bash
npm run dev
```

**Option 2: Start individually:**
```bash
# Backend only
npm run backend

# Mobile app only (in simple-push-test directory)
cd simple-push-test && npx expo start --tunnel
```

## Core Features

### Note Management
- **Create Notes**: Rich text notes with titles and content
- **Schedule Notifications**: Set reminder notifications for notes
- **Edit Notes**: Update content and notification settings
- **Delete Notes**: Remove notes and cancel associated notifications
- **Auto-sync**: Notes stored on backend with real-time updates

### Notification System
- **Push Notifications**: Firebase-powered notifications to mobile devices
- **Email Notifications**: SMTP-based email delivery via Knock.app
- **Delayed Delivery**: Schedule notifications for future delivery
- **Notification Editing**: Cancel and recreate scheduled notifications
- **Cross-channel**: Support for multiple notification channels

### Mobile App Features
- **Tab Navigation**: Separate tabs for notes and push testing
- **Real-time Updates**: Live connection to backend API
- **Offline Handling**: Graceful handling of network issues
- **Production Ready**: EAS Build support for app store deployment

## API Endpoints

### Notes Management
- `GET /api/notes/user/:userId` - Get all notes for user
- `POST /api/notes` - Create note with optional notification
- `PUT /api/notes/:noteId` - Update note and notification
- `DELETE /api/notes/:noteId` - Delete note and cancel notification

### Notification Management
- `POST /api/notifications/push-notification` - Send immediate push
- `POST /api/notifications/delayed-push` - Schedule push notification
- `POST /api/notifications/immediate-email` - Send immediate email
- `POST /api/notifications/delayed-email` - Schedule email notification
- `PUT /api/notifications/edit-notification` - Edit scheduled notification
- `POST /api/notifications/cancel` - Cancel scheduled notification

### Testing
- `GET /health` - Backend health check
- `POST /api/notifications/test-all` - Test all notification types

## Environment Configuration

### Required Knock.app Setup
1. **Create Knock.app account** at https://knock.app
2. **Configure Email Channel** with SMTP provider
3. **Configure Expo Push Channel** with Firebase credentials
4. **Create Workflows:**
   - `push-notification` (immediate)
   - `delayed-push-notification` (with delay step)
   - `immediate-email` (immediate)
   - `delayed-email-reminder` (with delay step)

### Required Firebase Setup
1. **Create Firebase Project** at https://console.firebase.google.com
2. **Enable Cloud Messaging**
3. **Add Android App** with package `com.sammy23.simplepushtest`
4. **Download google-services.json** to `simple-push-test/` directory
5. **Configure Knock Expo Channel** with Firebase server key

## Development Workflow

### Typical Development Session
1. **Start backend**: `npm run backend`
2. **Start ngrok**: `ngrok http 3000` (for mobile testing)
3. **Update app backend URL** with ngrok URL
4. **Start mobile app**: `cd simple-push-test && npx expo start --tunnel`
5. **Test on physical device** via Expo Go

### Testing the Complete Flow
1. **Create a note** with notification scheduling
2. **Verify backend receives** the request
3. **Wait for notification** to arrive on device
4. **Edit the note** to test notification updating
5. **Delete the note** to test notification cancellation

## Building for Production

### Mobile App Build
```bash
cd simple-push-test
eas build --platform android --profile production
eas build --platform ios --profile production
```

### Backend Deployment
- Deploy Express.js server to cloud provider
- Set production environment variables
- Configure production Knock.app workflows
- Set up SSL certificate for HTTPS

## Troubleshooting

### Common Issues

**Backend Connection Issues:**
- Verify `.env` file exists with correct Knock API keys
- Check backend server is running on port 3000
- Test health endpoint: `curl http://localhost:3000/health`

**Push Notifications Not Working:**
- Must use physical device (simulators don't support push)
- Verify Firebase configuration is correct
- Check Knock Expo channel has proper Firebase credentials
- Ensure app has notification permissions

**Mobile App Build Failures:**
- Verify `google-services.json` exists in app directory
- Check all environment variables are set
- Ensure Firebase project matches app configuration

**Network Issues:**
- Use ngrok tunnel for mobile device testing
- Verify backend URL in app environment variables
- Check firewall settings for development ports

## Testing Examples

### Create Note with Notification
```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-123",
    "title": "Team Meeting",
    "content": "Discuss project timeline",
    "scheduleNotification": true,
    "notificationDelay": 60,
    "notificationMessage": "Meeting starts soon!"
  }'
```

### Test Push Notification
```bash
curl -X POST http://localhost:3000/api/notifications/push-notification \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-123",
    "title": "Test Push",
    "body": "This is a test notification"
  }'
```

### Edit Scheduled Notification
```bash
curl -X PUT http://localhost:3000/api/notifications/edit-notification \
  -H "Content-Type: application/json" \
  -d '{
    "workflowKey": "delayed-push-notification",
    "cancellationKey": "push-test-user-123-1234567890",
    "userId": "test-user-123",
    "delayMinutes": 30,
    "title": "Updated Notification",
    "body": "This notification was edited",
    "type": "push"
  }'
```

## Documentation

- [Backend API Documentation](./backend/README.md) - Complete backend setup and API reference
- [Mobile App Documentation](./simple-push-test/README.md) - Expo app setup and usage
- [Knock.app Documentation](https://docs.knock.app) - Notification platform documentation
- [Expo Documentation](https://docs.expo.dev) - React Native development platform
- [Firebase Documentation](https://firebase.google.com/docs) - Push notification service

## Technology Stack

### Backend
- **Express.js** - Web framework
- **Node.js** - Runtime environment
- **Knock.app SDK** - Notification delivery
- **CORS** - Cross-origin resource sharing

### Frontend
- **React Native** - Mobile framework
- **Expo** - Development platform
- **EAS Build** - Production builds
- **Firebase** - Push notification service

### Integration
- **Knock.app** - Unified notification platform
- **Firebase Cloud Messaging** - Push delivery infrastructure
- **ngrok** - Development tunneling for mobile testing

## License

This project is licensed under the MIT License - see the LICENSE file for details.