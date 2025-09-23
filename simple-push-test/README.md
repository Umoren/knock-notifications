# Simple Push Test - Note App with Push Notifications

React Native Expo app with integrated note management and push notifications powered by Knock.app.

## Features

- **Note Management**: Create, edit, and delete notes with rich content
- **Notification Scheduling**: Schedule push notifications for note reminders
- **Push Notifications**: Receive notifications on physical devices via Firebase
- **Real-time Integration**: Direct connection to Knock.app backend
- **Cross-platform**: Works on iOS and Android

## Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI: `npm install -g @expo/eas-cli`
- Physical device for push notifications (simulators don't support push notifications)
- Active backend server (see backend README)

## Installation

```bash
npm install
```

## Environment Setup

Create `.env` file in the app root directory:

```env
# Knock API Keys
EXPO_PUBLIC_KNOCK_PUBLIC_KEY=pk_test_your_public_key_here

# Knock Channel ID (get this from your Expo channel in Knock dashboard)
EXPO_PUBLIC_KNOCK_EXPO_CHANNEL_ID=your_expo_channel_id_here

# Your backend URL (use ngrok for development)
EXPO_PUBLIC_BACKEND_URL=https://your-ngrok-url.ngrok-free.app

# Expo Project ID
EXPO_PUBLIC_PROJECT_ID=your_expo_project_id_here
```

## Development Setup

### 1. Start Development Server

```bash
npx expo start --tunnel
```

The `--tunnel` flag creates a public URL accessible from your mobile device.

### 2. Install Expo Go App

Download Expo Go from:
- iOS: App Store
- Android: Google Play Store

### 3. Scan QR Code

Open Expo Go app and scan the QR code displayed in your terminal.

## Building for Production

### Prerequisites for Building
- EAS CLI installed: `npm install -g @expo/eas-cli`
- Expo account: `eas login`
- Firebase project configured (for push notifications)

### Build Development Version

```bash
eas build --platform android --profile development
```

This creates an APK file that you can install directly on Android devices.

### Build Production Version

```bash
eas build --platform android --profile production
eas build --platform ios --profile production
```

## Firebase Configuration

For push notifications to work, you need:

1. **Firebase Project**: Create at https://console.firebase.google.com
2. **Add Android App**: Use package name `com.sammy23.simplepushtest`
3. **Download google-services.json**: Place in app root directory
4. **Configure Knock Channel**: Add Firebase server key to Knock Expo channel

The app includes Firebase configuration in `app.config.js`.

## App Structure

```
simple-push-test/
├── components/
│   ├── NotesScreen.js         # Main notes list and management
│   ├── CreateNoteScreen.js    # Create/edit note with notifications
│   └── PushTestScreen.js      # Push notification testing
├── App.js                     # Main app with tab navigation
├── app.config.js              # Expo configuration with Firebase
├── google-services.json       # Firebase configuration (add this)
├── package.json
├── .env                       # Environment variables (create this)
└── README.md
```

## Usage

### Tab Navigation

The app has two main tabs:

#### 1. My Notes Tab
- **View Notes**: See all your notes with creation dates
- **Create Notes**: Tap "Add Note" to create new notes
- **Schedule Notifications**: Toggle reminder option when creating notes
- **Edit Notes**: Tap any note to edit content and notification settings
- **Delete Notes**: Tap X button to delete (cancels scheduled notifications)

#### 2. Push Test Tab
- **View Push Token**: See your device's Expo push token
- **Test Backend Connection**: Verify connection to backend server
- **Send Test Notification**: Send immediate push notification to test the flow

### Creating Notes with Notifications

1. **Open "My Notes" tab**
2. **Tap "Add Note"**
3. **Enter title and content**
4. **Toggle "Schedule Reminder" if you want notification**
5. **Set delay in minutes** (e.g., 60 for 1 hour, 1440 for 1 day)
6. **Add custom reminder message** (optional)
7. **Tap "Save"**

### Testing Push Notifications

1. **Open "Push Test" tab**
2. **Wait for push token to load**
3. **Tap "Test with Backend" button**
4. **Check that you receive notification on device**

## Backend Integration

The app connects to your backend server via the URLs configured in environment variables.

### API Endpoints Used

- `POST /api/notes` - Create note with optional notification
- `GET /api/notes/user/:userId` - Get all notes for user
- `PUT /api/notes/:noteId` - Update note and its notification
- `DELETE /api/notes/:noteId` - Delete note and cancel notification
- `POST /api/notifications/push-notification` - Send test push notification

### User ID

The app uses `simple-test-user` as the default user ID for all operations.

## Troubleshooting

### Common Issues

**App won't load in Expo Go:**
- Use `npx expo start --tunnel` instead of regular start
- Make sure you're scanning QR code with Expo Go app (not camera)
- Check that your phone and computer are on same network

**Push notifications not working:**
- Must use physical device (not simulator)
- Check Firebase configuration is correct
- Verify backend server is running and accessible
- Ensure Knock Expo channel is configured with correct Firebase credentials

**"Network request failed" errors:**
- Check backend URL in `.env` file
- Verify backend server is running
- Use ngrok tunnel URL instead of localhost for mobile testing

**Build failures:**
- Ensure `google-services.json` is in root directory
- Check all environment variables are set
- Verify Firebase project configuration matches app package name

### Testing Network Connectivity

1. **Test backend health check** in browser: `https://your-ngrok-url.ngrok-free.app/health`
2. **Check ngrok tunnel** is active and pointing to port 3000
3. **Verify environment variables** are loaded correctly

## Development Workflow

### Typical Development Session

1. **Start backend server**: `npm run backend` (in backend directory)
2. **Start ngrok tunnel**: `ngrok http 3000`
3. **Update backend URL** in app's `.env` file with ngrok URL
4. **Start Expo development server**: `npx expo start --tunnel`
5. **Test on physical device** via Expo Go

### Making Changes

- **Code changes** auto-reload in development
- **Environment variable changes** require app restart
- **Dependencies changes** require `npm install` and restart

## Production Deployment

### App Deployment
- Build production version with EAS Build
- Submit to App Store/Google Play via EAS Submit
- Configure production backend URL

### Backend Requirements
- Backend server must be deployed and accessible
- Knock.app workflows must be configured
- Firebase project must be properly configured for production

## Related Documentation

- [Backend API Documentation](../backend/README.md)
- [Main Project Documentation](../README.md)
- [Expo Documentation](https://docs.expo.dev)
- [Knock.app Documentation](https://docs.knock.app)
- [Firebase Documentation](https://firebase.google.com/docs)