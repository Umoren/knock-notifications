import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import NotesScreen from './components/NotesScreen';
import CreateNoteScreen from './components/CreateNoteScreen';
import PushTestScreen from './components/PushTestScreen';

// Simple tab navigation without external dependencies
function SimpleTabNavigator() {
  const [activeTab, setActiveTab] = useState('notes');
  const [currentScreen, setCurrentScreen] = useState('notesList');
  const [editingNote, setEditingNote] = useState(null);

  const navigation = {
    navigate: (screen, params) => {
      setCurrentScreen(screen);
      if (params?.note) {
        setEditingNote(params.note);
      }
    },
    goBack: () => {
      setCurrentScreen('notesList');
      setEditingNote(null);
    },
    addListener: (eventName, callback) => {
      // Call callback immediately for 'focus' event when screen changes
      if (eventName === 'focus' && currentScreen === 'notesList') {
        setTimeout(callback, 0);
      }

      // Return proper unsubscribe object
      return {
        remove: () => {
          // Mock cleanup
        }
      };
    },
  };

  const renderScreen = () => {
    if (activeTab === 'pushTest') {
      return <PushTestScreen />;
    }

    // Notes tab screens
    if (currentScreen === 'CreateNote') {
      return <CreateNoteScreen navigation={navigation} route={{ params: {} }} />;
    }

    if (currentScreen === 'EditNote') {
      return <CreateNoteScreen navigation={navigation} route={{ params: { note: editingNote } }} />;
    }

    // Default notes list
    return <NotesScreen navigation={navigation} />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {renderScreen()}
      </View>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'notes' && styles.activeTab]}
          onPress={() => {
            setActiveTab('notes');
            setCurrentScreen('notesList');
          }}
        >
          <Text style={styles.tabIcon}>📝</Text>
          <Text style={[styles.tabLabel, activeTab === 'notes' && styles.activeTabLabel]}>
            My Notes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'pushTest' && styles.activeTab]}
          onPress={() => setActiveTab('pushTest')}
        >
          <Text style={styles.tabIcon}>🔔</Text>
          <Text style={[styles.tabLabel, activeTab === 'pushTest' && styles.activeTabLabel]}>
            Push Test
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <SimpleTabNavigator />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingBottom: 20,
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    backgroundColor: 'transparent',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    color: '#666',
  },
  activeTabLabel: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
