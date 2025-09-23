import express from 'express';

const router = express.Router();

// In-memory storage for notes (replace with database in production)
let notes = [];
let noteIdCounter = 1;

// Get all notes for a user
router.get('/user/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const userNotes = notes.filter(note => note.userId === userId);

        res.json({
            success: true,
            notes: userNotes
        });
    } catch (error) {
        console.error('Error getting notes:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create a new note with optional notification scheduling
router.post('/', async (req, res) => {
    try {
        const {
            userId,
            title,
            content,
            scheduleNotification = false,
            notificationDelay,
            notificationMessage,
            userEmail,
            userName
        } = req.body;

        // Create the note
        const note = {
            id: noteIdCounter++,
            userId,
            title,
            content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            notificationScheduled: false,
            notificationDetails: null
        };

        // Schedule notification if requested
        if (scheduleNotification && notificationDelay) {
            const knock = req.app.locals.knock;
            const cancellationKey = `note-${note.id}-${Date.now()}`;

            try {
                const response = await knock.workflows.trigger('delayed-push-notification', {
                    recipients: [userId],
                    data: {
                        delayDuration: `${notificationDelay}m`,
                        title: `Note Reminder: ${title}`,
                        body: notificationMessage || `Don't forget about: ${title}`,
                        customData: {
                            noteId: note.id,
                            type: 'note_reminder'
                        }
                    },
                    cancellation_key: cancellationKey
                });

                note.notificationScheduled = true;
                note.notificationDetails = {
                    workflowRunId: response.workflow_run_id,
                    cancellationKey: cancellationKey,
                    delayMinutes: notificationDelay,
                    message: notificationMessage
                };
            } catch (notificationError) {
                console.warn('Failed to schedule notification:', notificationError);
                // Continue creating note even if notification fails
            }
        }

        notes.push(note);

        res.json({
            success: true,
            note,
            message: note.notificationScheduled
                ? `Note created with notification scheduled for ${notificationDelay} minutes`
                : 'Note created successfully'
        });
    } catch (error) {
        console.error('Error creating note:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update a note and optionally modify its notification
router.put('/:noteId', async (req, res) => {
    try {
        const { noteId } = req.params;
        const {
            title,
            content,
            scheduleNotification,
            notificationDelay,
            notificationMessage,
            userId
        } = req.body;

        const noteIndex = notes.findIndex(note => note.id === parseInt(noteId));
        if (noteIndex === -1) {
            return res.status(404).json({ error: 'Note not found' });
        }

        const note = notes[noteIndex];
        const knock = req.app.locals.knock;

        // Cancel existing notification if present
        if (note.notificationScheduled && note.notificationDetails) {
            try {
                await knock.workflows.cancel(
                    'delayed-push-notification',
                    note.notificationDetails.cancellationKey
                );
            } catch (cancelError) {
                console.warn('Could not cancel existing notification:', cancelError);
            }
        }

        // Update note content
        note.title = title || note.title;
        note.content = content || note.content;
        note.updatedAt = new Date().toISOString();
        note.notificationScheduled = false;
        note.notificationDetails = null;

        // Schedule new notification if requested
        if (scheduleNotification && notificationDelay) {
            const cancellationKey = `note-${note.id}-${Date.now()}`;

            try {
                const response = await knock.workflows.trigger('delayed-push-notification', {
                    recipients: [userId || note.userId],
                    data: {
                        delayDuration: `${notificationDelay}m`,
                        title: `Note Reminder: ${note.title}`,
                        body: notificationMessage || `Don't forget about: ${note.title}`,
                        customData: {
                            noteId: note.id,
                            type: 'note_reminder'
                        }
                    },
                    cancellation_key: cancellationKey
                });

                note.notificationScheduled = true;
                note.notificationDetails = {
                    workflowRunId: response.workflow_run_id,
                    cancellationKey: cancellationKey,
                    delayMinutes: notificationDelay,
                    message: notificationMessage
                };
            } catch (notificationError) {
                console.warn('Failed to schedule notification:', notificationError);
            }
        }

        res.json({
            success: true,
            note,
            message: 'Note updated successfully'
        });
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete a note and cancel its notification
router.delete('/:noteId', async (req, res) => {
    try {
        const { noteId } = req.params;
        const noteIndex = notes.findIndex(note => note.id === parseInt(noteId));

        if (noteIndex === -1) {
            return res.status(404).json({ error: 'Note not found' });
        }

        const note = notes[noteIndex];
        const knock = req.app.locals.knock;

        // Cancel notification if scheduled
        if (note.notificationScheduled && note.notificationDetails) {
            try {
                await knock.workflows.cancel(
                    'delayed-push-notification',
                    note.notificationDetails.cancellationKey
                );
            } catch (cancelError) {
                console.warn('Could not cancel notification:', cancelError);
            }
        }

        notes.splice(noteIndex, 1);

        res.json({
            success: true,
            message: 'Note deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get a specific note
router.get('/:noteId', (req, res) => {
    try {
        const { noteId } = req.params;
        const note = notes.find(note => note.id === parseInt(noteId));

        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        res.json({
            success: true,
            note
        });
    } catch (error) {
        console.error('Error getting note:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;