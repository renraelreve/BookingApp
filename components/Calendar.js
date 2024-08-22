import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Button, Platform, Alert } from 'react-native';
import * as Calendar from 'expo-calendar';
import moment from 'moment';

export default function BookieCalendar() {
  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === 'granted') {
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        console.log('Here are all your calendars:');
        console.log({ calendars });
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Calendar Module Example</Text>
      <Text>Attempting createEventAsync ...</Text>
      <Button title="Create a new event" onPress={createEvent} />
      {/* <Button title="Delete event" onPress={deleteCalendar} /> */}
    </View>
  );
}

async function getDefaultCalendarSource() {
  const defaultCalendar = await Calendar.getDefaultCalendarAsync();
  return defaultCalendar.source;
}

async function createCalendar() {
  const defaultCalendarSource =
    Platform.OS === 'ios'
      ? await getDefaultCalendarSource()
      : { isLocalAccount: true, name: 'Expo Calendar' };
  const newCalendarID = await Calendar.createCalendarAsync({
    title: 'Expo Calendar',
    color: 'blue',
    entityType: Calendar.EntityTypes.EVENT,
    sourceId: defaultCalendarSource.id,
    source: defaultCalendarSource,
    name: 'internalCalendarName',
    ownerAccount: 'personal',
    accessLevel: Calendar.CalendarAccessLevel.OWNER,
  });
  console.log(`Your new calendar ID is: ${newCalendarID}`);
}
 
async function createEvent() {
    const defaultCalendar =
      Platform.OS === 'ios'
        ? await getDefaultCalendarAsync()
        : { isLocalAccount: true, name: 'Expo Calendar' };
    try {
      const newEventID = await Calendar.createEventAsync('1', {
      title: 'First Expo Event',
      startDate: "2024-08-22T00:00:00.000-05:00",
      endDate: "2024-08-22T23:59:59.496-05:00",
      accessLevel: Calendar.CalendarAccessLevel.OWNER,
    });
    Alert.alert(`Your new event ID is: ${newEventID}`);
    console.log(`Your new event ID is: ${newEventID}`);
    this.findEvents('1');
    } catch (e) {
        Alert.alert('Event not saved successfully', e.message);
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
