import React, { useState, useEffect } from 'react';

import {
  StyleSheet, Platform, View, Text, Alert, TouchableOpacity,
  Dimensions, ActivityIndicator, Image,
  ScrollView,
  TouchableNativeFeedback,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';


import * as  ImagePicker from 'react-native-image-picker';

import { useSelector, connect, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { FontSize } from '../components/FontSizeHelper';
import { Language } from '../translations/I18n';
import Colors from '../src/Colors';
import { useStateIfMounted } from 'use-state-if-mounted';
import { QRreader } from 'react-native-qr-decode-image-camera';
import { Base64 } from '../src/safe_Format';

import * as loginActions from '../src/actions/loginActions';
import * as registerActions from '../src/actions/registerActions';
import * as dataActions from '../src/actions/dataActions';
import { getDrawerStatusFromState } from '@react-navigation/drawer';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const Splashs = ({ route }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const dataReducer = useSelector(({ dataReducer }) => dataReducer);
  const registerReducer = useSelector(({ registerReducer }) => registerReducer);
  const loginReducer = useSelector(({ loginReducer }) => loginReducer);
  const databaseReducer = useSelector(({ databaseReducer }) => databaseReducer);

  const defaultCountDown = 1;
  let clockCall = null;
  const [loading, setLoading] = useStateIfMounted(false);
  const [countdown, setCountdown] = useState(defaultCountDown);
  let checkAndroidPermission = true
  let tempPutAway = []
  let tempPicking = []
  const closeLoading = () => {
    setLoading(false);
  };
  const letsLoading = () => {
    setLoading(true);
  };
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

  useEffect(async () => {
    console.log('>> machineNum :', registerReducer.machineNum + '\n\n\n\n')

    await getData()
    await closeLoading()


  }, []);

  const getData = async () => {
    var nai = route.params
    console.log(nai.data)
    if (nai.data == 'MAJ')
      await getPutAway('')
    if (nai.data == 'MD')
      await getPicking('')

    await navigation.dispatch(
      navigation.replace(nai.data, {})
    )

  }
  const getPicking = async (WS_TAG) => {
    letsLoading()


    await fetch(databaseReducer.Data.urlser + '/PickAndPack', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-LOGIN-GUID': loginReducer.guid,
        'BPAPUS-FUNCTION': 'NEXTPICKING',
        'BPAPUS-PARAM':
          '{"FORK_CODE": "' +
          databaseReducer.Data.ForkCode +
          '","WS_TAG": "' +
          WS_TAG +
          '"}',
      }),
    })
      .then((response) => response.json())
      .then(async (json) => {
        if (json && json.ResponseCode == '635') {
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t('alert.errorDetail'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
          console.log('NOT FOUND MEMBER');
        } else if (json && json.ResponseCode == '629') {
          Alert.alert(
            Language.t('alert.errorTitle'),
            'Function Parameter Required', [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        } else if (json && json.ResponseCode == '200') {
          let responseData = JSON.parse(json.ResponseData)
          console.log(responseData)
          if (responseData.RECORD_COUNT > 0) {
            if (tempPicking.length < responseData.RECORD_COUNT) {
              let TAG = ''
              for (var i in responseData.NEXTPICKING) {
                tempPicking.push(responseData.NEXTPICKING[i])
                TAG = responseData.NEXTPICKING[i].WS_TAG
              }


              if (tempPicking.length < responseData.RECORD_COUNT) {
                console.log(tempPicking.length)
                await getPicking(TAG)
              } else {
                await dispatch(dataActions.setPicking(tempPicking));
              }
            }
          }
        } else {
          Alert.alert(
            Language.t('alert.errorTitle'),
          );
        }
      })
      .catch((error) => {
        console.error('ERROR at _fetchGuidLogin' + error);
        closeLoading()
        if (databaseReducer.Data.urlser == '') {
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t('selectBase.error'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        } else {
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t('alert.internetError'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        }
      })
  }

  const getPutAway = async (WS_TAG) => {
    letsLoading()


    await fetch(databaseReducer.Data.urlser + '/PickAndPack', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-LOGIN-GUID': loginReducer.guid,
        'BPAPUS-FUNCTION': 'NEXTSTORAGE',
        'BPAPUS-PARAM':
          '{"FORK_CODE": "' +
          databaseReducer.Data.ForkCode +
          '","WS_TAG": "' +
          WS_TAG +
          '"}',
      }),
    })
      .then((response) => response.json())
      .then(async (json) => {
        if (json && json.ResponseCode == '635') {
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t('alert.errorDetail'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
          console.log('NOT FOUND MEMBER');
        } else if (json && json.ResponseCode == '629') {
          Alert.alert(
            Language.t('alert.errorTitle'),
            'Function Parameter Required', [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        } else if (json && json.ResponseCode == '200') {
          let responseData = JSON.parse(json.ResponseData)
          console.log(responseData)
          if (responseData.RECORD_COUNT > 0) {
            if (tempPutAway.length < responseData.RECORD_COUNT) {
              let TAG = ''
              for (var i in responseData.NEXTSTORAGE) {
                tempPutAway.push(responseData.NEXTSTORAGE[i])
                TAG = responseData.NEXTSTORAGE[i].WS_TAG
              }


              if (tempPutAway.length < responseData.RECORD_COUNT) {
                console.log(tempPutAway.length)
                await getPutAway(TAG)
              } else {
                await dispatch(dataActions.setPutAway(tempPutAway));

              }
            }
          }
        } else {
          Alert.alert(
            Language.t('alert.errorTitle'),
          );
        }
      })
      .catch((error) => {
        console.error('ERROR at _fetchGuidLogin' + error);
        closeLoading()
        if (databaseReducer.Data.urlser == '') {
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t('selectBase.error'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        } else {
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t('alert.internetError'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        }
      })
  }


  const decrementClock = () => {
    if (countdown === 0) {
      setCountdown(0);
      clearInterval(clockCall);
    } else {
      setCountdown(countdown + 1);
    }
  };



  return (
    <>
      {loading && (
        <View
          style={{
            width: deviceWidth,
            height: deviceHeight,
            backgroundColor: Colors.backgroundColor,
            alignSelf: 'center',
            justifyContent: 'center',
            alignContent: 'center',
            position: 'absolute',
          }}>
             <View>
                <TouchableNativeFeedback>
                  <Image
                    style={{  width: null,
                      height: 200,}}
                    resizeMode={'contain'}
                    source={require('../img/2.5.png')}
                  />
                </TouchableNativeFeedback>

              </View>
          <ActivityIndicator
            style={{
              borderRadius: 15,
              backgroundColor: null,
              width: 100,
              height: 100,
              alignSelf: 'center',
            }}
            animating={loading}
            size="large"
            color={Colors.darkPrimiryColor}
          />
        </View>
      )
      }
    </>
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
    marginVertical: 10,
    paddingLeft: 5,
    marginHorizontal: 5,
    //padding: 16,
  },
  buttonTouchable2: {
    alignSelf: 'flex-end',
    marginVertical: 10,
    marginHorizontal: 5,

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
export default connect(mapStateToProps, mapDispatchToProps)(Splashs);
