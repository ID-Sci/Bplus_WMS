import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  Image,
  ImageBackground,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
  Platform,
  BackHandler,
  StatusBar,
  ScrollView,
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native';

import CheckBox from '@react-native-community/checkbox';
import DeviceInfo from 'react-native-device-info';
import { NetworkInfo } from "react-native-network-info";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStateIfMounted } from 'use-state-if-mounted';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { useSelector, connect, useDispatch } from 'react-redux';
import { Language, changeLanguage } from '../translations/I18n';
import { FontSize } from '../components/FontSizeHelper';
import * as loginActions from '../src/actions/loginActions';
import * as registerActions from '../src/actions/registerActions';
import * as databaseActions from '../src/actions/databaseActions';

import * as dataActions from '../src/actions/dataActions';
import Colors from '../src/Colors';
import { fontSize, fontWeight } from 'styled-system';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const LoginScreen = () => {

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const dataReducer = useSelector(({ dataReducer }) => dataReducer);
  const registerReducer = useSelector(({ registerReducer }) => registerReducer);
  const loginReducer = useSelector(({ loginReducer }) => loginReducer);
  const databaseReducer = useSelector(({ databaseReducer }) => databaseReducer);
  const {
    container2,
    container1,
    button,
    textButton,
    topImage,
    tabbar,
    buttonContainer,
  } = styles;

  useEffect(() => {


    //backsakura013
  }, []);

  const [GUID, setGUID] = useStateIfMounted(loginReducer.guid);

  const [isSelected, setSelection] = useState(loginReducer.userloggedIn == true ? loginReducer.userloggedIn : false);
  const [isSFeatures, setSFeatures] = useState(loginReducer.isSFeatures == true ? loginReducer.isSFeatures : false);

  const [loading, setLoading] = useStateIfMounted(false);
  const [loading_backG, setLoading_backG] = useStateIfMounted(true);

  const [resultJson, setResultJson] = useState([]);
  const [marker, setMarker] = useState(false);
  const [username, setUsername] = useState(loginReducer.userloggedIn == true ? loginReducer.userNameED : '');
  const [password, setPassword] = useState(loginReducer.userloggedIn == true ? loginReducer.passwordED : '');

  const [data, setData] = useStateIfMounted({
    secureTextEntry: true,
  });
  useEffect(() => {

    if (loginReducer.guid.length > 0) auto_login()
  }, []);
  useEffect(() => {
    console.log('>> isSFeatures : ', getMac())
    if (registerReducer.machineNum.length == 0)
      getMac()

    console.log('>> Language : ', Language.getLang())

  }, []);
  useEffect(() => {
    dispatch(loginActions.setFingerprint(isSFeatures));

  }, [isSFeatures]);
  useEffect(() => {
    console.log('>> machineNum :', registerReducer.machineNum + '\n\n\n\n')
  }, [registerReducer.machineNum]);

  const closeLoading = () => {
    setLoading(false);
  };
  const letsLoading = () => {
    setLoading(true);
  };

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };
  // const getMac = async () => {
  //   var lodstr = ''
  //   for (var i = 0; i < 100; i++) {
  //     lodstr += '_'

  //   }


  //   await DeviceInfo.getMacAddress().then((mac) => {
  //     var a = Math.floor(100000 + Math.random() * 900000);
  //     console.log(DeviceInfo.getDeviceName())
  //     console.log('\nmachine > > ' + mac)
  //     if (mac.length > 0) dispatch(registerActions.machine(mac));
  //     else NetworkInfo.getBSSID().then(macwifi => {
  //       console.log('\nmachine(wifi) > > ' + macwifi)
  //       if (macwifi.length > 0) dispatch(registerActions.machine(macwifi));
  //       else dispatch(registerActions.machine('9b911981-afbf-42d4-9828-0924a112d48e'));
  //     }).catch((e) => dispatch(registerActions.machine('9b911981-afbf-42d4-9828-0924a112d48e')));
  //   }).catch((e) => dispatch(registerActions.machine('9b911981-afbf-42d4-9828-0924a112d48e')));
  // }
  const getMac = async () => {


    try {
      let mac = await DeviceInfo.getMacAddress();

      if (isValidMac(mac)) {
        console.log(await DeviceInfo.getDeviceName());
        console.log('\nmachine > > ' + mac);
        dispatch(registerActions.machine(mac));
      }

      let wifiMac = await NetworkInfo.getBSSID();

      if (isValidMac(wifiMac)) {
        console.log('\nmachine(wifi) > > ' + wifiMac);
        dispatch(registerActions.machine(wifiMac));
      }

      let deviceId = DeviceInfo.getUniqueId();

      if (isValidDeviceId(deviceId)) {
        console.log('\ndeviceId > > ' + JSON.stringify(deviceId));
        dispatch(registerActions.machine(deviceId));
      }

      let uuid = generateUUID();
      dispatch(registerActions.machine(uuid));
    } catch (error) {
      console.error(error);
      let uuid = generateUUID();
      dispatch(registerActions.machine(uuid));
    }
  };
  const isValidMac = (mac) => {
    return mac && mac.length > 0 && mac !== "02:00:00:00:00:00" && typeof (mac) !== 'object';
  };

  const isValidDeviceId = (deviceId) => {
    return deviceId && deviceId.length > 0 && deviceId !== "02:00:00:00:00:00" && typeof (deviceId) !== 'object';
  };

  const generateUUID = () => {
    let uuid = '';
    const characters = '0123456789abcdef';
    for (let i = 0; i < 36; i++) {
      if (i === 8 || i === 13 || i === 18 || i === 23) {
        uuid += '-';
      } else {
        uuid += characters[Math.floor(Math.random() * characters.length)];
      }
    }

    return uuid;
  };
  useEffect(() => {
  }, [])


  const tslogin = async () => {
    navigation.navigate('Main')
    // await setLoading(true)

    // await regisMacAdd()
    // await setLoading(false)
  }
  const auto_login = async () => {
    await setUsername(loginReducer.userNameED)
    await setPassword(loginReducer.passwordED)
    await regisMacAdd()
  }
  // const auto_regisMacAdd = async () => {
  //   letsLoading()
  //   await fetch(databaseReducer.Data.urlser + '/DevUsers', {
  //     method: 'POST',
  //     body: JSON.stringify({
  //       'BPAPUS-BPAPSV': loginReducer.serviceID,
  //       'BPAPUS-LOGIN-GUID': '',
  //       'BPAPUS-FUNCTION': 'Register',
  //       'BPAPUS-PARAM':
  //         '{"BPAPUS-MACHINE":"' +
  //         registerReducer.machineNum +
  //         '","BPAPUS-CNTRY-CODE": "66","BPAPUS-MOBILE": "mobile login"}',
  //     }),
  //   })
  //     .then((response) => response.json())
  //     .then(async (json) => {
  //       if (json.ResponseCode == 200 && json.ReasonString == 'Completed') {
  //         await auto_fetchGuidLog();
  //       } else {
  //         console.log('Function Parameter Required');
  //         let temp_error = 'error_ser.' + json.ResponseCode;
  //         console.log('>> ', temp_error)
  //         Alert.alert(
  //           Language.t('alert.errorTitle'),
  //           Language.t(temp_error), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log('ERROR at regisMacAdd ' + error);
  //       console.log('http', databaseReducer.Data.urlser);
  //       if (databaseReducer.Data.urlser == '') {
  //         Alert.alert(
  //           Language.t('alert.errorTitle'),
  //           Language.t('selectBase.error'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
  //       } else {
  //         Alert.alert(
  //           Language.t('alert.errorTitle'),
  //           Language.t('alert.internetError'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
  //       }
  //     });
  // };

  // const auto_fetchGuidLog = async () => {
  //   console.log('FETCH GUID LOGIN ', databaseReducer.Data.urlser);
  //   await fetch(databaseReducer.Data.urlser + '/DevUsers', {
  //     method: 'POST',
  //     body: JSON.stringify({
  //       'BPAPUS-BPAPSV': loginReducer.serviceID,
  //       'BPAPUS-LOGIN-GUID': '',
  //       'BPAPUS-FUNCTION': 'Login',
  //       'BPAPUS-PARAM':
  //         '{"BPAPUS-MACHINE": "' +
  //         registerReducer.machineNum +
  //         '","BPAPUS-USERID": "' +
  //         loginReducer.userNameED +
  //         '","BPAPUS-PASSWORD": "' +
  //         loginReducer.passwordED +
  //         '"}',
  //     }),
  //   })
  //     .then((response) => response.json())
  //     .then((json) => {
  //       if (json && json.ResponseCode == '635') {
  //         Alert.alert(
  //           Language.t('alert.errorTitle'),
  //           Language.t('alert.errorDetail'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
  //         console.log('NOT FOUND MEMBER');
  //       } else if (json && json.ResponseCode == '629') {
  //         Alert.alert(
  //           Language.t('alert.errorTitle'),
  //           'Function Parameter Required', [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
  //       } else if (json && json.ResponseCode == '200') {
  //         let responseData = JSON.parse(json.ResponseData)
  //         dispatch(loginActions.guid(responseData.BPAPUS_GUID))
  //         dispatch(loginActions.userNameED(username.toUpperCase()))
  //         dispatch(loginActions.passwordED(password.toUpperCase()))
  //         dispatch(dataActions.setPutAway([]));
  //         dispatch(dataActions.setPicking([]));
  //         dispatch(loginActions.userlogin(isSelected))
  //         navigation.dispatch(
  //           navigation.replace('Splashs', {})
  //         )
  //       } else {
  //         console.log('Function Parameter Required');
  //         let temp_error = 'error_ser.' + json.ResponseCode;
  //         console.log('>> ', temp_error)
  //         Alert.alert(
  //           Language.t('alert.errorTitle'),
  //           Language.t(temp_error), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('ERROR at _fetchGuidLogin' + error);
  //       if (databaseReducer.Data.urlser == '') {
  //         Alert.alert(
  //           Language.t('alert.errorTitle'),
  //           Language.t('selectBase.error'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);

  //       } else {
  //         Alert.alert(
  //           Language.t('alert.errorTitle'),
  //           Language.t('alert.internetError') + "1", [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
  //       }
  //     });
  //   setLoading(false)
  // };
  const UnRegister = async () => {
    dispatch(loginActions.guid(''))
    await fetch(databaseReducer.Data.urlser + '/DevUsers', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-LOGIN-GUID': '',
        'BPAPUS-FUNCTION': 'UnRegister',
        'BPAPUS-PARAM':
          '{"BPAPUS-MACHINE": "' +
          registerReducer.machineNum +
          '" }',
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
      })
      .catch((error) => {
        console.log('ERROR at regisMacAdd ' + error);
        console.log('http', databaseReducer.Data.urlser);
        if (databaseReducer.Data.urlser == '') {
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t('selectBase.error'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        } else {
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t('alert.internetError'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        }
        setLoading(false)
      });

  };

  const regisMacAdd = async () => {
    letsLoading()
    await UnRegister()
    await fetch(databaseReducer.Data.urlser + '/DevUsers', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-LOGIN-GUID': '',
        'BPAPUS-FUNCTION': 'Register',
        'BPAPUS-PARAM':
          '{"BPAPUS-MACHINE":"' +
          registerReducer.machineNum +
          '","BPAPUS-CNTRY-CODE": "66","BPAPUS-MOBILE": "mobile login"}',
      }),
    })
      .then((response) => response.json())
      .then(async (json) => {
        if (json.ResponseCode == 200 && json.ReasonString == 'Completed') {
          await _fetchGuidLog();
        } else {
          console.log('Function Parameter Required');
          let temp_error = 'error_ser.' + json.ResponseCode;
          console.log('>> ', temp_error)
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t(temp_error), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
          setLoading(false)
        }
      })
      .catch((error) => {
        console.log('ERROR at regisMacAdd ' + error);
        console.log('http', databaseReducer.Data.urlser);
        if (databaseReducer.Data.urlser == '') {
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t('selectBase.error'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        } else {
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t('alert.internetError'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        }
        setLoading(false)
      })
  }

  const _fetchGuidLog = async () => {
    console.log('FETCH GUID LOGIN ', databaseReducer.Data.urlser);
    console.log(loginReducer.userNameED, loginReducer.passwordED)
    const temp_username = dataReducer.nextJOB.data ? loginReducer.userNameED : username.toUpperCase()
    const temp_password = dataReducer.nextJOB.data ? loginReducer.passwordED : password.toUpperCase()
    await fetch(databaseReducer.Data.urlser + '/DevUsers', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-LOGIN-GUID': '',
        'BPAPUS-FUNCTION': 'Login',
        'BPAPUS-PARAM':
          '{"BPAPUS-MACHINE": "' +
          registerReducer.machineNum +
          '","BPAPUS-USERID": "' +
          temp_username +
          '","BPAPUS-PASSWORD": "' +
          temp_password +
          '"}',
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json && json.ResponseCode == '635') {
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t('alert.errorDetail'), [{ text: Language.t('alert.ok'), onPress: () => closeLoading() }]);
          console.log('NOT FOUND MEMBER');
        } else if (json && json.ResponseCode == '629') {
          Alert.alert(
            Language.t('alert.errorTitle'),
            'Function Parameter Required', [{ text: Language.t('alert.ok'), onPress: () => closeLoading() }]);
        } else if (json && json.ResponseCode == '200') {
          let responseData = JSON.parse(json.ResponseData)
          dispatch(loginActions.guid(responseData.BPAPUS_GUID))
          dispatch(loginActions.userNameED(username.toUpperCase()))
          dispatch(loginActions.passwordED(password.toUpperCase()))
          dispatch(dataActions.setPutAway([]));
          dispatch(dataActions.setPicking([]));
          dispatch(loginActions.userlogin(isSelected))
          if (dataReducer.nextJOB && dataReducer.nextJOB.data)
            navigation.dispatch(
              navigation.replace(dataReducer.nextJOB.name, { name: 'บันทึกรายละเอียดงานจัดเก็บ', data: dataReducer.nextJOB.data })
            )
          else
            navigation.dispatch(
              navigation.replace('Main', {})
            )
          setLoading(false)
        } else {
          console.log('Function Parameter Required');
          let temp_error = 'error_ser.' + json.ResponseCode;
          console.log('>> ', temp_error)
          setLoading(false)
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t(temp_error), [{ text: Language.t('alert.ok'), onPress: () => closeLoading() }]);
        }
      })
      .catch((error) => {
        setLoading(false)
        console.error('ERROR at _fetchGuidLogin' + error);
        if (databaseReducer.Data.urlser == '') {
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t('selectBase.error'), [{ text: Language.t('alert.ok'), onPress: () => closeLoading() }]);

        } else {
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t('alert.internetError') + "1", [{ text: Language.t('alert.ok'), onPress: () => closeLoading() }]);
        }
      });

  };




  return (
    < >
      <SafeAreaView
        style={{
          flex: 1,
          flexDirection: 'column',
        }}>
        <ScrollView>
          <View style={tabbar}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Select', { data: '' })}>
              <FontAwesomeIcon name="gear" size={30} color={Colors.fontColor} />
            </TouchableOpacity>
            <Text
              style={{
                marginLeft: 12,
                fontSize: FontSize.medium,
                color: Colors.backgroundLoginColorSecondary,
              }}></Text>
          </View>

          <View style={container1}>
            <View style={{ width: deviceWidth / 2 }}>
              <View>
                <TouchableNativeFeedback>
                  <Image
                    style={topImage}
                    resizeMode={'contain'}
                    source={require('../img/2.5.png')}
                  />
                </TouchableNativeFeedback>

              </View>
              {GUID.length == 0 ? (<>

                <View
                  style={{
                    backgroundColor: Colors.backgroundLoginColorSecondary,
                    flexDirection: 'column',
                    borderRadius: 10,
                    paddingLeft: 10,
                    paddingRight: 10,
                    paddingTop: 10,
                    paddingBottom: 10,
                    shadowColor: Colors.borderColor,
                    shadowOffset: {
                      width: 0,
                      height: 6,
                    },
                    shadowOpacity: 0.5,
                    shadowRadius: 1.0,
                    elevation: 15,
                  }}>
                  <View style={{ height: FontSize.medium * 3, flexDirection: 'row', alignItems: 'center' }}>
                    <FontAwesomeIcon
                      name="user"
                      size={25}
                      color={Colors.darkPrimiryColor}
                    />
                    <TextInput
                      style={{
                        flex: 8,
                        marginLeft: 10,
                        borderBottomColor: Colors.darkPrimiryColor,
                        color: Colors.fontColor,
                        paddingVertical: 7,
                        fontSize: FontSize.medium,
                        borderBottomWidth: 0.7,
                      }}

                      placeholderTextColor={Colors.fontColorSecondary}
                      value={username}
                      placeholder={Language.t('login.username')}
                      onChangeText={(val) => {
                        setUsername(val);
                      }} />
                  </View>
                </View>

                <View style={{ marginTop: 10 }}>
                  <View
                    style={{
                      backgroundColor: Colors.backgroundLoginColorSecondary,
                      flexDirection: 'column',

                      borderRadius: 10,
                      paddingLeft: 10,
                      paddingRight: 10,
                      paddingTop: 10,
                      paddingBottom: 10,

                      shadowColor: Colors.borderColor,
                      shadowOffset: {
                        width: 0,
                        height: 6,
                      },
                      shadowOpacity: 0.5,
                      shadowRadius: 1.0,

                      elevation: 15,
                    }}>

                    <View style={{ height: FontSize.medium * 3, flexDirection: 'row', alignItems: 'center' }}>
                      <FontAwesomeIcon
                        name="lock"
                        size={25}
                        color={Colors.darkPrimiryColor}
                      />
                      <TextInput
                        style={{
                          flex: 8,
                          marginLeft: 10,
                          color: Colors.fontColor,
                          paddingVertical: 7,
                          fontSize: FontSize.medium,
                          borderBottomColor: Colors.darkPrimiryColor,
                          borderBottomWidth: 0.7,
                        }}
                        secureTextEntry={data.secureTextEntry ? true : false}
                        keyboardType="default"

                        value={password}
                        placeholderTextColor={Colors.fontColorSecondary}
                        placeholder={Language.t('login.password')}
                        onChangeText={(val) => {
                          setPassword(val);
                        }}
                      />

                      <TouchableOpacity onPress={updateSecureTextEntry}>
                        {data.secureTextEntry ? (
                          <FontAwesomeIcon
                            name="eye-slash"
                            size={25}
                            color={Colors.darkPrimiryColor}
                          />
                        ) : (
                          <FontAwesomeIcon
                            name="eye"
                            size={25}
                            color={Colors.darkPrimiryColor} />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View style={styles.checkboxContainer} >
                  <View></View>
                  <CheckBox
                    value={isSelected}
                    onValueChange={(value) => setSelection(value)}

                    tintColors={{ true: Colors.inputText, false: Colors.inputText }}
                    style={styles.checkbox}
                  />
                  <Text style={styles.label} onPress={() => setSelection(!isSelected)}>{Language.t('login.rememberpassword')}</Text>
                </View>

                <TouchableOpacity
                  onPress={() => regisMacAdd()}>
                  <View
                    style={{
                      borderRadius: 20,
                      flexDirection: 'column',
                      padding: 20,
                      backgroundColor: Colors.darkPrimiryColor,
                    }}>
                    <Text
                      style={{
                        color: Colors.buttonTextColor,
                        alignSelf: 'center',
                        fontSize: FontSize.medium,
                        fontWeight: 'bold',
                      }}>
                      {Language.t('login.buttonLogin')}
                    </Text>
                  </View>
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}>
                  <Text style={Colors.borderColor}>version 1.0.2</Text>
                </View>
              </>) : (
                <ActivityIndicator
                  style={{
                    borderRadius: 15,
                    backgroundColor: null,
                    width: 100,
                    height: 100,
                    alignSelf: 'center',
                  }}
                  animating={true}
                  size="large"
                  color={Colors.darkPrimiryColor}
                />
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      {loading && GUID.length == 0 && (
        <View
          style={{
            width: deviceWidth,
            height: deviceHeight,
            opacity: 0.5,
            backgroundColor: 'black',
            alignSelf: 'center',
            justifyContent: 'center',
            alignContent: 'center',
            position: 'absolute',
          }}>
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
      )}
    </ >
  );
};

const styles = StyleSheet.create({
  container1: {
    marginTop: FontSize.medium,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    alignItems: 'center',
  },
  image: {
    flex: 1,
    justifyContent: "center"
  },
  container2: {
    width: deviceWidth,
    height: '100%',
    position: 'absolute',
    backgroundColor: 'white',
    flex: 1,
  },
  tabbar: {

    padding: 12,
    paddingLeft: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row', 
  },
  textTitle: {
    alignSelf: 'center',
    flex: 2,
    fontSize: FontSize.medium,
    fontWeight: 'bold',
    color: Colors.fontColor,
  },
  imageIcon: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topImage: {
    width: null,
    height: 200,

  },
  button: {
    marginTop: 10,
    marginBottom: 25,
    padding: 5,
    alignItems: 'center',
    backgroundColor: Colors.darkPrimiryColor,
    borderRadius: 10,
  },
  textButton: {
    fontSize: FontSize.large,
    color: Colors.fontColor2,
  },
  buttonContainer: {
    marginTop: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 20,
  },
  checkbox: {

    alignSelf: "center",
    borderBottomColor: Colors.buttonTextColor,
    color: Colors.buttonTextColor,

  },
  label: {
    margin: 8,
    color: Colors.inputText,
  },
});


export default LoginScreen;
