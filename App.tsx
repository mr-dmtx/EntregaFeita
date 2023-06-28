import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Principal from './telas/Principal';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import {createStackNavigator} from '@react-navigation/stack'
import Historico from './telas/Historico';
import { createTable } from './classes/Database';

createTable();
const Tab = createBottomTabNavigator();

export default function App(){
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = 'warning';
            if (route.name === 'Início') {
              iconName = 'home';
            } else if (route.name === 'Histórico') {
              iconName = 'md-list';
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'gray',
        })}>
        <Tab.Screen name='Início' component={Principal}/>
        <Tab.Screen name='Histórico' component={Historico}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
