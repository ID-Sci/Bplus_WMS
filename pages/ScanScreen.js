import React, { useState, useEffect } from 'react';

import {
  StyleSheet, Platform, View, Text, Alert, TouchableOpacity,
  Dimensions, ActivityIndicator, Image,
  ScrollView,
  TouchableNativeFeedback,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';


import * as  ImagePicker from 'react-native-image-picker';

import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { FontSize } from '../components/FontSizeHelper';
import { Language } from '../translations/I18n';
import Colors from '../src/Colors';
import { QRreader } from 'react-native-qr-decode-image-camera';
import { Base64 } from '../src/safe_Format';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const ScanScreen = ({ route }) => {
  const defaultCountDown = 1;
  let clockCall = null;
  const navigation = useNavigation();
  const [countdown, setCountdown] = useState(defaultCountDown);
  let checkAndroidPermission = true
  useEffect(() => {
    if (countdown != -1) {
      clockCall = setInterval(() => {
        decrementClock();
      }, 1000);
      return () => {
        clearInterval(clockCall);
      };
    }
  });



  const decrementClock = () => {
    if (countdown === 0) {

      setCountdown(0);
      clearInterval(clockCall);
    } else {
      setCountdown(countdown + 1);
    }
  };

  var a = 0
  useEffect(() => {
    a = Math.floor(100000 + Math.random() * 900000);
    console.log(route.params, ' code: ', a)
  }, [])

  if (Platform.OS === 'android' && Platform.Version < 23) {
    checkAndroidPermission = false
  }
  const onSuccess = (e) => {

    if (e && e.type != 'QR_CODE' && e.type != 'org.iso.QRCode') {
      Alert.alert(Language.t('alert.errorTitle'), Language.t('selectBase.notfound'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
    } else {
      if (e && e.data) {
        let result = Base64.decode(Base64.decode(e.data)).split('|')

        if (result[0].indexOf('.dll') == -1) {
          Alert.alert(Language.t('alert.errorTitle'), Language.t('selectBase.invalid'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        } else {
          let tempurl = result[0].split('.dll')
          let serurl = tempurl[0] + '.dll'
          let tempnmae = serurl.split('/')
          let urlnmae = null;
          for (var s in tempnmae) if (tempnmae[s].search('.dll') > -1) urlnmae = tempnmae[s].split('.dll')
          let newObj = { label: serurl, value: urlnmae[0] };
          navigation.navigate(route.params.route, { post: newObj, data: a });
        }
      }
    }
  };

  const chooseFile = () => {
    let options = {
      title: Language.t('selectBase.SelectImg'),
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('response.didCancel');
      } else if (response.error) {
        console.log('response.error');
      } else {
        let path = null;
        if (Platform.OS == 'android') {
          path = response.assets[0].path;
          if (!path) {
            path = response.assets[0].uri;
          }
        } else {
          path = response.path;
          if (!path) {
            path = response.uri;
          }
        }


        QRreader(path)
          .then((data) => {
            if (data) {
              let result = Base64.decode(Base64.decode(data)).split('|')
              if (result[0].indexOf('.dll') == -1) {
                Alert.alert(Language.t('alert.errorTitle'), Language.t('selectBase.invalid'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);

              } else {
                let tempurl = result[0].split('.dll')
                let serurl = tempurl[0] + '.dll'
                let tempnmae = serurl.split('/')
                let urlnmae = null;
                for (var s in tempnmae) if (tempnmae[s].search('.dll') > -1) urlnmae = tempnmae[s].split('.dll')
                let newObj = { label: serurl, value: urlnmae[0] };
                navigation.navigate(route.params.route, { post: newObj, data: a });
              }
            }
          })
          .catch((error) => {
            console.log(error);
          });

      }
    });
  };

  return (
    <QRCodeScanner
    checkAndroid6Permissions={checkAndroidPermission}
    onRead={onSuccess}
    cameraType={'back'}
    fadeIn={true}
    reactivate={true}
    showMarker={true}
    topContent={

      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          padding: 10,
          flex: 1,
        }}>

        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.buttonTouchable1}>
          <Icon name="angle-left" size={30} color={'black'} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={chooseFile}
          style={styles.buttonTouchable2}>
          <Text style={styles.buttonText}>
            {Language.t('selectBase.SelectImg')}
          </Text>
        </TouchableOpacity>
      </View>
    }
    topViewStyle={{

      alignItems: 'flex-start',
      flexDirection: 'row',
    }}

  />
  );
};

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: FontSize.medium,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    paddingLeft: 5,
    fontSize: FontSize.medium,
    color: 'black',

  },
  buttonTouchable1: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    flex: 1,
   
    paddingLeft: 5,
    
    //padding: 16,
  },
  buttonTouchable2: {
    alignSelf: 'flex-end',
    

    //flex:1
    //padding: 16,
  },
  tabbar: {
    height: FontSize.medium * 3,
    padding: 12,
    paddingLeft: 20,
    alignItems: 'center',
    backgroundColor: Colors.backgroundColor,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});
const mapStateToProps = (state) => {
  return {

  };
};

const mapDispatchToProps = (dispatch) => {
  return {

  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ScanScreen);
