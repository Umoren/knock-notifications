import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Switch,
} from 'react-native';

const BACKEND_URL = 'https://bc88e0a78a10.ngrok-free.app';
const USER_ID = 'simple-test-user';

export default function CreateNoteScreen({ navigation, route }) {
  const isEditing = route.params?.note;
  const existingNote = route.params?.note;

  const [title, setTitle] = useState(existingNote?.title || '');
  const [content, setContent] = useState(existingNote?.content || '');
  const [scheduleNotification, setScheduleNotification] = useState(
    existingNote?.notificationScheduled || false
  );
  const [notificationDelay, setNotificationDelay] = useState(
    existingNote?.notificationDetails?.delayMinutes?.toString() || '60'
  );
  const [notificationMessage, setNotificationMessage] = useState(
    existingNote?.notificationDetails?.message || ''
  );
  const [saving, setSaving] = useState(false);

  const saveNote = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your note');
      return;
    }

    if (!content.trim()) {
      Alert.alert('Error', 'Please enter some content for your note');
      return;
    }

    if (scheduleNotification && !notificationDelay.trim()) {
      Alert.alert('Error', 'Please enter notification delay in minutes');
      return;
    }

    setSaving(true);

    try {
      const noteData = {
        userId: USER_ID,
        title: title.trim(),
        content: content.trim(),
        scheduleNotification,
        notificationDelay: scheduleNotification ? parseInt(notificationDelay) : undefined,
        notificationMessage: scheduleNotification
          ? (notificationMessage.trim() || `Don't forget about: ${title}`)
          : undefined,
      };

      const url = isEditing
        ? `${BACKEND_URL}/api/notes/${existingNote.id}`
        : `${BACKEND_URL}/api/notes`;

      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });

      const result = await response.json();

      if (result.success) {
        Alert.alert(
          'Success',
          isEditing ? 'Note updated successfully!' : result.message,
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert('Error', 'Failed to save note');
      }
    } catch (error) {
      console.error('Error saving note:', error);
      Alert.alert('Network Error', 'Could not save note');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? 'Edit Note' : 'New Note'}
        </Text>
        <TouchableOpacity onPress={saveNote} disabled={saving}>
          <Text style={[styles.saveButton, saving && styles.saveButtonDisabled]}>
            {saving ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.titleInput}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter note title..."
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Content</Text>
        <TextInput
          style={styles.contentInput}
          value={content}
          onChangeText={setContent}
          placeholder="Write your note here..."
          placeholderTextColor="#999"
          multiline
          textAlignVertical="top"
        />

        <View style={styles.notificationSection}>
          <View style={styles.switchRow}>
            <Text style={styles.label}>Schedule Reminder</Text>
            <Switch
              value={scheduleNotification}
              onValueChange={setScheduleNotification}
              trackColor={{ false: '#ccc', true: '#007AFF' }}
              thumbColor="#fff"
            />
          </View>

          {scheduleNotification && (
            <View style={styles.notificationSettings}>
              <Text style={styles.subLabel}>Remind me in (minutes)</Text>
              <TextInput
                style={styles.delayInput}
                value={notificationDelay}
                onChangeText={setNotificationDelay}
                placeholder="60"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
              <Text style={styles.helpText}>
                Examples: 5 (5 minutes), 60 (1 hour), 1440 (1 day)
              </Text>

              <Text style={styles.subLabel}>Custom reminder message (optional)</Text>
              <TextInput
                style={styles.messageInput}
                value={notificationMessage}
                onChangeText={setNotificationMessage}
                placeholder={`Don't forget about: ${title || 'your note'}`}
                placeholderTextColor="#999"
                multiline
              />
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  cancelButton: {
    fontSize: 16,
    color: '#666',
  },
  saveButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  saveButtonDisabled: {
    color: '#ccc',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  titleInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  contentInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minHeight: 120,
  },
  notificationSection: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationSettings: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  subLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginBottom: 8,
    marginTop: 12,
  },
  delayInput: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  messageInput: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minHeight: 60,
  },
  helpText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    fontStyle: 'italic',
  },
});