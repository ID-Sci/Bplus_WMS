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



import { Language, changeLanguage } from '../../translations/I18n';
import { FontSize } from '../../components/FontSizeHelper';


import * as loginActions from '../../src/actions/loginActions';
import * as registerActions from '../../src/actions/registerActions';
import * as databaseActions from '../../src/actions/databaseActions';

import Colors from '../../src/Colors';
import { borderColor, fontSize, fontWeight } from 'styled-system';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const NextDelivery = ({ route }) => {

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
    const [paramData, setparamData] = useState({});

    useEffect(() => {
        if (route.params.data)
            setparamData(route.params.data)
        console.log(paramData)
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
                            color: Colors.fontColor2,
                        }}> {route.params.name && (`${route.params.name}`)}</Text>
                </View>
                <View>

                </View>
            </View>
            <SafeAreaView style={{
                flex: 1,
                backgroundColor: Colors.backgroundColor
            }}>
                <ScrollView>
                    < View style={container1} >
                        <View width={deviceWidth / 2} style={{
                            marginTop: 20,
                            alignSelf: 'center',
                            justifyContent: 'center',
                            alignContent: 'center',
                            backgroundColor: Colors.buttonTextColor
                        }}>
                            <View style={{

                                justifyContent: 'space-between',
                                flexDirection: 'row',

                            }}>
                                <View width={deviceWidth / 6} >
                                    <View style={{ padding: 10, }}>
                                        <Text style={styles.textTitle1}>
                                            ตำแหน่งเก็บ :
                                        </Text>
                                    </View>
                                </ View>
                                < View width={deviceWidth / 3}>
                                    <View style={{}}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <TextInput
                                                width={deviceWidth / 3.5}
                                                style={{
                                                    borderBottomColor: Colors.picking,
                                                    color: Colors.fontColor,
                                                    fontSize: FontSize.medium,
                                                    borderBottomWidth: 1,
                                                }}
                                                placeholderTextColor={Colors.picking}
                                                placeholder={'ตำแหน่งเก็บ ..'}
                                                value={''}
                                                onChangeText={(val) => {
                                                    console.log(val)
                                                }}></TextInput>
                                            <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.navigate('Scan', { route: 'Select' })}>
                                                <FontAwesome
                                                    name="qrcode"
                                                    size={FontSize.medium * 2}
                                                    color={Colors.picking}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View >
                            </View>
                            <View style={{

                                justifyContent: 'space-between',
                                flexDirection: 'row',

                            }}>
                                <View width={deviceWidth / 6} >
                                    <View style={{ padding: 10, }}>
                                        <Text style={styles.textTitle1}>
                                            รหัสสินค้า :
                                        </Text>
                                    </View>
                                </ View>
                                < View width={deviceWidth / 3}>
                                    <View style={{}}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <TextInput
                                                width={deviceWidth / 3.5}
                                                style={{
                                                    borderBottomColor: Colors.picking,
                                                    color: Colors.fontColor,
                                                    fontSize: FontSize.medium,
                                                    borderBottomWidth: 1,
                                                }}
                                                placeholderTextColor={Colors.picking}
                                                placeholder={'รหัสสินค้า ..'}
                                                value={''}
                                                onChangeText={(val) => {
                                                    console.log(val)
                                                }}></TextInput>
                                            <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.navigate('Scan', { route: 'Select' })}>
                                                <FontAwesome
                                                    name="qrcode"
                                                    size={FontSize.medium * 2}
                                                    color={Colors.picking}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View >
                            </View>
                            <View style={{
                                marginTop: 10,
                                justifyContent: 'space-between',
                                flexDirection: 'row',

                            }}>
                                <View width={deviceWidth / 6}>
                                    <View style={{ padding: 10, borderColor: Colors.textColorSecondary, borderWidth: 1, backgroundColor: Colors.pickingItem }}>
                                        <Text style={styles.textTitle1}>
                                            บล๊อค
                                        </Text>
                                    </View>
                                    <View style={{ padding: 10, borderColor: Colors.textColorSecondary, borderWidth: 1, backgroundColor: Colors.buttonTextColor }}>
                                        <Text style={styles.textTitle1}>
                                            xxx
                                        </Text>
                                    </View>
                                </ View>
                                < View width={deviceWidth / 6}>
                                    <View style={{ padding: 10, borderColor: Colors.textColorSecondary, borderWidth: 1, backgroundColor: Colors.pickingItem }}>
                                        <Text style={styles.textTitle1}>
                                            แถว
                                        </Text>
                                    </View>
                                    <View style={{ padding: 10, borderColor: Colors.textColorSecondary, borderWidth: 1, backgroundColor: Colors.buttonTextColor }}>
                                        <Text style={styles.textTitle1}>
                                            xxx
                                        </Text>
                                    </View>
                                </View >
                                < View width={deviceWidth / 6}>
                                    <View style={{ padding: 10, borderColor: Colors.textColorSecondary, borderWidth: 1, backgroundColor: Colors.pickingItem }}>
                                        <Text style={styles.textTitle1}>
                                            ชั้น
                                        </Text>
                                    </View>
                                    <View style={{ padding: 10, borderColor: Colors.textColorSecondary, borderWidth: 1, backgroundColor: Colors.buttonTextColor }}>
                                        <Text style={styles.textTitle1}>
                                            xxx
                                        </Text>
                                    </View>
                                </View >
                            </View>
                            <View style={{
                                paddingTop: 10,
                                justifyContent: 'space-between',
                                flexDirection: 'row', borderColor: Colors.textColorSecondary, borderWidth: 1, backgroundColor: Colors.picking,
                            }}>
                                <View width={deviceWidth / 6}>
                                    <View style={{ padding: 10, }}>
                                        <Text style={styles.textTitle2}>
                                            รหัสสินค้า :
                                        </Text>
                                    </View>
                                </ View>
                                < View width={deviceWidth / 3}>
                                    <View style={{ padding: 10, }}>
                                        <Text style={styles.textTitle2}>
                                            xxxxx
                                        </Text>
                                    </View>
                                </View >
                            </View>
                            <View style={{
                                paddingTop: 10,
                                justifyContent: 'space-between',
                                flexDirection: 'row', borderColor: Colors.textColorSecondary, borderWidth: 1, backgroundColor: Colors.picking,
                            }}>
                                <View width={deviceWidth / 6}>
                                    <View style={{ padding: 10, }}>
                                        <Text style={styles.textTitle2}>
                                            ชื่อสินค้า :
                                        </Text>
                                    </View>
                                </ View>
                                < View width={deviceWidth / 3}>
                                    <View style={{ padding: 10, }}>
                                        <Text style={styles.textTitle2}>
                                            xxxxxx
                                        </Text>
                                    </View>
                                </View >
                            </View>
                        </View>
                        <View style={{
                            marginTop: 20,
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                        }}>
                            <View width={deviceWidth / 4} >
                                <View style={{ padding: 10, borderColor: Colors.textColorSecondary, borderWidth: 1, backgroundColor: Colors.textColorSecondary }}>
                                    <Text style={styles.textTitle1}>
                                        หน่วย
                                    </Text>
                                </View>
                                <View style={{ padding: 10, borderColor: Colors.textColorSecondary, borderWidth: 1, backgroundColor: Colors.buttonTextColor }}>
                                    <Text style={styles.textTitle1}>
                                        xxxx
                                    </Text>
                                </View>
                            </ View>
                            < View width={deviceWidth / 4}>
                                <View style={{ padding: 10, borderColor: Colors.textColorSecondary, borderWidth: 1, backgroundColor: Colors.textColorSecondary }}>
                                    <Text style={styles.textTitle1}>
                                        จำนวน
                                    </Text>
                                </View>
                                <View style={{ padding: 10, borderColor: Colors.textColorSecondary, borderWidth: 1, backgroundColor: Colors.buttonTextColor }}>
                                    <Text style={styles.textTitle1}>
                                        xxxxx
                                    </Text>
                                </View>
                            </View >
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: 20,
                backgroundColor: Colors.backgroundColor
            }}>
                <TouchableOpacity
                    style={{
                        width: deviceWidth / 4,
                        height: deviceWidth / 12,
                        justifyContent: 'center',
                        margin: 10,
                        borderRadius: 20,
                        flexDirection: 'column',
                        padding: 10,
                        backgroundColor: Colors.buttonColorPrimary,
                    }}
                    onPress={() => navigation.dispatch(
                        navigation.replace('Splashs'))}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}>
                        <FontAwesome
                            name="caret-left"
                            size={FontSize.large * 1.5}
                            color={Colors.textColorSecondary}
                        />
                        <Text
                            style={{
                                color: Colors.textColorSecondary,
                                alignSelf: 'center',
                                fontSize: FontSize.large,
                                fontWeight: 'bold',
                            }}>
                            {'ย้อนกลับ'}
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        width: deviceWidth / 4,
                        height: deviceWidth / 12,
                        justifyContent: 'center',
                        margin: 10,
                        borderRadius: 20,
                        flexDirection: 'column',
                        padding: 10,
                        backgroundColor: Colors.picking,
                    }}
                    onPress={() => navigation.dispatch(
                        navigation.replace('SD_Info', { name: 'บันทึกรายละเอียดงานส่งมอบ', data: {} })
                    )}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}>
                        <Text
                            style={{
                                color: Colors.textColorSecondary,
                                alignSelf: 'center',
                                fontSize: FontSize.large,
                                fontWeight: 'bold',
                            }}>
                            {'รับงาน'}
                        </Text>
                        <FontAwesome
                            name="caret-right"
                            size={FontSize.large * 1.5}
                            color={Colors.textColorSecondary}
                        />
                    </View>
                </TouchableOpacity>
            </View>
            {loading && (
                <View style={{
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
    );
};

const styles = StyleSheet.create({
    container1: {
        backgroundColor: '#fff',
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
        backgroundColor: Colors.picking,
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    textTitle1: {
        fontSize: FontSize.medium,
        fontWeight: 'bold',
        color: Colors.fontColor,
    },
    textTitle2: {
        fontSize: FontSize.medium,
        fontWeight: 'bold',
        color: Colors.buttonTextColor,
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
        backgroundColor: Colors.textColorSecondary,
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

export default NextDelivery;