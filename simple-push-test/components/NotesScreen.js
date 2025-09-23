import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';

const BACKEND_URL = 'https://bc88e0a78a10.ngrok-free.app';
const USER_ID = 'simple-test-user';

export default function NotesScreen({ navigation }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch notes from backend
  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/notes/user/${USER_ID}`);
      const result = await response.json();

      if (result.success) {
        setNotes(result.notes);
      } else {
        Alert.alert('Error', 'Failed to fetch notes');
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      Alert.alert('Network Error', 'Could not connect to backend');
    } finally {
      setLoading(false);
    }
  };

  // Delete a note
  const deleteNote = async (noteId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/notes/${noteId}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (result.success) {
        Alert.alert('Success', 'Note deleted successfully');
        fetchNotes(); // Refresh the list
      } else {
        Alert.alert('Error', 'Failed to delete note');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      Alert.alert('Network Error', 'Could not delete note');
    }
  };

  // Confirm delete
  const confirmDelete = (noteId, title) => {
    Alert.alert(
      'Delete Note',
      `Are you sure you want to delete "${title}"? This will also cancel any scheduled notifications.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteNote(noteId) },
      ]
    );
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Focus listener to refresh notes when screen is focused
  // Note: Disabled for custom navigation - notes will refresh on manual refresh
  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     fetchNotes();
  //   });
  //   return () => {
  //     if (unsubscribe && typeof unsubscribe.remove === 'function') {
  //       unsubscribe.remove();
  //     }
  //   };
  // }, [navigation]);

  const renderNote = ({ item }) => (
    <TouchableOpacity
      style={styles.noteCard}
      onPress={() => navigation.navigate('EditNote', { note: item })}
    >
      <View style={styles.noteHeader}>
        <Text style={styles.noteTitle}>{item.title}</Text>
        <TouchableOpacity
          onPress={() => confirmDelete(item.id, item.title)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteButtonText}>×</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.noteContent} numberOfLines={2}>
        {item.content}
      </Text>

      <View style={styles.noteFooter}>
        <Text style={styles.noteDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        {item.notificationScheduled && (
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationText}>🔔 Reminder set</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Notes</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateNote')}
        >
          <Text style={styles.addButtonText}>+ Add Note</Text>
        </TouchableOpacity>
      </View>

      {notes.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No notes yet</Text>
          <Text style={styles.emptySubtext}>Tap "Add Note" to create your first note</Text>
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderNote}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchNotes} />
          }
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  noteCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noteContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteDate: {
    fontSize: 12,
    color: '#999',
  },
  notificationBadge: {
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  notificationText: {
    fontSize: 12,
    color: '#2d7d2d',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});