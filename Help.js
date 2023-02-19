import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import moment from 'moment';


import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, 
  Animated, Easing, FlatList, Alert, TextInput, Button, Modal, KeyboardAvoidingView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import {auth} from './firebase';
import { useNavigation } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';

export default function EventScroll({}) {
  const navigation = useNavigation();

  const [showDetails, setShowDetails] = useState(false);

  const [title, setTitle] = useState('');
  const [timeAndDate, setTimeAndDate] = useState('');
  const [people, setPeople] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const [eventList, setEventList] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
        if (!user) {
          navigation.navigate('SignupScreen')
        }
    })
    return unsubscribe
}, [])


  const addEvent = () => {
    const newEvent = { key: Date.now().toString() };
    setEventList([...eventList, newEvent]);
  };

  const deleteEvent = (key) => {
    const newEventList = eventList.filter((item) => item.key !== key);
    setEventList(newEventList);
  };

  const renderSwipeable = ({ item }) => {
    return (
      <Swipeable
        renderRightActions={() => (
          <TouchableOpacity
            activeOpacity={1}
            style={{
              backgroundColor: 'red',
              justifyContent: 'center',
              alignItems: 'flex-end',
              paddingRight: 20,
              marginTop: 10,
              marginBottom: 10,
              borderRadius: 10,
            }}
            onPress={() => deleteEvent(item.key)}
          >
            <Icon name="delete" size={30} color="white" style={{ marginLeft: 20 }} />
          </TouchableOpacity>
        )}
        onSwipeableRightOpen={() => deleteEvent(item.key)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowDetails(!showDetails)}
        >
          <View style={styles.eventContainer}>
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ marginLeft: 0 }}>{item.key}</Text>
              </View>
              {showDetails && (
                <>
                  <Text>Time and Date: {timeAndDate}</Text>
                  <Text>Location: {location}</Text>
                  <Text>People: {people}</Text>
                  <Text>Notes: {notes}</Text>
                </>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };
  return (
    <LinearGradient colors={['#00c6fb', '#005bea']} style={styles.gradient}>
      <View style={styles.container}>
        <FlatList
          data={eventList}
          renderItem={renderSwipeable}
          keyExtractor={(item) => item.key}
        />
        <TouchableOpacity onPress={addEvent}>
          <View style={[styles.button, { marginLeft: 300, marginBottom: 30 }]}>
            <Icon name="plus" size={30} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
            
const styles = StyleSheet.create({
  gradient: {
    flex: 0,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:60
  },
  eventContainer:{
    backgroundColor: '#E6AF2E',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'grey',
    height: 120,
    justifyContent: 'center',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
    width: 300,
},
  addButton: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    backgroundColor: '#2FBF71',
    borderRadius: 50,
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
},
  button: {
    backgroundColor: '#2FBF71',
    borderRadius: 50,
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
},
  textInput:{
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius:8,
    width:200,
    marginTop:10,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
});


export default function App() {
  const [currentMonth, setCurrentMonth] = useState(moment().month());
  const [currentYear, setCurrentYear] = useState(moment().year());

  const getDaysInMonth = (month, year) => {
    const daysInMonth = moment(`${year}-${month + 1}`, 'YYYY-MM').daysInMonth();
    const firstDayOfMonth = moment(`${year}-${month + 1}-01`, 'YYYY-MM-DD').day();

    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth - 1);

    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    }
  };

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth + 1);

    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    }
  };

  const monthsInYear = [];
  for (let i = 0; i < 12; i++) {
    monthsInYear.push(getDaysInMonth(i, currentYear));
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrevMonth}>
          <Text>Previous Month</Text>
        </TouchableOpacity>
        <Text>{moment(`${currentYear}-${currentMonth + 1}`, 'YYYY-MM').format('YYYY')}</Text>
        <TouchableOpacity onPress={handleNextMonth}>
          <Text>Next Month</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
      {monthsInYear.map((month, index) => (
        <View style={styles.calendar} key={index}>
          <View style={styles.header}>
            <Text>{moment(`${currentYear}-${index + 1}`, 'YYYY-MM').format('MMMM')}</Text>
          </View>
          <View style={styles.weekDays}>
            <Text style={styles.weekDay}>Sun</Text>
            <Text style={styles.weekDay}>Mon</Text>
            <Text style={styles.weekDay}>Tue</Text>
            <Text style={styles.weekDay}>Wed</Text>
            <Text style={styles.weekDay}>Thu</Text>
            <Text style={styles.weekDay}>Fri</Text>
            <Text style={styles.weekDay}>Sat</Text>
          </View>
          <View style={styles.days}>
            {month.map((day, index) => (
              <TouchableOpacity key={index} style={styles.dayButton} onPress={() => console.log(day)}>
                <Text style={day ? styles.day : styles.emptyDay}>{day}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calendar: {
    marginTop: 20,
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
  },
  days: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayButton: {
    width: '14.28%', // 7 days in a week, so 100/7 = 14
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  day: {
    textAlign: 'center',
  },
  emptyDay: {
    opacity: 0,
  },
});
