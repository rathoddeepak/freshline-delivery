import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Vibration
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator,TransitionPresets } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'components/icon';
import lang from 'assets/lang';
import helper from 'assets/helper';
import UserDB from 'libs/userdb';
import Home from 'screens/home';
import History from 'screens/history';
import Notify from 'screens/notify';
import PickupScreen from 'screens/pickupScreen';
import DeliveryScreen from 'screens/deliveryScreen';
import TaskScreen from 'screens/taskScreen';
import ThirdStep from 'screens/thirdStep';
import FirstStep from 'screens/firstStep';
import SecondStep from 'screens/secondStep';
import CenterHome from 'screens/centerHome';
import Startup from 'screens/startup';
import Profile from 'screens/profile';
import SplashScreen from 'screens/splashScreen';
import OneSignal from 'react-native-onesignal';
import AsyncStorage from '@react-native-community/async-storage';
import Parse from 'parse/react-native';
import Toast from 'cogo-toast';
import MapboxGL from '@react-native-mapbox-gl/maps';
MapboxGL.setAccessToken(helper.accessToken);
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
global.cl = 0;
Parse.setAsyncStorage(AsyncStorage);
Parse.initialize(  
  helper.parse_app_id,
  helper.parse_js_key
);
Parse.serverURL = helper.parse_server_url;
Parse.masterKey = helper.parse_master_key;
class HomeActivity extends Component {
  render() {
    return (
      <Tab.Navigator screenOptions={
          ({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {              
              return <Icon name={route.name.toLowerCase()} size={size} color={color} />;
            },
          })}
          tabBarOptions={{
            showLabel:false,
            activeSize: 30,
            inactiveSize: 25,
            keyboardHidesTabBar:true,
            activeBackgroundColor:'black',
            inactiveBackgroundColor:'black',
            activeTintColor: helper.primaryColor,
            inactiveTintColor: helper.grey,
            style:{borderTopWidth:0}
          }}>
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="History" component={History} />
          <Tab.Screen name="Notify" component={Notify} />
          <Tab.Screen name="User" component={Profile} />
        </Tab.Navigator>
    )
  }
}

export default class App extends Component {
  constructor(props){
    super(props)
    OneSignal.setAppId(helper.onesignal);     
    Toast.removeNotification();
    global.user_id = 30;
  }
  componentDidMount() {
    StatusBar.setBackgroundColor("#000")
    StatusBar.setBarStyle("light")
  }
  render() {
    return (
      <NavigationContainer>   
        <Stack.Navigator                    
          headerMode="none"
          screenOptions={{
            gestureEnabled: false,
            cardOverlayEnabled: true,
             ...TransitionPresets.SlideFromRightIOS 
          }}
        >
         <Stack.Screen name="SplashScreen" component={SplashScreen} />
         <Stack.Screen name="HomeActivity" component={HomeActivity} />
         <Stack.Screen name="TaskScreen" component={TaskScreen} />
         <Stack.Screen name="PickupScreen" component={PickupScreen} />
         <Stack.Screen name="DeliveryScreen" component={DeliveryScreen} />
         <Stack.Screen name="SecondStep" component={SecondStep} />         
         <Stack.Screen name="ThirdStep" component={ThirdStep} />
         <Stack.Screen name="Startup" component={Startup} />              
        </Stack.Navigator>
      </NavigationContainer>  
    )
  }
}