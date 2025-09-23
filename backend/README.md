# Knock Notifications Backend

Express.js API server integrated with Knock.app for handling email and push notifications with note management capabilities.

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Knock.app account with API keys
- Firebase project (for push notifications)

### Installation
```bash
npm install
```

### Environment Setup
Create `.env` file in backend directory:
```env
KNOCK_SECRET_KEY=sk_test_your_secret_key_here
KNOCK_PUBLIC_KEY=pk_test_your_public_key_here
KNOCK_SIGNING_KEY=your_signing_key_here
KNOCK_EXPO_CHANNEL_ID=your_expo_channel_id_here
PORT=3000
NODE_ENV=development
```

### Run Development Server
```bash
npm run dev
```

Server will start on `http://localhost:3000`

## Project Structure

```
backend/
├── routes/
│   ├── notifications.js    # Notification endpoints
│   └── notes.js           # Note CRUD operations
├── server.js              # Main Express.js server
├── package.json
├── .env                   # Environment variables (create this)
└── README.md
```

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Start | `npm start` | Start production server |
| Development | `npm run dev` | Start with --watch for development |

## API Endpoints

### Base URL: `http://localhost:3000`

### Health Check
```bash
GET /health
# Response: {"status": "OK", "timestamp": "...", "knock_configured": true}
```

---

## Notes API

### Base URL: `/api/notes`

#### Get All Notes for User
```bash
GET /api/notes/user/:userId
# Response: {"success": true, "notes": [...]}
```

#### Create Note (with optional notification)
```bash
POST /api/notes
{
  "userId": "test-user-123",
  "title": "Buy groceries",
  "content": "Milk, eggs, bread, and coffee",
  "scheduleNotification": true,
  "notificationDelay": 60,
  "notificationMessage": "Time to go grocery shopping!"
}
```

#### Update Note (and its notification)
```bash
PUT /api/notes/:noteId
{
  "title": "Updated title",
  "content": "Updated content",
  "scheduleNotification": true,
  "notificationDelay": 30,
  "userId": "test-user-123"
}
```

#### Delete Note (cancels notification)
```bash
DELETE /api/notes/:noteId
```

#### Get Specific Note
```bash
GET /api/notes/:noteId
```

---

## Notifications API

### Base URL: `/api/notifications`

#### Push Notifications
```bash
# Send immediate push notification
POST /push-notification
{
  "userId": "test-123",
  "title": "Notification Title",
  "body": "Notification message"
}

# Send delayed push notification
POST /delayed-push
{
  "userId": "test-123",
  "delayMinutes": 5,
  "title": "Delayed Notification",
  "body": "This will arrive in 5 minutes"
}
```

#### Email Notifications
```bash
# Send immediate email
POST /immediate-email
{
  "userId": "user-123",
  "userEmail": "user@example.com",
  "userName": "John Doe",
  "subject": "Hello!",
  "message": "Your email content here"
}

# Send delayed email
POST /delayed-email
{
  "userId": "user-123",
  "userEmail": "user@example.com",
  "userName": "John Doe",
  "delayMinutes": 30,
  "subject": "Reminder",
  "message": "This email will arrive in 30 minutes"
}
```

#### Edit Notifications (Cancel + Recreate)
```bash
PUT /edit-notification
{
  "workflowKey": "delayed-push-notification",
  "cancellationKey": "push-test-user-123-1234567890",
  "userId": "test-user-123",
  "delayMinutes": 10,
  "title": "EDITED Title",
  "body": "EDITED content",
  "type": "push"
}

# For email notifications, add:
# "type": "email",
# "userEmail": "user@example.com",
# "userName": "User Name"
```

#### Cancel Notifications
```bash
POST /cancel
{
  "workflowKey": "delayed-push-notification",
  "cancellationKey": "push-test-user-123-1234567890"
}
```

#### Test All Features
```bash
POST /test-all
{
  "userId": "test-user",
  "userEmail": "test@example.com",
  "userName": "Test User"
}
```

