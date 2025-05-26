import express from 'express';

const router = express.Router();

// Send delayed email notification (with inline identification)
router.post('/delayed-email', async (req, res) => {
    try {
        const {
            userId,
            delayMinutes = 5,
            subject = 'Reminder',
            message = 'This is your reminder!',
            userEmail,
            userName = 'User'
        } = req.body;

        const knock = req.app.locals.knock;
        const cancellationKey = `email-${userId}-${Date.now()}`;

        // Use inline identification in recipients
        const recipients = userEmail ? [
            {
                id: userId,
                email: userEmail,
                name: userName
            }
        ] : [userId];

        const response = await knock.workflows.trigger('delayed-email-reminder', {
            recipients,
            data: {
                delayDuration: `${delayMinutes}m`, // Format: "5m", "2h", "1d"
                subject: subject,
                message: message,
                userName: userName
            },
            cancellation_key: cancellationKey
        });

        res.json({
            success: true,
            workflow_run_id: response.workflow_run_id,
            cancellation_key: cancellationKey,
            message: `Delayed email scheduled for ${delayMinutes} minutes`
        });
    } catch (error) {
        console.error('Error sending delayed email:', error);
        res.status(500).json({ error: error.message });
    }
});

// Send immediate email notification (with inline identification)
router.post('/immediate-email', async (req, res) => {
    try {
        const {
            userId,
            subject = 'Notification',
            message = 'You have a new notification!',
            userEmail,
            userName = 'User'
        } = req.body;

        const knock = req.app.locals.knock;

        // Use inline identification in recipients
        const recipients = userEmail ? [
            {
                id: userId,
                email: userEmail,
                name: userName
            }
        ] : [userId];

        const response = await knock.workflows.trigger('immediate-email', {
            recipients,
            data: {
                subject: subject,
                message: message,
                userName: userName
            }
        });

        res.json({
            success: true,
            workflow_run_id: response.workflow_run_id,
            message: 'Email sent immediately'
        });
    } catch (error) {
        console.error('Error sending immediate email:', error);
        res.status(500).json({ error: error.message });
    }
});



// Send push notification to Expo app
router.post('/push-notification', async (req, res) => {
    try {
        const { userId, title, body, data } = req.body;
        const knock = req.app.locals.knock;

        const response = await knock.workflows.trigger('push-notification', {
            recipients: [userId],
            data: { title, body }
        });

        res.json({ success: true, workflow_run_id: response.workflow_run_id });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});


router.post('/register-push-token', async (req, res) => {
    try {
        const { userId, expoPushToken, channelId } = req.body;
        const knock = req.app.locals.knock;

        await knock.users.setChannelData(userId, channelId, {
            data: {
                tokens: [expoPushToken]
            }
        });

        res.json({
            success: true,
            message: 'Push token registered successfully'
        });
    } catch (error) {
        console.error('Error registering push token:', error);
        res.status(500).json({ error: error.message });
    }
});

// Send delayed push notification
router.post('/delayed-push', async (req, res) => {
    try {
        const {
            userId,
            delayMinutes = 5,
            title = 'Delayed Notification',
            body = 'This is your delayed notification!',
            data = {}
        } = req.body;

        const knock = req.app.locals.knock;
        const cancellationKey = `push-${userId}-${Date.now()}`;

        const response = await knock.workflows.trigger('delayed-push-notification', {
            recipients: [userId],
            data: {
                delayDuration: `${delayMinutes}m`,
                title: title,
                body: body,
                customData: data
            },
            cancellation_key: cancellationKey
        });

        res.json({
            success: true,
            workflow_run_id: response.workflow_run_id,
            cancellation_key: cancellationKey,
            message: `Delayed push scheduled for ${delayMinutes} minutes`
        });
    } catch (error) {
        console.error('Error sending delayed push:', error);
        res.status(500).json({ error: error.message });
    }
});

// Cancel a delayed notification
router.post('/cancel', async (req, res) => {
    try {
        const { workflowKey, cancellationKey } = req.body;
        const knock = req.app.locals.knock;

        await knock.workflows.cancel(workflowKey, cancellationKey);

        res.json({
            success: true,
            message: 'Notification canceled successfully'
        });
    } catch (error) {
        console.error('Error canceling notification:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get user data
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const knock = req.app.locals.knock;

        const user = await knock.users.get(userId);

        res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({ error: error.message });
    }
});

// Test all notification types
router.post('/test-all', async (req, res) => {
    try {
        const { userId, userEmail, userName = 'Test User' } = req.body;
        const knock = req.app.locals.knock;

        const results = [];

        // Create recipient object for inline identification
        const recipient = userEmail ? {
            id: userId,
            email: userEmail,
            name: userName
        } : userId;

        // Test immediate email
        try {
            const emailResponse = await knock.workflows.trigger('immediate-email', {
                recipients: [recipient],
                data: {
                    subject: 'Test Email',
                    message: 'This is a test email notification',
                    userName: userName
                }
            });
            results.push({ type: 'email', success: true, workflow_run_id: emailResponse.workflow_run_id });
        } catch (error) {
            results.push({ type: 'email', success: false, error: error.message });
        }

        // Test push notification
        try {
            const pushResponse = await knock.workflows.trigger('push-notification', {
                recipients: [userId], // Push doesn't need email inline identification
                data: {
                    title: 'Test Push',
                    body: 'This is a test push notification'
                }
            });
            results.push({ type: 'push', success: true, workflow_run_id: pushResponse.workflow_run_id });
        } catch (error) {
            results.push({ type: 'push', success: false, error: error.message });
        }

        // Test delayed email (1 minute)
        try {
            const delayedResponse = await knock.workflows.trigger('delayed-email-reminder', {
                recipients: [recipient],
                data: {
                    delayDuration: '1m',
                    subject: 'Test Delayed Email',
                    message: 'This is a test delayed email (1 minute)',
                    userName: userName
                },
                cancellation_key: `test-${userId}-${Date.now()}`
            });
            results.push({ type: 'delayed_email', success: true, workflow_run_id: delayedResponse.workflow_run_id });
        } catch (error) {
            results.push({ type: 'delayed_email', success: false, error: error.message });
        }

        res.json({
            success: true,
            message: 'Test notifications triggered',
            results
        });
    } catch (error) {
        console.error('Error testing notifications:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;