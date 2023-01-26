import React, { useState, useEffect } from 'react';
import { PersistGate } from 'redux-persist/es/integration/react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, HeaderBackground } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStateIfMounted } from 'use-state-if-mounted';

import { store, persistor } from './src/store/store';
import { Language, changeLanguage } from './translations/I18n';
import { useSelector } from 'react-redux';
import {
  Container,
  Header,
  Content,
  Icon,
  Accordion,
  Body,
  Left,
  Right,
  Title,
} from 'native-base';


import LoginScreen from './screens/LoginScreen';
import Mains from './screens/MainScreen';
import ScanQRScreen from './screens/ScanQRScreen';
import Splashs from './screens/splashSs';

import MenuArchiveJob from './screens/menuArchiveJob_Screen';
import MenuDelivery from './screens/menuDelivery_Screen';

import NextArchiveJob from './screens/ArchiveJob/nextArchiveJob_Screen';
import ArchiveJobInfo from './screens/ArchiveJob/archiveJobInfo_Screen';
import SaveArchiveJobInfo from './screens/ArchiveJob/saveArchiveJobInfo_Screen';
import NextDelivery from './screens/Delivery/nextDelivery_Screen';
import DeliveryInfo from './screens/Delivery/deliveryInfo_Screen';
import SaveDeliveryInfo from './screens/Delivery/saveDeliveryInfo_Screen';

import SelectBase from './pages/SelectBase';
import ScanScreen from './pages/ScanScreen';

const LoginStack = createStackNavigator();
const MainStack = createStackNavigator();
const App = () => {
  const loginReducer = useSelector(({ loginReducer }) => loginReducer);
  const userReducer = useSelector(({ userReducer }) => userReducer);
  const [userIndex, setUserIndex] = useStateIfMounted(loginReducer.index);
  useEffect(() => {
    if (userIndex == '-1') {
      changeLanguage('th');
    } else {
      changeLanguage(userReducer.userData[userIndex].language);
    }
  }, []);
  const LoginStackScreen = () => {

    return (
      <LoginStack.Navigator>
        <LoginStack.Screen
          options={{ headerShown: false }}
          name="LoginScreen"
          component={LoginScreen}
        />

        <LoginStack.Screen
          options={{ headerShown: false }}
          name="Select"
          component={SelectBase}
        />
        <LoginStack.Screen
          options={{ title: Language.t('selectBase.scanQR'), headerShown: false }}
          name="Scan"
          component={ScanScreen}
        />

      </LoginStack.Navigator>
    );
  }

  return (
    <Provider store={store} >
      <PersistGate loading={null} persistor={persistor} >
        <NavigationContainer>
          <SafeAreaView style={{ flex: 1 }}>
            <MainStack.Navigator>
              <MainStack.Screen
                options={{ headerShown: false }}
                name="Login"
                component={LoginStackScreen}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="Main"
                component={Mains}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="ScanQR"
                component={ScanQRScreen}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="Splashs"
                component={Splashs}
              />

              <MainStack.Screen
                options={{ headerShown: false }}
                name="MAJ"
                component={MenuArchiveJob}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="NAJ"
                component={NextArchiveJob}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="AJ_Info"
                component={ArchiveJobInfo}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="SAJ_Info"
                component={SaveArchiveJobInfo}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="MD"
                component={MenuDelivery}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="ND"
                component={NextDelivery}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="D_Info"
                component={DeliveryInfo}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="SD_Info"
                component={SaveDeliveryInfo}
              />

            </MainStack.Navigator>
          </SafeAreaView>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
