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
import FontAwesome from 'react-native-vector-icons/FontAwesome';


import { SafeAreaView } from 'react-native-safe-area-context';


import { useStateIfMounted } from 'use-state-if-mounted';


import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';


import { useSelector, connect, useDispatch } from 'react-redux';



import { Language, changeLanguage } from '../translations/I18n';
import { FontSize } from '../components/FontSizeHelper';


import * as loginActions from '../src/actions/loginActions';
import * as registerActions from '../src/actions/registerActions';
import * as dataActions from '../src/actions/dataActions';

import Colors from '../src/Colors';
import { fontSize, fontWeight } from 'styled-system';
import { Icon } from 'react-native-paper/lib/typescript/components/Avatar/Avatar';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const Mains = ({ route }) => {

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

  const [GUID, setGUID] = useStateIfMounted('');

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
    console.log('>> machineNum :', registerReducer.machineNum + '\n\n\n\n')
    closeLoading()
  }, [registerReducer?.machineNum])

  useEffect(() => {
    console.log(`Picking > ${dataReducer.Picking}`)
  }, [])

  const closeLoading = () => {
    setLoading(false);
  };
  const letsLoading = () => {
    setLoading(true);
  };

  const logOut = async () => {
    letsLoading()
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
        closeLoading()
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
          dispatch(loginActions.guid(''))
          navigation.dispatch(
            navigation.replace('Login')
          )
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
      });
  }

  return (
    deviceWidth > 960 ? (
      <>


        <View style={tabbar}>
          <View style={{ flexDirection: 'row' }}>
            <Text
              style={{

                fontSize: FontSize.medium,
                fontWeight: 'bold',
                color: Colors.fontColor,
              }}> {`ระบบการจัดการคลังสินค้า`}</Text>
          </View>
          <View>
            <TouchableOpacity
              style={{
                width: 80,
                paddingRight: 10,
                alignItems: 'center'
              }}
              onPress={() => logOut()}>
              <FontAwesomeIcon name="power-off" size={40} color={'red'} />
            </TouchableOpacity>
          </View>

        </View>

        <View style={{
          width: deviceWidth,
          height: deviceHeight - deviceHeight * 0.1,
          flexDirection: 'row',
          paddingLeft: deviceHeight * 0.1,
          paddingRight: deviceHeight * 0.1,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>


          <TouchableOpacity style={{
            backgroundColor: Colors.putAway,
            flexDirection: 'column',
            shadowColor: Colors.borderColor,
            borderRadius: deviceWidth * 0.4,
            width: deviceWidth * 0.4,
            height: deviceHeight * 0.2,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1
          }}
            onPress={() => navigation.dispatch(
              navigation.replace('Splashs', { data: 'MAJ' }))}
          >
            <Text style={{
              color: Colors.fontColor2,
              alignSelf: 'center',
              fontSize: FontSize.large,
              fontWeight: 'bold'
            }}>Put-away</Text>
          </TouchableOpacity>




          <TouchableOpacity style={{
            backgroundColor: Colors.picking,
            flexDirection: 'column',
            shadowColor: Colors.borderColor,
            borderRadius: deviceWidth * 0.4,
            width: deviceWidth * 0.4,
            height: deviceHeight * 0.2,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
          }}
            onPress={() => navigation.dispatch(
              navigation.replace('Splashs', { data: 'MD' }))}
          >
            <Text style={{
              color: Colors.fontColor2,
              alignSelf: 'center',
              fontSize: FontSize.large,
              fontWeight: 'bold'
            }}>Picking</Text>
          </TouchableOpacity>

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
        )
        }
      </>
    ) : (
      <>


        <View style={tabbar}>
          <View style={{ flexDirection: 'row' }}>
            <Text
              style={{

                fontSize: FontSize.medium,
                fontWeight: 'bold',
                color: Colors.fontColor,
              }}> {`ระบบการจัดการคลังสินค้า`}</Text>
          </View>
          <View>
            <TouchableOpacity
              style={{

                paddingRight: 10,
                alignItems: 'center'
              }}
              onPress={() => logOut()}>
              <FontAwesomeIcon name="power-off" size={FontSize.medium * 2} color={'red'} />
            </TouchableOpacity>
          </View>

        </View>

        <View style={container2}>


          <TouchableOpacity style={{
            margin: 10,
            backgroundColor: Colors.putAway,
            flexDirection: 'column',
            shadowColor: Colors.borderColor,
            borderRadius: FontSize.large,
            width: deviceWidth * 0.8,
            height: FontSize.large * 4,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1
          }}
            onPress={() => navigation.dispatch(
              navigation.replace('Splashs', { data: 'MAJ' }))}
          >
            <Text style={{
              color: Colors.fontColor2,
              alignSelf: 'center',
              fontSize: FontSize.large,
              fontWeight: 'bold'
            }}>Put-away</Text>
          </TouchableOpacity>




          <TouchableOpacity style={{
            margin: 10,
            backgroundColor: Colors.picking,
            flexDirection: 'column',
            shadowColor: Colors.borderColor,
            borderRadius: FontSize.large,
            width: deviceWidth * 0.8,
            height: FontSize.large * 4,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
          }}
            onPress={() => navigation.dispatch(
              navigation.replace('Splashs', { data: 'MD' }))}
          >
            <Text style={{
              color: Colors.fontColor2,
              alignSelf: 'center',
              fontSize: FontSize.large,
              fontWeight: 'bold'
            }}>Picking</Text>
          </TouchableOpacity>

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
        )
        }
      </>
    )

  );
};

const styles = StyleSheet.create({
  container1: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',

    backgroundColor: Colors.backgroundColor
  },
  image: {
    flex: 1,
    justifyContent: "center"
  },
  container2: {
    width: deviceWidth,
    height: deviceHeight - (FontSize.medium * 3),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    flex: 1,
  },
  tabbar: {
    height: FontSize.medium * 3,
    paddingLeft: 20,
    alignItems: 'center',
    backgroundColor: Colors.darkPrimiryColor,
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
    height: deviceHeight / 2.6,
    width: deviceWidth,
  },
  button: {
    marginTop: 10,
    marginBottom: 25,
    padding: 5,
    alignItems: 'center',
    backgroundColor: Colors.buttonColorPrimary,
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
    borderBottomColor: Colors.fontColor,
    color: Colors.fontColor,

  },
  label: {
    margin: 8,
    color: Colors.fontColor,
  },
});


export default Mains;
