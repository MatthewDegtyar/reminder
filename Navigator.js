import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

import EventScroll from './EventScroll';
import SignupScreen from './SignupScreen';

const Stack = createStackNavigator();

function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Events"
          component={EventScroll}
          options={{ title: 'Home', header: () => null }}
        />
        <Stack.Screen
          name="SignupScreen"
          component={SignupScreen}
          options={{ title: 'Sign Up', header: () => null }}
          
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
