# Event-Driven Notification System

Express.js API that publishes user events to Knock.app for intelligent notification orchestration.

## 🎥 Video Walkthrough

**[Watch the complete setup and demo](https://www.youtube.com/watch?v=eMGMVv8nZt4)** - Step-by-step video explaining the architecture, code walkthrough, and Knock dashboard configuration.

## Architecture

**Event Publisher Pattern**: API publishes classified events to Knock. Knock workflows handle all notification logic including conditional delivery and smart scheduling based on user profile data.

```
API Event → Knock Workflow → Conditional Logic → Scheduled Notification
```

## Quick Start

```bash
npm install
cp .env.example .env
# Add your KNOCK_SECRET_KEY
npm start
```

## Project Structure

```
knock-notifications/
├── routes/
│   └── users.js          # User event endpoints
├── server.js             # Express server
├── package.json          # Dependencies
├── .env.example          # Environment template
└── README.md             # This file
```

## Core Concept

1. **API publishes events** (not direct notifications)
2. **Knock receives event** and checks user profile data
3. **Workflow executes conditionally** based on field existence
4. **Notifications scheduled** using user's actual timestamps

## API Endpoints

### POST /api/users/onboard
Publishes `user_created` event with user profile data.

```bash
curl -X POST http://localhost:3000/api/users/onboard \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "userEmail": "user@example.com",
    "userName": "John Doe",
    "userCreatedAt": "2025-01-15T10:30:00Z",
    "planType": "premium",
    "signupSource": "mobile"
  }'
```

**Response:**
```json
{
  "success": true,
  "user_profile": {
    "id": "user123",
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2025-01-15T10:30:00Z",
    "plan_type": "premium",
    "signup_source": "mobile"
  }
}
```

### POST /api/users/event
Generic event publisher for any workflow trigger.

```bash
curl -X POST http://localhost:3000/api/users/event \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "eventType": "first_login",
    "eventData": {"device": "mobile"}
  }'
```

### GET /api/users/:userId/profile
Retrieve user profile from Knock.

### PUT /api/users/:userId/profile
Update user profile via `user_profile_updated` event.

## Knock Workflow: user_created

### Configuration
1. **Branch Step**: Check if `recipient.created_at` exists (`not_empty` operator)
2. **Delay Step**: Fixed interval or calculated from timestamp
3. **Email Step**: Welcome email with user data

### Workflow Logic
```
if (recipient.created_at exists) {
  wait(delay_duration)
  send_welcome_email()
} else {
  do_nothing()
}
```

### Email Template Variables
- `{{ recipient.name }}` - User's name
- `{{ recipient.email }}` - User's email
- `{{ recipient.plan_type }}` - Subscription plan
- `{{ recipient.signup_source }}` - How they signed up
- `{{ recipient.created_at }}` - Account creation timestamp

## Environment Variables

```env
KNOCK_SECRET_KEY=sk_test_your_knock_api_key
PORT=3000
```

## Key Benefits

- **Decoupled**: API doesn't contain notification logic
- **Flexible**: Add new workflows without code changes
- **Smart**: Workflows access full user profile context
- **Conditional**: Logic based on user data existence
- **Scalable**: Knock handles delivery, retries, and scheduling

## Key Feature: Timestamp-Based Scheduling

Unlike traditional "send in X time from now" approaches, this system uses the user's actual creation timestamp for scheduling:

```javascript
// Traditional approach - delay from current time
delay_until: now() + 2_days

// This system - delay from user's creation time
delay_until: recipient.created_at + 2_days
```

This enables accurate lifecycle messaging regardless of when events are triggered.

## Technology Stack

- **Express.js** - API server
- **Knock.app** - Notification orchestration
- **Event-driven architecture** - Scalable pattern