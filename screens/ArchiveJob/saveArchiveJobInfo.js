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
    Modal,
    Pressable,
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



import { Language, changeLanguage } from '../../translations/I18n';
import { FontSize } from '../../components/FontSizeHelper';


import * as loginActions from '../../src/actions/loginActions';
import * as registerActions from '../../src/actions/registerActions';
import * as databaseActions from '../../src/actions/databaseActions';

import Colors from '../../src/Colors';
import { fontSize, fontWeight } from 'styled-system';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const saveArchiveJobInfo = ({ route }) => {

    const dispatch = useDispatch();
    const navigation = useNavigation();

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



    const [GUID, setGUID] = useStateIfMounted('');

    const [isSelected, setSelection] = useState(loginReducer.userloggedIn == true ? loginReducer.userloggedIn : false);
    const [isSFeatures, setSFeatures] = useState(loginReducer.isSFeatures == true ? loginReducer.isSFeatures : false);

    const [loading, setLoading] = useStateIfMounted(false);
    const [loading_backG, setLoading_backG] = useStateIfMounted(true);

    const [resultJson, setResultJson] = useState([]);
    const [marker, setMarker] = useState(false);
    const [username, setUsername] = useState(loginReducer.userloggedIn == true ? loginReducer.userNameED : '');
    const [password, setPassword] = useState(loginReducer.userloggedIn == true ? loginReducer.passwordED : '');

    const [pageData, setPagedata] = useState({});
    const [data, setData] = useStateIfMounted({
        secureTextEntry: true,
    });

    const [modalVisible, setModalVisible] = useState(false);
    useEffect(() => {

        //backsakura013
    }, [route.params?.data]);
    useEffect(() => {
        console.log('>> machineNum :', registerReducer.machineNum + '\n\n\n\n')
    }, [registerReducer.machineNum]);

    const closeLoading = () => {
        setLoading(false);
    };
    const letsLoading = () => {
        setLoading(true);
    };

    const logOut = async () => {
        setLoading(true)
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
                setLoading(false)
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

                    navigation.dispatch(
                        navigation.replace('LoginScreen')
                    )
                } else {
                    Alert.alert(
                        Language.t('alert.errorTitle'),
                    );
                }
            })
            .catch((error) => {
                console.error('ERROR at _fetchGuidLogin' + error);
                setLoading(false)
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

    };

    return (
        <>
            <StatusBar hidden={true} />

            <View style={tabbar}>
                <View style={{ flexDirection: 'row' }}>

                    <Text
                        style={{
                            marginLeft: 12,
                            fontSize: FontSize.medium,
                            fontWeight: 'bold',
                            color: Colors.backgroundLoginColorSecondary,
                        }}> {route.params.name && (`${route.params.name}`)}</Text>
                </View>
                <View>

                </View>

            </View>

            <SafeAreaView style={{
                flex: 1,
            }}>

                <ScrollView  >

                    <View style={container1}>


                        <View style={{ marginTop: 20 }}>
                            <View width={deviceWidth / 2} style={{
                                alignSelf: 'center',
                                justifyContent: 'center',
                                alignContent: 'center',
                            }}>
                                < >
                                    <View style={{ marginTop: 10 }}>
                                        <Text style={styles.textTitle}>
                                            ตำแหน่งเก็บ :
                                        </Text>
                                    </View>
                                    <View style={{ marginTop: 10 }}>
                                        <View
                                            style={{
                                                backgroundColor: Colors.backgroundColorSecondary,
                                                flexDirection: 'column',
                                                borderWidth: 1,
                                                borderColor: 'red',
                                                borderRadius: 10,
                                                paddingLeft: 20,
                                                paddingRight: 20,
                                                paddingTop: 10,
                                                paddingBottom: 10,
                                            }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <TextInput
                                                    style={{
                                                        flex: 8,
                                                        marginLeft: 10,
                                                        borderBottomColor: 'red',
                                                        color: Colors.fontColor,
                                                        paddingVertical: 3,
                                                        fontSize: FontSize.medium * 1.2,
                                                        borderBottomWidth: 0.7,
                                                    }}
                                                    placeholderTextColor={Colors.fontColorSecondary}
                                                    placeholder={'ตำแหน่งเก็บ ..'}
                                                    value={''}
                                                    onChangeText={(val) => {
                                                        console.log(val)
                                                    }}></TextInput>


                                            </View>
                                        </View>
                                    </View>
                                </ >
                                < >
                                    <View style={{ marginTop: 10 }}>
                                        <Text style={styles.textTitle}>
                                            อ่านตำแหน่งเก็บ :
                                        </Text>
                                    </View>
                                    <View style={{ marginTop: 10 }}>
                                        <View
                                            style={{
                                                backgroundColor: Colors.backgroundColorSecondary,
                                                flexDirection: 'column',
                                                borderWidth: 1,
                                                borderColor: 'red',
                                                borderRadius: 10,
                                                paddingLeft: 20,
                                                paddingRight: 20,
                                                paddingTop: 10,
                                                paddingBottom: 10,
                                            }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <TextInput
                                                    style={{
                                                        flex: 8,
                                                        marginLeft: 10,
                                                        borderBottomColor: 'red',
                                                        color: Colors.fontColor,
                                                        paddingVertical: 3,
                                                        fontSize: FontSize.medium * 1.2,
                                                        borderBottomWidth: 0.7,
                                                    }}
                                                    placeholderTextColor={Colors.fontColorSecondary}
                                                    placeholder={'อ่านตำแหน่งเก็บ ..'}
                                                    value={''}
                                                    onChangeText={(val) => {
                                                        console.log(val)
                                                    }}></TextInput>
                                                <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.navigate('ScanScreen', { route: 'SelectScreen' })}>
                                                    <FontAwesome
                                                        name="qrcode"
                                                        size={FontSize.medium * 2}
                                                        color={'red'}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </ >
                            </ View>
                            <View style={{ width: deviceWidth, marginTop: 20, marginBottom: 20, }}>
                                <View style={{ backgroundColor: '#F09D35', padding: 20, alignItems: 'center' }}>
                                    <Text style={{ fontSize: FontSize.medium*1.5, color: 'black', }}>
                                        ชื่อสินค้า
                                    </Text>
                                </View>
                            </View>
                            <View width={deviceWidth / 2} style={{
                                alignSelf: 'center',
                                justifyContent: 'center',
                                alignContent: 'center',
                            }}>
                                <View style={{
                                    justifyContent: 'space-between',
                                    flexDirection: 'row',
                                }}>
                                    <View width={deviceWidth / 4.2}>
                                        <View style={{ marginTop: 10 }}>
                                            <Text style={styles.textTitle}>
                                                รหัสบาร์โค้ด :
                                            </Text>
                                        </View>
                                        <View style={{ marginTop: 10 }}>
                                            <View
                                                style={{
                                                    backgroundColor: Colors.backgroundColorSecondary,
                                                    flexDirection: 'column',
                                                    borderWidth: 1,
                                                    borderColor: Colors.buttonColorPrimary,
                                                    borderRadius: 10,
                                                    paddingLeft: 20,
                                                    paddingRight: 20,
                                                    paddingTop: 10,
                                                    paddingBottom: 10,
                                                }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <TextInput
                                                        style={{
                                                            flex: 8,
                                                            marginLeft: 10,
                                                            borderBottomColor: Colors.buttonColorPrimary,
                                                            color: Colors.fontColor,
                                                            paddingVertical: 3,
                                                            fontSize: FontSize.medium * 1.2,
                                                            borderBottomWidth: 0.7,
                                                        }}
                                                        placeholderTextColor={Colors.fontColorSecondary}
                                                        placeholder={'รหัสบาร์โค้ด ..'}
                                                        value={''}
                                                        onChangeText={(val) => {
                                                            console.log(val)
                                                        }}></TextInput>

                                                </View>
                                            </View>
                                        </View>
                                    </View >
                                    <View width={deviceWidth / 4.2}>
                                        <View style={{ marginTop: 10 }}>
                                            <Text style={styles.textTitle}>
                                                จำนวนชิ้น :
                                            </Text>
                                        </View>
                                        <View style={{ marginTop: 10 }}>
                                            <View
                                                style={{
                                                    backgroundColor: Colors.backgroundColorSecondary,
                                                    flexDirection: 'column',
                                                    borderWidth: 1,
                                                    borderColor: Colors.buttonColorPrimary,
                                                    borderRadius: 10,
                                                    paddingLeft: 20,
                                                    paddingRight: 20,
                                                    paddingTop: 10,
                                                    paddingBottom: 10,
                                                }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <TextInput
                                                        style={{
                                                            flex: 8,
                                                            marginLeft: 10,
                                                            borderBottomColor: Colors.buttonColorPrimary,
                                                            color: Colors.fontColor,
                                                            paddingVertical: 3,
                                                            fontSize: FontSize.medium * 1.2,
                                                            borderBottomWidth: 0.7,
                                                        }}
                                                        placeholderTextColor={Colors.fontColorSecondary}
                                                        placeholder={'จำนวนชิ้น ..'}
                                                        value={''}
                                                        onChangeText={(val) => {
                                                            console.log(val)
                                                        }}></TextInput>

                                                </View>
                                            </View>
                                        </View>

                                    </ View>
                                </View>

                                <View style={{
                                    justifyContent: 'space-between',
                                    flexDirection: 'row',
                                }}>
                                    <View width={deviceWidth / 4.2}>
                                        <View style={{ marginTop: 10 }}>
                                            <Text style={styles.textTitle}>
                                                บล๊อกที่จัดเก็บ :
                                            </Text>
                                        </View>
                                        <View style={{ marginTop: 10 }}>
                                            <View
                                                style={{
                                                    backgroundColor: Colors.backgroundColorSecondary,
                                                    flexDirection: 'column',
                                                    borderWidth: 1,
                                                    borderColor: Colors.buttonColorPrimary,
                                                    borderRadius: 10,
                                                    paddingLeft: 20,
                                                    paddingRight: 20,
                                                    paddingTop: 10,
                                                    paddingBottom: 10,
                                                }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <TextInput
                                                        style={{
                                                            flex: 8,
                                                            marginLeft: 10,
                                                            borderBottomColor: Colors.buttonColorPrimary,
                                                            color: Colors.fontColor,
                                                            paddingVertical: 3,
                                                            fontSize: FontSize.medium * 1.2,
                                                            borderBottomWidth: 0.7,
                                                        }}
                                                        placeholderTextColor={Colors.fontColorSecondary}
                                                        placeholder={'บล๊อกที่จัดเก็บ ..'}
                                                        value={''}
                                                        onChangeText={(val) => {
                                                            console.log(val)
                                                        }}></TextInput>

                                                </View>
                                            </View>
                                        </View>
                                    </ View>

                                    <View width={deviceWidth / 4.2}>
                                        <View style={{ marginTop: 10 }}>
                                            <Text style={styles.textTitle}>
                                                แถวที่จัดเก็บ :
                                            </Text>
                                        </View>
                                        <View style={{ marginTop: 10 }}>
                                            <View
                                                style={{
                                                    backgroundColor: Colors.backgroundColorSecondary,
                                                    flexDirection: 'column',
                                                    borderWidth: 1,
                                                    borderColor: Colors.buttonColorPrimary,
                                                    borderRadius: 10,
                                                    paddingLeft: 20,
                                                    paddingRight: 20,
                                                    paddingTop: 10,
                                                    paddingBottom: 10,
                                                }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <TextInput
                                                        style={{
                                                            flex: 8,
                                                            marginLeft: 10,
                                                            borderBottomColor: Colors.buttonColorPrimary,
                                                            color: Colors.fontColor,
                                                            paddingVertical: 3,
                                                            fontSize: FontSize.medium * 1.2,
                                                            borderBottomWidth: 0.7,
                                                        }}
                                                        placeholderTextColor={Colors.fontColorSecondary}
                                                        placeholder={'แถวที่จัดเก็บ ..'}
                                                        value={''}
                                                        onChangeText={(val) => {
                                                            console.log(val)
                                                        }}></TextInput>

                                                </View>
                                            </View>
                                        </View>
                                    </View >
                                </View>
                                <View style={{
                                    justifyContent: 'space-between',
                                    flexDirection: 'row',
                                }}>
                                    <View width={deviceWidth / 4.2}>
                                        <View style={{ marginTop: 10 }}>
                                            <Text style={styles.textTitle}>
                                                ชั้นที่จัดเก็บ :
                                            </Text>
                                        </View>
                                        <View style={{ marginTop: 10 }}>
                                            <View
                                                style={{
                                                    backgroundColor: Colors.backgroundColorSecondary,
                                                    flexDirection: 'column',
                                                    borderWidth: 1,
                                                    borderColor: Colors.buttonColorPrimary,
                                                    borderRadius: 10,
                                                    paddingLeft: 20,
                                                    paddingRight: 20,
                                                    paddingTop: 10,
                                                    paddingBottom: 10,
                                                }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <TextInput
                                                        style={{
                                                            flex: 8,
                                                            marginLeft: 10,
                                                            borderBottomColor: Colors.buttonColorPrimary,
                                                            color: Colors.fontColor,
                                                            paddingVertical: 3,
                                                            fontSize: FontSize.medium * 1.2,
                                                            borderBottomWidth: 0.7,
                                                        }}
                                                        placeholderTextColor={Colors.fontColorSecondary}
                                                        placeholder={'ชั้นที่จัดเก็บ ..'}
                                                        value={''}
                                                        onChangeText={(val) => {
                                                            console.log(val)
                                                        }}></TextInput>

                                                </View>
                                            </View>
                                        </View>
                                    </ View>

                                    <View width={deviceWidth / 4.2}>


                                    </ View>
                                </View>
                            </View>
                        </View>


                        <View style={styles.centeredView}>
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={modalVisible}
                                onRequestClose={() => {
                                    setModalVisible(!modalVisible);
                                }}>
                                < TouchableOpacity
                                    onPress={() => setModalVisible(!modalVisible)}
                                    style={styles.centeredView}>
                                    <View>
                                        <View style={styles.modalView}>
                                            <View style={{
                                                justifyContent: 'space-between',
                                                flexDirection: 'row'
                                            }}>
                                                <View width={20}></View>
                                                <Text style={{ fontSize: FontSize.large, color: Colors.fontColor2 }}>จัดเก็บไม่ได้</Text>
                                                <Pressable style={{ alignItems: 'flex-end' }} onPress={() => setModalVisible(!modalVisible)}>
                                                    <FontAwesome name="close" color={Colors.fontColor2} size={FontSize.large} />
                                                </Pressable>
                                            </View>
                                            <View style={{ backgroundColor: Colors.fontColor2, borderRadius: 20, padding: 20 }}>
                                                <View style={styles.checkboxContainer} >
                                                    <View></View>
                                                    <CheckBox
                                                        value={isSelected}
                                                        onValueChange={(value) => setSelection(value)}

                                                        tintColors={{ true: Colors.fontColor, false: Colors.fontColor }}
                                                        style={styles.checkbox}
                                                    />
                                                    <Text style={styles.label} onPress={() => setSelection(!isSelected)}>ที่เก็บไม่ว่าง</Text>
                                                </View>

                                                <View style={styles.checkboxContainer} >
                                                    <View></View>
                                                    <CheckBox
                                                        value={isSelected}
                                                        onValueChange={(value) => setSelection(value)}

                                                        tintColors={{ true: Colors.fontColor, false: Colors.fontColor }}
                                                        style={styles.checkbox}
                                                    />
                                                    <Text style={styles.label} onPress={() => setSelection(!isSelected)}>ที่เก็บชำรุด</Text>
                                                </View>

                                                <View style={styles.checkboxContainer} >
                                                    <View></View>
                                                    <CheckBox
                                                        value={isSelected}
                                                        onValueChange={(value) => setSelection(value)}

                                                        tintColors={{ true: Colors.fontColor, false: Colors.fontColor }}
                                                        style={styles.checkbox}
                                                    />
                                                    <Text style={styles.label} onPress={() => setSelection(!isSelected)}>ขนาดไม่พอดี</Text>
                                                </View>

                                                <View style={styles.checkboxContainer} >
                                                    <View></View>
                                                    <CheckBox
                                                        value={isSelected}
                                                        onValueChange={(value) => setSelection(value)}

                                                        tintColors={{ true: Colors.fontColor, false: Colors.fontColor }}
                                                        style={styles.checkbox}
                                                    />
                                                    <Text style={styles.label} onPress={() => setSelection(!isSelected)}>อื่นๆ</Text>
                                                </View>
                                                <TouchableNativeFeedback

                                                    onPress={() => setModalVisible(!modalVisible)}>
                                                    <View
                                                        style={{
                                                            width: deviceWidth / 4.2,
                                                            margin: 10,
                                                            borderRadius: 20,
                                                            flexDirection: 'column',
                                                            alignSelf: 'center',
                                                            padding: 10,
                                                            backgroundColor: 'red',
                                                        }}>
                                                        <Text
                                                            style={{
                                                                color: Colors.buttonTextColor,
                                                                alignSelf: 'center',
                                                                fontSize: FontSize.medium,
                                                                fontWeight: 'bold',
                                                            }}>
                                                            {'ตกลง'}
                                                        </Text>
                                                    </View>
                                                </TouchableNativeFeedback>
                                            </View>

                                        </View>

                                    </View>

                                </TouchableOpacity>

                            </Modal>
                        </View>




                    </View>
                </ScrollView>
            </SafeAreaView>


            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20,

            }}>
                <TouchableNativeFeedback
                    onPress={() => navigation.navigate('MainScreen', { name: 'อ่านรายละเอียดงานจัดเก็บ', data: {} })}>
                    <View
                        style={{
                            width: deviceWidth / 4,
                            height: deviceWidth / 12,
                            justifyContent: 'center',
                            margin: 10,
                            borderRadius: 20,
                            flexDirection: 'column',
                            padding: 10,
                            backgroundColor: Colors.buttonColorPrimary,
                        }}>
                        <Text
                            style={{
                                color: Colors.buttonTextColor,
                                alignSelf: 'center',
                                fontSize: FontSize.medium*1.5,
                                fontWeight: 'bold',
                            }}>
                            {'จัดเก็บได้'}
                        </Text>
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback

                    onPress={() => setModalVisible(!modalVisible)}>
                    <View
                        style={{
                            width: deviceWidth / 4,
                            height: deviceWidth / 12,
                            justifyContent: 'center',
                            margin: 10,
                            borderRadius: 20,
                            flexDirection: 'column',
                            padding: 10,
                            backgroundColor: 'red',
                        }}>
                        <Text
                            style={{
                                color: Colors.buttonTextColor,
                                alignSelf: 'center',
                                fontSize: FontSize.medium*1.5,
                                fontWeight: 'bold',
                            }}>
                            {'เก็บไม่ได้'}
                        </Text>
                    </View>
                </TouchableNativeFeedback>


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
                        color={Colors.lightPrimiryColor}
                    />
                </View>
            )}

            {modalVisible && (
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

                </View>
            )}

        </>
    );
};

const styles = StyleSheet.create({
    container1: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
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
        height: 70,
        padding: 12,
        paddingLeft: 20,
        alignItems: 'center',
        backgroundColor: Colors.backgroundLoginColor,

        justifyContent: 'space-between',
        flexDirection: 'row',
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

    },
    checkbox: {
        fontSize: FontSize.medium,
        alignSelf: "center",
        borderBottomColor: Colors.fontColor,
        color: Colors.fontColor,

    },
    label: {
        margin: 8,
        fontSize: FontSize.medium,
        color: Colors.fontColor,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: deviceWidth,
    },
    modalView: {
        backgroundColor: 'red',
        borderRadius: 20,
        padding: 20,
        width: deviceWidth / 1.5,
        shadowColor: "#000",
    },
});


export default saveArchiveJobInfo;
