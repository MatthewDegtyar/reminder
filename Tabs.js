import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import HomeScreen from '../screens/HomeScreen';
import {StyleSheet} from 'react-native';
import {Icon} from 'react-native-elements';
import EventScroll from '../screens/EventScroll';

const Tab = createBottomTabNavigator();

export default function Tabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                position: 'absolute',
                bottom: 25,
                left: 20,
                right: 20,
                backgroundColor: 'transparent',
                height: 110,
                borderTopWidth: 0,
                },
                tabBarShowLabel: false,
            }}
            >
            <Tab.Screen 
                name="Assistant"
                component={EventScroll}
                options={{
                    tabBarIcon: ({ focused, color, size }) => (
                    <Icon name={focused ? 'add' : 'circle'} size={65} color={color} />
                    )
                }}
                />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#7F5DF0',
        shadowOffset: {
        width: 0,
        height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    },
});