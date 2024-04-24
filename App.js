import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [events, setEvents] = useState({});
  const [eventText, setEventText] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [editedEvent, setEditedEvent] = useState(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [chosenTime, setChosenTime] = useState(new Date());

  const handleDateSelect = (date) => {
    setSelectedDate(date.dateString);
    setEventText('');
    setEventTime('');
    setShowTimePicker(false);
    setEditedEvent(null);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || chosenTime;
    setShowTimePicker(Platform.OS === 'ios');
    setChosenTime(currentTime);
    setEventTime(currentTime.toLocaleTimeString());
  };

  const addEvent = () => {
    if (selectedDate && eventText.trim() !== '') {
      const newEvent = { event: eventText, time: eventTime };
      setEvents({
        ...events,
        [selectedDate]: newEvent,
      });
      setSelectedDate('');
      setEventText('');
      setEventTime('');
      Alert.alert('Event Added', 'Your event has been successfully added.');
    } else {
      Alert.alert('Error', 'Please select a date and fill in all fields.');
    }
  };

  const editEvent = () => {
    if (selectedDate && editedEvent) {
      setEvents({
        ...events,
        [selectedDate]: { event: eventText || editedEvent.event, time: eventTime || editedEvent.time },
      });
      setEditedEvent(null);
      Alert.alert('Event Edited', 'Your event has been successfully edited.');
    } else {
      Alert.alert('Error', 'Please select an event to edit.');
    }
  };

  const deleteEvent = () => {
    if (selectedDate && events[selectedDate]) {
      Alert.alert(
        'Delete Event',
        'Are you sure you want to delete this event?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: () => {
              const updatedEvents = { ...events };
              delete updatedEvents[selectedDate];
              setEvents(updatedEvents);
              Alert.alert('Event Deleted', 'Your event has been successfully deleted.');
            },
            style: 'destructive',
          },
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert('Error', 'Please select an event to delete.');
    }
  };

  const renderEvents = () => {
    return Object.keys(events).map((date) => (
      <TouchableOpacity
        key={date}
        onPress={() => {
          const selectedEvent = events[date];
          setSelectedDate(date);
          setEventText(selectedEvent.event);
          setEventTime(selectedEvent.time);
          setEditedEvent(selectedEvent);
        }}
      >
        <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: 'lightgray' }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Events for {date}: </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ marginLeft: 8 }}>{selectedEvent.event}</Text>
          </View>
        </View>
      </TouchableOpacity>
    ));
  };

  const renderAddEventButton = () => {
    if (selectedDate) {
      return (
        <TouchableOpacity
          style={{ backgroundColor: 'blue', padding: 10, alignItems: 'center', marginTop: 10 }}
          onPress={addEvent}
        >
          <Text style={{ color: 'white' }}>Add Event</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <ScrollView>
      <View style={{ flex: 1, padding: 20 }}>
        <Calendar
          onDayPress={handleDateSelect}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: 'blue' },
            ...events,
          }}
        />
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20 }}>Add/Edit Event</Text>
        <TextInput
          style={{ borderWidth: 1, borderColor: 'lightgray', padding: 10, marginTop: 10 }}
          placeholder="Event"
          value={eventText}
          onChangeText={(text) => setEventText(text)}
        />
        <TouchableOpacity onPress={() => setShowTimePicker(true)}>
          <Text style={{ marginTop: 10 }}>Time: {eventTime}</Text>
        </TouchableOpacity>
        {renderAddEventButton()}

        <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20 }}>Events</Text>
        {renderEvents()}
      </View>
      {showTimePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={chosenTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleTimeChange}
        />
      )}
    </ScrollView>
  );
};

export default CalendarScreen;
