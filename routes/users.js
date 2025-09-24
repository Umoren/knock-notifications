import express from 'express';

const router = express.Router();

router.post('/onboard', async (req, res) => {
    try {
        const {
            userId,
            userEmail,
            userName,
            userCreatedAt,
            planType = 'free',
            signupSource = 'web'
        } = req.body;

        if (!userId || !userEmail || !userName) {
            return res.status(400).json({
                error: 'Missing required fields: userId, userEmail, userName'
            });
        }

        const knock = req.app.locals.knock;
        const creationTimestamp = userCreatedAt || new Date().toISOString();

        await knock.workflows.trigger('user_created', {
            recipients: [
                {
                    id: userId,
                    email: userEmail,
                    name: userName,
                    created_at: creationTimestamp,
                    plan_type: planType,
                    signup_source: signupSource
                }
            ],
            data: {
                timestamp: creationTimestamp,
                plan_type: planType,
                signup_source: signupSource
            }
        });

        res.json({
            success: true,
            user_profile: {
                id: userId,
                email: userEmail,
                name: userName,
                created_at: creationTimestamp,
                plan_type: planType,
                signup_source: signupSource
            }
        });

    } catch (error) {
        res.status(500).json({
            error: 'Failed to onboard user',
            details: error.message
        });
    }
});

router.post('/event', async (req, res) => {
    try {
        const { userId, eventType, eventData = {} } = req.body;

        if (!userId || !eventType) {
            return res.status(400).json({
                error: 'Missing required fields: userId, eventType'
            });
        }

        const knock = req.app.locals.knock;

        await knock.workflows.trigger(eventType, {
            recipients: [userId],
            data: {
                timestamp: new Date().toISOString(),
                ...eventData
            }
        });

        res.json({ success: true });

    } catch (error) {
        res.status(500).json({
            error: 'Failed to publish event',
            details: error.message
        });
    }
});

router.get('/:userId/profile', async (req, res) => {
    try {
        const { userId } = req.params;
        const knock = req.app.locals.knock;
        const userProfile = await knock.users.get(userId);
        res.json({ success: true, user_profile: userProfile });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get user profile', details: error.message });
    }
});

router.put('/:userId/profile', async (req, res) => {
    try {
        const { userId } = req.params;
        const profileData = req.body;
        const knock = req.app.locals.knock;

        await knock.workflows.trigger('user_profile_updated', {
            recipients: [{ id: userId, ...profileData }],
            data: { action: 'profile_update', updated_at: new Date().toISOString() }
        });

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user profile', details: error.message });
    }
});

export default router;