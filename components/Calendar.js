import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Button, Platform, Alert } from 'react-native';
import * as Calendar from 'expo-calendar';

export default function BookieCalendar() {
  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === 'granted') {
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        console.log('Here are all your calendars:', calendars);
      } else {
        console.error('Calendar permission not granted'); 
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Calendar</Text>
      <Text style={styles.infoText}>Calendar Module Example</Text>
      <Button title="Create a new event" onPress={createEvent} color="#007BFF" />
    </View>
  );
}

async function getDefaultCalendarId() {
  const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  console.log('Fetched calendars:', calendars);
  
  const defaultCalendar = calendars.find(calendar => calendar.allowsModifications);
  
  if (!defaultCalendar) {
    Alert.alert('No writable calendars', 'Please make sure you have a writable calendar.');
    console.error('No writable calendar found');
    return null;
  }
  
  console.log('Using Calendar ID:', defaultCalendar.id);
  return defaultCalendar.id;
}

async function createEvent() {
  const calendarId = await getDefaultCalendarId();
  
  if (!calendarId) return;

  try {
    console.log('Creating event in calendar with ID:', calendarId); 
    
    const newEventID = await Calendar.createEventAsync(calendarId, {
      title: 'First Expo Event',
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), 
      accessLevel: Calendar.CalendarAccessLevel.OWNER,
    });

    Alert.alert('Success', `Your new event ID is: ${newEventID}`);
    console.log('Event created with ID:', newEventID); 
  } catch (e) {
    Alert.alert('Event not saved', e.message);
    console.error('Error creating event:', e.message);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DCEEF9",
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
  },
});