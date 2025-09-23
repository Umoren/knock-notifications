import { useState, useEffect } from 'react';
import { Text, View, Platform, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Function to register for push notifications
async function registerForPushNotificationsAsync() {
  console.log('🔍 Starting push token registration...');
  let token;

  console.log('🔍 Platform:', Platform.OS);
  console.log('🔍 Is device:', Device.isDevice);

  if (Platform.OS === 'android') {
    console.log('🔍 Setting up Android notification channel...');
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
    console.log('✅ Android notification channel set up');
  }

  if (Device.isDevice) {
    console.log('🔍 Getting existing permissions...');
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    console.log('🔍 Existing permission status:', existingStatus);
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      console.log('🔍 Requesting permissions...');
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
      console.log('🔍 Permission request result:', status);
    }

    if (finalStatus !== 'granted') {
      console.log('❌ Permission denied:', finalStatus);
      alert('Failed to get push token for push notification!');
      return;
    }

    console.log('🔍 Getting Expo push token...');
    try {
      // Now with Firebase configured
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: 'e804c7ea-be16-43d2-b15e-f0e945e8fe58'
      });
      token = tokenData.data;
      console.log('✅ Expo Push Token:', token);
    } catch (error) {
      console.error('❌ Error getting push token:', error);
      alert('Error getting push token: ' + error.message);
    }
  } else {
    console.log('❌ Not a physical device');
    alert('Must use physical device for Push Notifications');
  }

  console.log('🔍 Final token:', token);
  return token;
}

// Function to test notification with your backend
async function testNotificationWithBackend(expoPushToken) {
  try {
    // Using ngrok tunnel for backend access
    const backendUrl = 'https://bc88e0a78a10.ngrok-free.app';

    const response = await fetch(`${backendUrl}/api/notifications/push-notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 'simple-test-user',
        title: 'Test from Simple App!',
        body: 'This notification was sent from your simple test app!',
        data: {
          expoPushToken: expoPushToken
        }
      })
    });

    const result = await response.json();
    console.log('Backend response:', result);

    if (result.success) {
      Alert.alert('Success!', 'Test notification sent via backend!');
    } else {
      Alert.alert('Error', 'Backend returned error: ' + JSON.stringify(result));
    }
  } catch (error) {
    console.error('Error:', error);
    Alert.alert('Network Error', 'Could not reach backend. Check your IP address.');
  }
}

export default function PushTestScreen() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Get push token using .then() instead of async/await
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token || ''));

    // Set up notification listeners
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      setNotification(notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification tapped:', response);
    });

    // Return cleanup function that removes listeners
    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Push Notification Test</Text>

        <Text style={styles.subtitle}>Push Token:</Text>
        <Text style={styles.token}>
          {expoPushToken ? `${expoPushToken.substring(0, 50)}...` : 'Loading...'}
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.testButton,
              !expoPushToken && styles.testButtonDisabled
            ]}
            onPress={() => testNotificationWithBackend(expoPushToken)}
            disabled={!expoPushToken}
          >
            <Text style={[
              styles.testButtonText,
              !expoPushToken && styles.testButtonTextDisabled
            ]}>
              {expoPushToken ? '🚀 Test with Backend' : 'Loading...'}
            </Text>
          </TouchableOpacity>
        </View>

        {notification && (
          <View style={styles.notificationContainer}>
            <Text style={styles.notificationTitle}>Last Notification:</Text>
            <Text style={styles.notificationText}>
              {notification.request.content.title}
            </Text>
            <Text style={styles.notificationText}>
              {notification.request.content.body}
            </Text>
          </View>
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>How it works:</Text>
          <Text style={styles.infoText}>
            1. This app gets a push token from Expo{'\n'}
            2. When you tap "Test with Backend", it sends the token to your Knock backend{'\n'}
            3. Your backend uses Knock to send a push notification{'\n'}
            4. You should receive the notification on this device!
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  token: {
    fontSize: 12,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    marginVertical: 10,
  },
  testButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  testButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  testButtonTextDisabled: {
    color: '#999',
  },
  notificationContainer: {
    backgroundColor: '#e6f3ff',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  notificationText: {
    fontSize: 14,
    marginBottom: 5,
  },
  infoContainer: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    width: '100%',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});