import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Moment from 'moment';
import { auth } from './firebase';
import {LinearGradient} from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Icon} from 'react-native-elements';
import firebase from 'firebase';

const EventScreen = ({navigation}) => {
  const [events, setEvents] = useState([]);
  const [editedEvent, setEditedEvent] = useState(null);
  const [eventsRef, setEventsRef] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [userIdForEvent, setUserIdForEvent] = useState('');

  const [prompt, setPrompt] = useState('');
//  console.log('prompt: '+prompt)
  
  const Header = ({ title }) => {
    return (
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
    );
  };

  const onDateChange = (event, selectedDate) => {
  const currentDate = selectedDate || date;
  setShowDatePicker(Platform.OS === 'ios');
  setDate(currentDate);
  setNewDate(Moment(currentDate).format('YYYY-MM-DDTHH:mm:ss'));
  };

  //generate random string for user ID
  function generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  //initialize firebase
  useEffect(() => {
    async function initFirebase() {
      const userId = await AsyncStorage.getItem('userId');
      const ref = firebase.database().ref('users/'+userId).child('events');
      setEventsRef(ref);
    }

    initFirebase();
  }, []);

  //listen for changes in firebase
  useEffect(() => {
    if (!eventsRef) {
      return;
    }
    function onValueChange(snapshot) {
      const events = snapshot.val() || [];
      setEvents(events);
      AsyncStorage.setItem('@events', JSON.stringify(events));
    }
    eventsRef.on('value', onValueChange);
    return () => eventsRef.off('value', onValueChange);
  }, [eventsRef]);

  //generated random string for user ID if none exists
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        let userId = await AsyncStorage.getItem('userId'); // check if a user ID is already stored
        if (!userId) {
          userId = generateRandomString(14);
          setUserIdForEvent(userId);
          await AsyncStorage.setItem('userId', userId); // store the new user ID
        }
        console.log('logged in, uid: '+userId)
        //navigation.replace('SignupScreen');
      }
    });
    return unsubscribe;
  }, []);

  //load events from async storage
  useEffect(() => {
    async function fetchEvents() {
      try {
        const storedEvents = await AsyncStorage.getItem('@events');
        if (storedEvents !== null) {
          setEvents(JSON.parse(storedEvents));
        }
      } catch (e) {
        console.log(e);
      }
    }
    fetchEvents();
  }, []);

  const renderEvents = () => {
    return events.map((event, index) => {
      const title = event.title.length > 20 ? event.title.substring(0, 20) + "..." : event.title;
      return (
        <View style={{ marginTop: 10, width: '100%', marginLeft:38 }} key={index}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.event}
            onPress={() => {
              setEditedEvent(event);
              setNewTitle(event.title);
              setNewDate(event.date);
              setModalVisible(true);
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flex: 1, marginTop:-25 }}>
                <Text style={[styles.title]}>{title}</Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {deleteEvent(index)}}
              >
                <Icon name="delete" size={30} color="black" style={{ marginLeft: 10, marginTop:7 }} />
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: -15, marginRight:60, width:'80%' }}>
              <Text>{Moment(event.date).format('MMMM Do YYYY, h:mm a')}</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    });
  };

  //delete event
  const deleteEvent = async (index) => {
    const updatedEvents = [...events];
    const eventToDelete = updatedEvents.splice(index, 1)[0];
    try {
      const userId = await AsyncStorage.getItem('userId');
      const eventRef = firebase.database().ref(`/${userId}/events/${eventToDelete.title}`);
      await eventRef.remove();
      await AsyncStorage.setItem('@events', JSON.stringify(updatedEvents));
      setEvents(updatedEvents);
      AsyncStorage.setItem('@events', JSON.stringify(updatedEvents));
      setModalVisible(false);
      saveEventsToFirebase(updatedEvents, userId);
    } catch (e) {
      console.log(e);
    }
  };

  //save events to firebase
  function saveEventsToFirebase(events, userId) {
    const eventsRef = firebase.database().ref('users/'+userId).child('events');
    eventsRef.set(events);
  }

  //create new event
  const createNewEvent = () => {
    const newEvent = {
      title: 'New Event',
      date: Moment().format('YYYY-MM-DDTHH:mm:ss'),
    };
    setEvents([newEvent, ...events]);
    AsyncStorage.setItem('@events', JSON.stringify([newEvent, ...events]));
  };

  //save edited event
  const saveEditedEvent = async () => {
    const updatedEvents = events.map((event, index) => {
      if (index === events.findIndex((e) => e.title === editedEvent.title)) {
        return {
          ...event,
          title: newTitle,
          date: newDate,
        };
      } else {
        return event;
      }
    });
    //save to firebase
    setEvents(updatedEvents);
    AsyncStorage.setItem('@events', JSON.stringify(updatedEvents));
    setModalVisible(false);
    const userId = await AsyncStorage.getItem('userId');
    saveEventsToFirebase(updatedEvents, userId);
  };

  //render events
  const renderModal = () => {
    setPrompt('');
    setModalVisible2(true)
  };

  const sendPromptFirebase = async () => {
    console.log('send prompt to firebase')
    const userId = await AsyncStorage.getItem('userId');
    const promptRef = firebase.database().ref('users/'+userId).child('prompts');
    promptRef.push(prompt);
    setModalVisible2(false);
  };

  return (
    <LinearGradient colors={['#00c6fb', '#005bea']} style={styles.gradient}>
      <Header title="RemindAI" />
    <View style={[styles.container, {marginTop:0, marginLeft:0}]}>
      <ScrollView 
        contentContainerStyle={[styles.scrollContainer]}
        showsVerticalScrollIndicator={false}
        style={{paddingBottom:80}}
      >
        {renderEvents()}
      </ScrollView>
      <TouchableOpacity activeOpacity={.8} style={[styles.addButton, {marginRight:200, marginBottom:40}]} onPress={createNewEvent}>
        <Text style={{color:'black', fontSize:40, marginTop:-5, marginLeft:1}}>+</Text>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={.8} style={[styles.addButton, {marginRight:100, marginBottom:40}]} onPress={renderModal}>
        <Icon
          name="chat"
          size={28}
          color="black"
          style={{ marginLeft: 0, marginTop:5 }}
        />
      </TouchableOpacity>
      <Modal 
        visible={modalVisible} 
        animationType='slide'
        transparent={true}
      >
        <View style={styles.modalContainer2}>
        <View style={styles.modal2Inner}>
          <Text style={[styles.modalTitle, {marginTop:30}]}>Edit Event</Text>
          <TextInput
            style={styles.modalInput}
            value={newTitle}
            onChangeText={(text) => setNewTitle(text)}
          />
          <TouchableOpacity
            style={styles.modalInput}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>{Moment(date).format('MMMM Do YYYY, h:mm a')}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="datetime"
              is24Hour={true}
              display="default"
              onChange={onDateChange}
            />
          )}
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={saveEditedEvent}
            >
              <Text style={styles.modalButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
        </View>
      </Modal>

      <Modal 
        visible={modalVisible2} 
        animationType='slide'
        transparent={true}

      >
        <View style={styles.modalContainer2}>
          <View style={styles.modal2Inner}>
            <Text style={[styles.modalTitle, {marginTop:30}]}>Enter Assistant Prompt</Text>
            <TextInput
              style={styles.modalInput}
              value={prompt}
              placeholder="What would you like to do?"
              placeholderTextColor={'#000'}
              onChangeText={(text) => setPrompt(text)}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible2(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => sendPromptFirebase()}
                >
                <Text style={styles.modalButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 0,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width: '100%',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 2, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 1,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'white',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 2, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 1,
  },
  modalButtonText:{
    color: 'black',
  },
  modal2Inner:{
    backgroundColor:'white', 
    borderRadius:8, 
    width:'95%',    
    height:'40%',
    shadowColor: 'black',
    shadowOffset: { width: 2, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 1,
    alignItems : 'center',
    borderColor: 'black',
    borderWidth: 1,
  },
  button: {
    width: 75,
    height: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
  },
  event: {
    marginTop: 10,
    width: '90%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center'
  },
  eventContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer2:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle:{
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalInput:{
    borderWidth: 1,
    borderColor: 'gray',
    width: '80%',
    height: 40,
    marginBottom: 20,
    padding: 10,

  },
  modalButton:{
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    margin: 10,
    borderColor: 'black',
    borderWidth: 1,
    width:100,
    alignItems: 'center',
    
  },
  modalButtonContainer:{
    flexDirection: 'row',
  },
  header: {
    width: '100%',
    height: 100,
    paddingTop: 36,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
  },
});

export default EventScreen;
