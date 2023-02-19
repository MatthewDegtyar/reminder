import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Button, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {auth} from './firebase';

export default function SignupScreen({navigation}) {

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [name, setName] = React.useState('');

    const handleSignup = () => {
        if (!email) {
            alert("Please enter an email")    
        }else
        auth
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user.email);
            user.updateProfile({
                displayName: name
            });
            navigation.replace('Events')
        })
        .catch((error) => alert(error.message))
      }

    return (

        <LinearGradient colors={['#00c6fb', '#005bea']} style={styles.gradient}>
        <View style={[styles.container,{marginTop:-70, alignItems:'center'}]}>
            <TextInput
              style={styles.textInput}
              placeholder="Email"
              placeholderTextColor="#003f5c"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
              }}
            >
            </TextInput>
            <TextInput
              style={styles.textInput}
              placeholder="Password"
              placeholderTextColor="#003f5c"
              value={password}
              secureTextEntry={true}
              onChangeText={(text) => setPassword(text)}
              >
            </TextInput>
            <View style={{marginTop:10, marginBottom:-100}}>
              <Button
                title="Sign Up"
                color='white'
                onPress={()=>handleSignup()}
                >
              </Button>
              <View style={{marginTop:70, marginLeft:5}}>
                <Text style={{color:'lightgrey'}}>Create an account to access the full suite of features</Text>
              </View>
            </View>
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
addContainer:{
    backgroundColor: '#B284EB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'grey',
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
textInput: {
    height: 40,
    width: 300,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    borderColor: 'grey',
    backgroundColor: 'white',
  },
});