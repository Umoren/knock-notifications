# Knock Notifications Backend

Express.js API server integrated with Knock.app for handling email and push notifications with delayed delivery capabilities.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Knock.app account with API key

### Installation
```bash
npm install
```

### Environment Setup
Create `.env` file in backend directory:
```env
KNOCK_SECRET_API_KEY=sk_test_your_secret_key_here
PORT=3000
```

### Run Development Server
```bash
npm run dev
```

Server will start on `http://localhost:3000`

## 📁 Project Structure

```
backend/
├── routes/
│   └── notifications.js    # All notification route handlers
├── server.js              # Main Express.js server
├── package.json
├── .env                   # Environment variables (create this)
└── README.md
```

## 🛠️ Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Start | `npm start` | Start production server |
| Development | `npm run dev` | Start with nodemon for development |

## 🔌 API Endpoints

### Base URL: `http://localhost:3000/api/notifications`

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

# Register push token
POST /register-push-token
{
  "userId": "test-123",
  "expoPushToken": "ExponentPushToken[xxxxxx]",
  "channelId": "your-expo-channel-id"
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

#### User Management
```bash
# Get user information
GET /user/:userId

# Cancel delayed notification
POST /cancel
{
  "workflowKey": "delayed-email-reminder",
  "cancellationKey": "email-user123-1234567890"
}

# Test all notification types
POST /test-all
{
  "userId": "test-user",
  "userEmail": "test@example.com",
  "userName": "Test User"
}
```

## 🏗️ Architecture

### Core Components

**server.js** - Main Express.js application
- Initializes Knock client
- Sets up middleware
- Configures routes
- Starts server

**routes/notifications.js** - Route handlers
- Push notification endpoints
- Email notification endpoints
- User management
- Token registration
- Workflow cancellation

### Knock Integration

The server uses the official `@knocklabs/node` SDK to interact with Knock.app:

```javascript
import { Knock } from '@knocklabs/node';
const knock = new Knock(process.env.KNOCK_SECRET_API_KEY);
```

Key features:
- **Workflow Triggers**: Start notification workflows
- **User Management**: Automatic user creation and updates
- **Channel Data**: Manage push tokens and email addresses
- **Cancellation**: Stop delayed notifications before delivery

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `KNOCK_SECRET_API_KEY` | Your Knock.app secret API key | Yes |
| `PORT` | Server port (default: 3000) | No |

### Knock.app Setup Required

1. **Create Knock.app account**
2. **Set up channels:**
   - Email channel (SMTP or provider)
   - Expo push notification channel
3. **Create workflows:**
   - `push-notification` (immediate push)
   - `delayed-push-notification` (delayed push)
   - `immediate-email` (immediate email)
   - `delayed-email-reminder` (delayed email)

## 📝 Usage Examples

### cURL Examples

**Send Push Notification:**
```bash
curl -X POST http://localhost:3000/api/notifications/push-notification \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-123",
    "title": "Hello!",
    "body": "This is a test notification"
  }'
```

**Register Push Token:**
```bash
curl -X POST http://localhost:3000/api/notifications/register-push-token \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-123",
    "expoPushToken": "ExponentPushToken[your_token_here]",
    "channelId": "your-expo-channel-id"
  }'
```

**Send Delayed Email:**
```bash
curl -X POST http://localhost:3000/api/notifications/delayed-email \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "userEmail": "test@example.com",
    "userName": "Test User",
    "delayMinutes": 2,
    "subject": "Delayed Test",
    "message": "This email will arrive in 2 minutes"
  }'
```

## 🐛 Error Handling

The API includes comprehensive error handling:

- **400 Bad Request**: Invalid request parameters
- **401 Unauthorized**: Invalid or missing API key
- **422 Unprocessable Entity**: Knock API validation errors
- **500 Internal Server Error**: Server or Knock API errors

All errors return JSON format:
```json
{
  "error": "Error message",
  "details": "Additional error information"
}
```

## 🧪 Testing

### Health Check
```bash
curl http://localhost:3000/
# Response: {"message": "Knock Notifications Server is running!"}
```

### Test All Features
```bash
curl -X POST http://localhost:3000/api/notifications/test-all \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user",
    "userEmail": "your-email@example.com",
    "userName": "Test User"
  }'
```

## 🚀 Deployment

### Production Considerations

1. **Environment Variables**: Set secure API keys
2. **Process Management**: Use PM2 or similar for production
3. **Reverse Proxy**: Use nginx for SSL and load balancing
4. **Monitoring**: Implement logging and error tracking
5. **Rate Limiting**: Add rate limiting middleware

### Docker Deployment (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 📚 Dependencies

### Production
- **express**: Web framework for Node.js
- **@knocklabs/node**: Official Knock.app SDK

### Development
- **nodemon**: Development server with auto-restart


## 🔗 Related Documentation

- [Knock.app API Documentation](https://docs.knock.app)
- [Express.js Documentation](https://expressjs.com)
- [Expo Push Notifications](https://docs.expo.dev/push-notifications/overview/)