import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Dimensions,
  Text,
  Platform,
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native';
import { Picker, } from 'native-base';
import { useStateIfMounted } from 'use-state-if-mounted';
import { SafeAreaView } from 'react-native-safe-area-context';
import RNRestart from 'react-native-restart';

import { connect } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Colors from '../src/Colors';
import { useSelector, useDispatch } from 'react-redux';
import { FontSize } from '../components/FontSizeHelper';
import { useNavigation } from '@react-navigation/native';
import Dialog from 'react-native-dialog';
import { Language, changeLanguage } from '../translations/I18n';

import DeviceInfo from 'react-native-device-info';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

import * as loginActions from '../src/actions/loginActions';
import * as registerActions from '../src/actions/registerActions';
import * as databaseActions from '../src/actions/databaseActions';

const SelectBase = ({ route }) => {

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {
    container2,
    container1,
    button,
    textButton,
    topImage,
    tabbar,
    buttonContainer,
  } = styles;

  const loginReducer = useSelector(({ loginReducer }) => loginReducer);
  const registerReducer = useSelector(({ registerReducer }) => registerReducer);
  const databaseReducer = useSelector(({ databaseReducer }) => databaseReducer);

  const [selectedValue, setSelectedValue] = useState('');
  const [selectbaseValue, setSelectbaseValue] = useState('-1');
  const [selectlanguage, setlanguage] = useState(Language.getLang() == 'th' ? 'th' : 'en');
  const [basename, setBasename] = useState('');
  const [baseurl, setBsaeurl] = useState('');
  const [ForkCode, setForkCode] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isShowDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useStateIfMounted(false);
  const [loading_backG, setLoading_backG] = useStateIfMounted(true);
  const [machineNo, setMachineNo] = useState('');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState(loginReducer.ipAddress.length > 0 ? loginReducer.ipAddress : '');
  const [data, setData] = useStateIfMounted({
    secureTextEntry: true,
  });
  const [updateindex, setUpdateindex] = useState(null)

  const setlanguageState = (itemValue) => {
    dispatch(loginActions.setLanguage(itemValue))
    console.log(itemValue)
  }
  var a = 0

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  const fetchData = () => {
    navigation.dispatch(
      navigation.replace('Select', { data: a })
    )
  }
  useEffect(() => {
    if (databaseReducer.Data.nameser)
      _onPressSelectbaseValue(databaseReducer.Data.nameser)
  }, []);

  useEffect(() => {
    if (route.params?.post) {
      setBasename(route.params.post.value)
      setBsaeurl(route.params.post.label)
    }
  }, [route.params?.post]);
  useEffect(() => {
    if (loginReducer.language && loginReducer.language != Language.getLang()) {
      console.log('loginReducer.Language >> ', loginReducer.language)
      changeLanguage(loginReducer.language);
      setlanguage(loginReducer.language)
      RNRestart.Restart();
    }

    //backsakura 
  }, [loginReducer.language]);
  const _onPressSelectbaseValue = async (itemValue) => {
    console.log(itemValue)
    setSelectbaseValue(itemValue)
    if (itemValue != '-1') {
      for (let i in items) {
        if (items[i].nameser == itemValue) {
          setBasename(items[i].nameser)
          setBsaeurl(items[i].urlser)
          setForkCode(items[i].ForkCode)
          setUsername(items[i].usernameser)
          setPassword(items[i].passwordser)
          setUpdateindex(i)
        }
      }
    } else {
      setBasename('')
      setBsaeurl('')
      setForkCode('')
      setUsername('')
      setPassword('')
    }
  }
  const closeLoading = () => {
    setLoading(false);
  };
  const letsLoading = () => {
    setLoading(true);
  };



  const checkValue = () => {
    let c = true
    if (basename == '') {

      c = false
    }
    else if (baseurl == '') {

      c = false
    }
    else if (username == '') {

      c = false
    }
    else if (password == '') {

      c = false
    }
    return c
  }
  const _onPressUpdate = async (basename, newurl) => {

    if (checkValue() == true) {
      await checkIPAddress('-1')
    }
  }
  const _onPressDelete = async () => {


    let temp = loginReducer.ipAddress;
    let tempurl = baseurl.split('.dll')
    let newurl = tempurl[0] + '.dll'
    if (baseurl == databaseReducer.Data.urlser) {
      Alert.alert('', Language.t('selectBase.cannotDelete'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
    } else {
      if (temp.length == 1) {
        Alert.alert('', Language.t('selectBase.cannotDelete'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
      } else {
        for (let i in loginReducer.ipAddress) {
          if (loginReducer.ipAddress[i].urlser == baseurl) {
            Alert.alert('', Language.t('selectBase.questionDelete'), [{
              text: Language.t('alert.ok'), onPress: () => {
                temp.splice(i, 1);
                dispatch(loginActions.ipAddress(temp));
                fetchData()
              }
            }, { text: Language.t('alert.cancel'), onPress: () => { } }]);
            break;
          }
        }

      }
    }
    setLoading(false)
  }

  const _onPressAddbase = async () => {
    letsLoading()
    let tempurl = baseurl.split('.dll')
    let newurl = tempurl[0] + '.dll'
    let temp = []
    let check = false;
    let checktest = false;
    console.log('Hit')
    if (checkValue() == true) {
      temp = items;
      for (let i in items) {
        if (i != updateindex) {
          if (items[i].nameser != basename && items[i].urlser == newurl) {
            checktest = true
          } else if (items[i].nameser == basename && items[i].urlser != newurl) {
            checktest = true
          }
        }
      }
      if (!checktest) {
        for (let i in items) {
          if (items[i].nameser == basename && items[i].urlser == newurl) {
            checkIPAddress('0')
            check = true;
          } else {
            if (
              items[i].nameser == basename
            ) {
              Alert.alert(Language.t('selectBase.Alert'), Language.t('selectBase.Alert2') + Language.t('selectBase.url'), [{
                text: Language.t('selectBase.yes'), onPress: () => _onPressUpdate(basename, newurl)
              }, { text: Language.t('selectBase.no'), onPress: () => console.log('cancel Pressed') }]);
              check = true;
              break;
            } else if (
              items[i].urlser == newurl
            ) {
              Alert.alert(Language.t('selectBase.Alert'), Language.t('selectBase.Alert2') + Language.t('selectBase.name'), [{
                text: Language.t('selectBase.yes'), onPress: () => _onPressUpdate(basename, newurl)
              }, { text: Language.t('selectBase.no'), onPress: () => console.log('cancel Pressed') }]);
              check = true;
              break;
            }
          }
        }
        if (!check) {
          checkIPAddress('1')
        }
      } else {
        Alert.alert(
          Language.t('alert.errorTitle'),
          Language.t('selectBase.Alert3'), [{ text: Language.t('alert.ok'), onPress: () => _onPressSelectbaseValue(selectbaseValue) }]);
        setLoading(false)
      }

    } else {
      Alert.alert(
        Language.t('alert.errorTitle'),
        Language.t('alert.errorDetail'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
      setLoading(false)
    }

  }



  const checkIPAddress = async (state) => {
    let tempurl = baseurl.split('.dll')
    let newurl = tempurl[0] + '.dll'
    let temp = []

    await fetch(baseurl + '/DevUsers', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-LOGIN-GUID': '',
        'BPAPUS-FUNCTION': 'Register',
        'BPAPUS-PARAM':
          '{ "BPAPUS-MACHINE": "11111122","BPAPUS-CNTRY-CODE": "66", "BPAPUS-MOBILE": "mobile login"}',
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.ResponseCode == 200 && json.ReasonString == 'Completed') {
          console.log('Register SS')
          fetch(baseurl + '/DevUsers', {
            method: 'POST',
            body: JSON.stringify({
              'BPAPUS-BPAPSV': loginReducer.serviceID,
              'BPAPUS-LOGIN-GUID': '',
              'BPAPUS-FUNCTION': 'Login',
              'BPAPUS-PARAM':
                '{"BPAPUS-MACHINE": "11111122","BPAPUS-USERID": "' +
                username.toUpperCase() +
                '","BPAPUS-PASSWORD": "' +
                password.toUpperCase() +
                '"}',
            }),
          })
            .then((response) => response.json())
            .then((json) => {
              if (json && json.ResponseCode == '200') {
                let newObj = {
                  nameser: basename,
                  urlser: baseurl,
                  ForkCode: ForkCode,
                  usernameser: username.toUpperCase(),
                  passwordser: password.toUpperCase()
                }

                dispatch(databaseActions.setData(newObj))
                fetch(baseurl + '/DevUsers', {
                  method: 'POST',
                  body: JSON.stringify({
                    'BPAPUS-BPAPSV': loginReducer.serviceID,
                    'BPAPUS-LOGIN-GUID': "",
                    'BPAPUS-FUNCTION': 'UnRegister',
                    'BPAPUS-PARAM':
                      '{"BPAPUS-MACHINE": "11111122"}',
                  }),
                })
                  .then((response) => response.json())
                  .then((json) => {
                    if (json && json.ResponseCode == '200') {
                      Alert.alert(
                        Language.t('alert.succeed'),
                        Language.t('selectBase.connect') + ' ' + basename + ' ' + Language.t('alert.succeed'), [{
                          text: Language.t('alert.ok'), onPress: () => navigation.dispatch(
                            navigation.replace('Login')
                          )
                        }])
                    }
                  })
              } else {
                console.log('Function Parameter Required');
                let temp_error = 'error_ser.' + json.ResponseCode;
                console.log('>> ', temp_error)
                Alert.alert(
                  Language.t('alert.errorTitle'),
                  Language.t(temp_error), [{ text: Language.t('alert.ok'), onPress: () => _onPressSelectbaseValue(selectbaseValue) }]);
                setLoading(false)
              }

            })
            .catch((error) => {
              Alert.alert(
                Language.t('alert.errorTitle'),
                Language.t('alert.errorDetail'), [{ text: Language.t('alert.ok'), onPress: () => _onPressSelectbaseValue(selectbaseValue) }]);
              console.error('_fetchGuidLogin ' + error);
              setLoading(false)
            });
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
        Alert.alert(
          Language.t('alert.errorTitle'),
          Language.t('alert.errorDetail'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        console.log('checkIPAddress');
        setLoading(false)
      });
  };

  return (
    <>

      <View style={tabbar}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}>
            <FontAwesome name="arrow-left" style={{ color: Colors.buttonTextColor, }} size={FontSize.medium * 1.5} />
          </TouchableOpacity>
          <Text
            style={{
              marginLeft: 12,
              fontSize: FontSize.medium,
              color: Colors.buttonTextColor,
            }}> {Language.t('selectBase.header')}</Text>
        </View>
        <View>
          <Picker
            selectedValue={selectlanguage}
            style={{ color: Colors.buttonTextColor, width: 110 }}
            mode="dropdown"
            onValueChange={(itemValue, itemIndex) => Alert.alert('', Language.t('menu.changeLanguage'), [{ text: Language.t('alert.ok'), onPress: () => console.log(' setlanguageState(itemValue)') }, { text: Language.t('alert.cancel'), onPress: () => { } }])} >
            <Picker.Item label="TH" value="th" />
            <Picker.Item label="EN" value="en" />
          </Picker>
        </View>
      </View>

      <View style={container1}>
        <ScrollView>
          <SafeAreaView >
            <KeyboardAvoidingView keyboardVerticalOffset={1} >
              <View style={styles.body}>
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.textTitle}>
                    {Language.t('selectBase.url')} :
                  </Text>
                </View>
                <View style={{ marginTop: 10 }}>
                  <View
                    style={{
                      backgroundColor: Colors.backgroundColorSecondary,
                      flexDirection: 'column',
                      borderWidth: 1,
                      borderColor: Colors.darkPrimiryColor,
                      height: 50,
                      borderRadius: 10,
                      paddingLeft: 20,
                      paddingRight: 20,
                      paddingTop: 10,
                      height: 'auto',
                      paddingBottom: 10

                    }}>
                    <View style={{ height: 'auto', flexDirection: 'row' }}>

                      <TextInput
                        style={{
                          flex: 8,
                          marginLeft: 10,
                          borderBottomColor: Colors.darkPrimiryColor,
                          color: Colors.fontColor,
                          paddingVertical: 3,
                          fontSize: FontSize.medium,
                          height: 'auto',
                          borderBottomWidth: 0.7,
                        }}
                        multiline={true}
                        placeholderTextColor={Colors.fontColorSecondary}

                        value={baseurl}
                        placeholder={Language.t('selectBase.url') + '..'}
                        onChangeText={(val) => {
                          setBsaeurl(val);
                        }}></TextInput>
                      <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.navigate('Scan', { route: 'Select' })}>

                        <FontAwesome
                          name="qrcode"
                          size={FontSize.large}
                          color={Colors.darkPrimiryColor}
                        />

                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.textTitle}>
                    {'รหัสรถ : '}
                  </Text>
                </View>
                <View style={{ marginTop: 10 }}>
                  <View
                    style={{
                      backgroundColor: Colors.backgroundColorSecondary,
                      flexDirection: 'column',
                      borderWidth: 1,
                      borderColor: Colors.darkPrimiryColor,
                      height: 50,
                      borderRadius: 10,
                      paddingLeft: 20,
                      paddingRight: 20,
                      paddingTop: 10,
                      paddingBottom: 10
                    }}>
                    <View style={{ height: 30, flexDirection: 'row' }}>

                      <TextInput
                        style={{
                          flex: 8,
                          marginLeft: 5,
                          borderBottomColor: Colors.darkPrimiryColor,
                          color: Colors.fontColor,
                          paddingVertical: 3,
                          fontSize: FontSize.medium,
                          borderBottomWidth: 0.7,
                        }}

                        placeholderTextColor={Colors.fontColorSecondary}

                        value={ForkCode}
                        placeholder={'รหัสรถ ..'}
                        onChangeText={(val) => {
                          setForkCode(val);
                        }}></TextInput>

                    </View>
                  </View>
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.textTitle}>
                    {Language.t('login.username')} :
                  </Text>
                </View>
                <View style={{ marginTop: 10 }}>
                  <View
                    style={{
                      backgroundColor: Colors.backgroundColorSecondary,
                      flexDirection: 'column',
                      borderWidth: 1,
                      borderColor: Colors.darkPrimiryColor,
                      height: 50,
                      borderRadius: 10,
                      paddingLeft: 20,
                      paddingRight: 20,
                      paddingTop: 10,
                      paddingBottom: 10
                    }}>
                    <View style={{ height: 30, flexDirection: 'row' }}>

                      <TextInput
                        style={{
                          flex: 8,
                          marginLeft: 5,
                          borderBottomColor: Colors.darkPrimiryColor,
                          color: Colors.fontColor,
                          paddingVertical: 3,
                          fontSize: FontSize.medium,
                          borderBottomWidth: 0.7,
                        }}

                        placeholderTextColor={Colors.fontColorSecondary}

                        value={username}
                        placeholder={Language.t('login.username') + '..'}
                        onChangeText={(val) => {
                          setUsername(val);
                        }}></TextInput>

                    </View>
                  </View>
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.textTitle}>
                    {Language.t('login.password')} :
                  </Text>
                </View>
                <View style={{ marginTop: 10 }}>
                  <View
                    style={{
                      backgroundColor: Colors.backgroundColorSecondary,
                      flexDirection: 'column',
                      height: 50,
                      borderWidth: 1,
                      borderColor: Colors.darkPrimiryColor,
                      borderRadius: 10,
                      paddingLeft: 20,
                      paddingRight: 20,
                      paddingTop: 10,
                      paddingBottom: 10
                    }}>
                    <View style={{ height: 30, flexDirection: 'row' }}>

                      <TextInput
                        style={{
                          flex: 8,
                          marginLeft: 5,
                          color: Colors.fontColor,
                          paddingVertical: 3,
                          fontSize: FontSize.medium,
                          borderBottomColor: Colors.darkPrimiryColor,
                          borderBottomWidth: 0.7,
                        }}
                        secureTextEntry={data.secureTextEntry ? true : false}
                        keyboardType="default"

                        placeholderTextColor={Colors.fontColorSecondary}
                        placeholder={Language.t('login.password') + '..'}
                        value={password}
                        onChangeText={(val) => {
                          setPassword(val);
                        }}
                      />
                      <TouchableOpacity style={{ marginLeft: 10 }} onPress={updateSecureTextEntry}>
                        {data.secureTextEntry ? (
                          <FontAwesome
                            name="eye-slash"
                            size={FontSize.medium}
                            color={Colors.darkPrimiryColor}
                          />
                        ) : (
                          <FontAwesome
                            name="eye"
                            size={FontSize.medium}
                            color={Colors.darkPrimiryColor} />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View style={styles.body1e}>
                  <TouchableNativeFeedback
                    onPress={() => _onPressAddbase()}>
                    <View
                      style={{
                        borderRadius: 30,
                        flexDirection: 'column',
                        justifyContent: 'center',
                        height: 80,
                        marginRight: 10, width: deviceWidth / 3,
                        backgroundColor: Colors.darkPrimiryColor,
                      }}>
                      <Text
                        style={{
                          color: Colors.buttonTextColor,
                          alignSelf: 'center',
                          fontSize: FontSize.medium,
                          fontWeight: 'bold',
                        }}>
                        {Language.t('selectBase.saveandconnect')}
                      </Text>
                    </View>
                  </TouchableNativeFeedback>
                  {/* {items.length > 0 ? (
                    <TouchableNativeFeedback
                      onPress={() => _onPressDelete()}>
                      <View
                        style={{
                          borderRadius: 10,
                          flexDirection: 'column',
                          justifyContent: 'center',
                          height: 50,
                          width: deviceWidth / 5,
                          backgroundColor: Colors.buttonColorPrimary,
                        }}>
                        <Text
                          style={{
                            color: Colors.backgroundColorSecondary,
                            alignSelf: 'center',
                            fontSize: FontSize.medium,
                            fontWeight: 'bold',
                          }}>
                          {Language.t('selectBase.delete')}
                        </Text>
                      </View>
                    </TouchableNativeFeedback>
                  ) : (
                    <TouchableNativeFeedback
                      onPress={() => null}>
                      <View
                        style={{
                          borderRadius: 10,
                          flexDirection: 'column',
                          justifyContent: 'center',
                          height: 50,
                          width: deviceWidth / 5,
                          backgroundColor: Colors.buttonTextColor,
                        }}>
                        <Text
                          style={{
                            color: '#C5C5C5',
                            alignSelf: 'center',
                            fontSize: FontSize.medium,
                            fontWeight: 'bold',

                          }}>
                          {Language.t('selectBase.delete')}
                        </Text>
                      </View>
                    </TouchableNativeFeedback>
                  )} */}

                </View>
              </View>

            </KeyboardAvoidingView>

          </SafeAreaView>
        </ScrollView>



      </View>

      {loading && (
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
    </>
  )
}

const styles = StyleSheet.create({
  container1: {
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Colors.backgroundColor
  },
  body: {
    width: deviceWidth / 2
  },
  body1e: {
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  body1: {
    marginTop: 10,
    flexDirection: "row",
  },
  tabbar: {
    height: 70,
    padding: 12,
    paddingLeft: 20,
    alignItems: 'center',
    backgroundColor: Colors.headerColor,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  image: {
    flex: 1,
    justifyContent: "center"
  },
  dorpdown: {
    justifyContent: 'center',
    fontSize: FontSize.medium,
  },
  dorpdownTop: {
    justifyContent: 'flex-end',
    fontSize: FontSize.medium,
  },
  textTitle: {
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
    height: deviceHeight / 3,
    width: deviceWidth,

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
    marginLeft: 10,
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: "center",
    borderBottomColor: '#ffff',
    color: '#ffff',
  },
  label: {
    margin: 8,
    color: '#ffff',
  },
});
const mapStateToProps = (state) => {
  return {


  };
};

const mapDispatchToProps = (dispatch) => {
  return {

    reduxMachineNum: (payload) => dispatch(registerActions.machine(payload)),

  };
};
export default connect(mapStateToProps, mapDispatchToProps)(SelectBase);