---

## Complete Usage Examples

### Create Note with Notification
```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-123",
    "title": "Team Meeting",
    "content": "Discuss Q4 goals and project timelines",
    "scheduleNotification": true,
    "notificationDelay": 60,
    "notificationMessage": "Team meeting starts in 15 minutes!"
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

### Test Email Notification
```bash
curl -X POST http://localhost:3000/api/notifications/delayed-email \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user",
    "userEmail": "your-email@example.com",
    "userName": "Your Name",
    "delayMinutes": 2,
    "subject": "Test Email",
    "message": "This email will arrive in 2 minutes"
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
    "delayMinutes": 5,
    "title": "Updated Notification",
    "body": "This notification was edited!",
    "type": "push"
  }'
```

---

## Configuration

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `KNOCK_SECRET_KEY` | Knock.app secret API key | `sk_test_abc123...` |
| `KNOCK_PUBLIC_KEY` | Knock.app public API key | `pk_test_xyz789...` |
| `KNOCK_SIGNING_KEY` | Knock.app signing key | `abc123def456...` |
| `KNOCK_EXPO_CHANNEL_ID` | Expo push channel ID from Knock | `ypa1F1h9IqRa...` |
| `PORT` | Server port (default: 3000) | `3000` |

### Knock.app Setup Required

1. **Create Knock.app account** at https://knock.app
2. **Set up channels:**
   - Email channel (SMTP or provider like SendGrid)
   - Expo push notification channel with Firebase configuration
3. **Create workflows in Knock dashboard:**
   - `push-notification` (immediate push)
   - `delayed-push-notification` (delayed push with delay step)
   - `immediate-email` (immediate email)
   - `delayed-email-reminder` (delayed email with delay step)

### Firebase Setup (for push notifications)
1. Create Firebase project
2. Enable Cloud Messaging
3. Download `google-services.json`
4. Configure Expo channel in Knock with Firebase server key

---

## Data Models

### Note Object
```javascript
{
  "id": 1,
  "userId": "test-user-123",
  "title": "Note title",
  "content": "Note content",
  "createdAt": "2023-09-22T22:13:00.271Z",
  "updatedAt": "2023-09-22T22:13:00.272Z",
  "notificationScheduled": true,
  "notificationDetails": {
    "workflowRunId": "575e7a78-da7d-5355-a7ed-a6ff4c160ac0",
    "cancellationKey": "note-1-1758579180272",
    "delayMinutes": 60,
    "message": "Custom reminder message"
  }
}
```

---

## Error Handling

All endpoints return JSON responses:

**Success Response:**
```json
{
  "success": true,
  "data": "...",
  "message": "Operation completed successfully"
}
```

**Error Response:**
```json
{
  "error": "Error message",
  "details": "Additional error information"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (invalid parameters)
- `404` - Not Found (note/user not found)
- `422` - Unprocessable Entity (Knock API validation errors)
- `500` - Internal Server Error

---

## Testing

### Quick Health Check
```bash
curl http://localhost:3000/health
```

### Test Complete Flow
1. **Create a note with notification**
2. **Wait for notification to arrive**
3. **Edit the note (updates notification)**
4. **Delete the note (cancels notification)**

---

## Dependencies

### Production Dependencies
```json
{
  "@knocklabs/node": "^1.3.0",
  "cors": "^2.8.5",
  "dotenv": "^16.5.0",
  "express": "^5.1.0"
}
```

### Key Features
- **Express.js** - Web framework
- **Knock Node SDK** - Official Knock.app integration
- **CORS** - Cross-origin resource sharing
- **Environment variables** - Secure configuration management

---

## Related Documentation

- [Knock.app API Documentation](https://docs.knock.app)
- [Knock Node.js SDK](https://docs.knock.app/sdks/node)
- [Express.js Documentation](https://expressjs.com)
- [Main Project README](../README.md)