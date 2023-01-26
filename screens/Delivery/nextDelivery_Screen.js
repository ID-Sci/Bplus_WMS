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

import * as dataActions from '../../src/actions/dataActions';

import Colors from '../../src/Colors';
import { color, colorStyle, fontSize, fontWeight, padding } from 'styled-system';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const nextDelivery = ({ route }) => {

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

    const [WS_TAG, setWS_TAG] = useState('');
    const [SKU_CODE, setSKU_CODE] = useState('');

    useEffect(() => {
        if (route.params.code) {
            console.log(`----------------------------------------------------------------`)
            console.log(`code > ${route.params.code}`)
            console.log(`key > ${route.params.key}`)
            console.log(`WS_TAG > ${route.params.WS_TAG}`)
            console.log(`SKU_CODE > ${route.params.SKU_CODE}`)
            console.log(`----------------------------------------------------------------`)
            setWS_TAG(route.params.WS_TAG)
            setSKU_CODE(route.params.SKU_CODE)
            if (route.params.key == 'WS_TAG')
                _C_WS_TAG(route.params.WS_TAG)
            else if (route.params.key == 'SKU_CODE')
                _C_SKU_CODE(route.params.SKU_CODE)
        }
        console.log(paramData)
        //backsakura013
    }, [route.params?.code]);
    useEffect(() => {
        if (route.params.data)
            setparamData(route.params.data)
        console.log(paramData)
    }, [route.params?.data]);
    useEffect(() => {
        console.log(paramData)
        //backsakura013
    }, [paramData]);
    useEffect(() => {
        console.log('>> machineNum :', registerReducer.machineNum + '\n\n\n\n')
    }, [registerReducer.machineNum]);

    const closeLoading = () => {
        setLoading(false);
    };
    const letsLoading = () => {
        setLoading(true);
    };

    const _C_WS_TAG = (WS_TAG) => {
        if (paramData.WS_TAG == WS_TAG)
            Alert.alert(
                Language.t('notiAlert.header'),
                'รหัสพาเล็ทถูกต้อง', [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        else Alert.alert(
            Language.t('notiAlert.header'),
            'รหัสพาเล็ทไม่ถูกต้อง', [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
    }

    const _C_SKU_CODE = (SKU_CODE) => {
        console.log(`${paramData.SKU_CODE} == ${SKU_CODE}`)
        if (paramData.SKU_CODE == SKU_CODE)
            Alert.alert(
                Language.t('notiAlert.header'),
                'รหัสสินค้าถูกต้อง', [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        else Alert.alert(
            Language.t('notiAlert.header'),
            'รหัสสินค้าไม่ถูกต้อง', [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
    }
    const _STARTPICKING = async () => {
        // letsLoading()
        let objItem = {
            name: 'SD_Info',
            data: paramData
        }
        await dispatch(dataActions.setNextJOB(objItem))

        await navigation.dispatch(
            navigation.replace('SD_Info', { name: 'อ่านรายละเอียดงานจัดส่ง', data: paramData })
        )

        // navigation.dispatch(
        //     navigation.replace('SAJ_Info', { name: 'บันทึกรายละเอียดงานจัดเก็บ', data: paramData })
        // )

        // await fetch(databaseReducer.Data.urlser + '/PickAndPack', {
        //     method: 'POST',
        //     body: JSON.stringify({
        //         'BPAPUS-BPAPSV': loginReducer.serviceID,
        //         'BPAPUS-LOGIN-GUID': loginReducer.guid,
        //         'BPAPUS-FUNCTION': 'STARTPICKING',
        //         'BPAPUS-PARAM':
        //             '{"FORK_CODE": "' +
        //             databaseReducer.Data.ForkCode +
        //             '","WS_TAG": "' +
        //             paramData.WS_TAG +
        //             '","WS_KEY": "' +
        //             paramData.WS_KEY +
        //             '","WS_PICKER": "' +
        //             loginReducer.userNameED +
        //             '"}',
        //         'BPAPUS-FILTER': '',
        //         'BPAPUS-ORDERBY': '',
        //         'BPAPUS-OFFSET': '0',
        //         'BPAPUS-FETCH': '0'
        //     }),
        // })
        //     .then((response) => response.json())
        //     .then(async (json) => {
        //         if (json && json.ResponseCode == '635') {
        //             Alert.alert(
        //                 Language.t('alert.errorTitle'),
        //                 Language.t('alert.errorDetail'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        //             console.log('NOT FOUND MEMBER');
        //         } else if (json && json.ResponseCode == '629') {
        //             Alert.alert(
        //                 Language.t('alert.errorTitle'),
        //                 'Function Parameter Required', [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        //         } else if (json && json.ResponseCode == '200') {
        //             let responseData = JSON.parse(json.ResponseData)
        //             console.log(responseData)
        //             let objItem = {
        //                 name: 'SD_Info',
        //                 data: paramData
        //             }
        //             await dispatch(dataActions.setNextJOB(objItem))
        //             Alert.alert(
        //                 Language.t('notiAlert.header'),
        //                 'รับงานสำเร็จ', [{
        //                     text: Language.t('alert.ok'), onPress: () =>
        //                         navigation.dispatch(
        //                             navigation.replace('SD_Info', { name: 'อ่านรายละเอียดงานจัดส่ง', data: paramData })
        //                         )
        //                 }]);
        //         } else {
        //             Alert.alert(
        //                 Language.t('alert.errorTitle'),
        //             );
        //         }
        //         closeLoading()
        //     })
        //     .catch((error) => {
        //         console.error('ERROR at _fetchGuidLogin' + error);
        //         closeLoading()
        //         if (databaseReducer.Data.urlser == '') {
        //             Alert.alert(
        //                 Language.t('alert.errorTitle'),
        //                 Language.t('selectBase.error'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        //         } else {
        //             Alert.alert(
        //                 Language.t('alert.errorTitle'),
        //                 Language.t('alert.internetError'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        //         }
        //     })
    }
    const _CANCELPICKING = async () => {
        letsLoading()
        await fetch(databaseReducer.Data.urlser + '/PickAndPack', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': loginReducer.serviceID,
                'BPAPUS-LOGIN-GUID': loginReducer.guid,
                'BPAPUS-FUNCTION': 'CANCELPICKING',
                'BPAPUS-PARAM':
                    '{"FORK_CODE": "' +
                    databaseReducer.Data.ForkCode +
                    '","WS_TAG": "' +
                    paramData.WS_TAG +
                    '","WS_KEY": "' +
                    paramData.WS_KEY +
                    '"}',
                'BPAPUS-FILTER': '',
                'BPAPUS-ORDERBY': '',
                'BPAPUS-OFFSET': '0',
                'BPAPUS-FETCH': '0'
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
                    await dispatch(dataActions.setNextJOB({}))

                    await navigation.dispatch(
                        navigation.replace('Splashs', { name: 'อ่านรายละเอียดงานจัดส่ง', data: 'MD' }))


                } else {
                    Alert.alert(
                        Language.t('alert.errorTitle'),
                    );
                }
                closeLoading()
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
    return (
        <>
            <StatusBar hidden={true} />
            <View style={tabbar}>
                <View style={{ flexDirection: 'row' }}>

                    <Text
                        style={{

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
                <ScrollView  >
                    < View style={container1} >
                        <View width={deviceWidth / 1.5} style={{
                            alignSelf: 'center',
                            justifyContent: 'center',
                            alignContent: 'center',
                            backgroundColor: Colors.buttonTextColor
                        }}>
                            <View style={{
                                paddingTop: 10,
                                justifyContent: 'space-between',
                                flexDirection: 'row',

                            }}>
                                <View width={deviceWidth / 6} >
                                    <View style={{ padding: 10, }}>
                                        <Text style={styles.textTitle1}>
                                            รหัสพาเล็ท :
                                        </Text>
                                    </View>
                                </ View>
                                < View width={deviceWidth / 2}>
                                    <View style={{}}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <TextInput
                                                width={deviceWidth / 2.5}
                                                style={{
                                                    borderBottomColor: Colors.picking,
                                                    color: Colors.darkPrimiryColor,
                                                    fontSize: FontSize.medium,
                                                    borderBottomWidth: 1,
                                                }}
                                                placeholderTextColor={Colors.picking}
                                                placeholder={'รหัสพาเล็ท ..'}
                                                value={WS_TAG}
                                                onFocus={() => setWS_TAG('')}

                                                onSubmitEditing={(val) => _C_WS_TAG(WS_TAG)}
                                                onChangeText={(val) => {
                                                    setWS_TAG(val)
                                                }}></TextInput>
                                            <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.navigate('ScanQR', { route: 'ND', key: 'WS_TAG', data: paramData, SKU_CODE: SKU_CODE, WS_TAG: WS_TAG })}>
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



                        </View>
                        <View style={{
                            paddingTop: 10,
                            paddingBottom: 10,
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
                            < View width={deviceWidth / 2}>
                                <View style={{ padding: 10, }}>
                                    <Text style={styles.textTitle2}>
                                        {paramData.SKU_NAME}
                                    </Text>
                                </View>
                            </View >
                        </View>
                        <View>
                            <View style={{

                                justifyContent: 'space-between',
                                flexDirection: 'row',
                            }}>
                                <View width={deviceWidth / 3} >
                                    <View style={{ padding: 10, borderColor: Colors.textColorSecondary, borderWidth: 1, backgroundColor: Colors.textColorSecondary }}>
                                        <Text style={styles.textTitle1}>
                                            รหัสอ้างอิง
                                        </Text>
                                    </View>
                                    <View style={{ padding: 10, borderColor: Colors.textColorSecondary, borderWidth: 1, backgroundColor: Colors.buttonTextColor }}>
                                        <Text style={styles.textTitle3}>
                                            {paramData.DI_REF}
                                        </Text>
                                    </View>
                                </ View>
                                < View width={deviceWidth / 3}>
                                    <View style={{ padding: 10, borderColor: Colors.textColorSecondary, borderWidth: 1, backgroundColor: Colors.textColorSecondary }}>
                                        <Text style={styles.textTitle1} >
                                            รหัสบาร์โค้ด
                                        </Text>
                                    </View>
                                    <View style={{ padding: 10, borderColor: Colors.textColorSecondary, borderWidth: 1, backgroundColor: Colors.buttonTextColor }}>
                                        <Text style={styles.textTitle3} >
                                            {paramData.SKU_BARCODE}
                                        </Text>
                                    </View>
                                </View >
                            </View>
                            <View style={{
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                            }}>
                                <View width={deviceWidth / 3} >
                                    <View style={{ padding: 10, borderColor: Colors.textColorSecondary, borderWidth: 1, backgroundColor: Colors.textColorSecondary }}>
                                        <Text style={styles.textTitle1}>
                                            จากรหัสตำแหน่งเก็บ
                                        </Text>
                                    </View>
                                    <View style={{ padding: 10, borderColor: Colors.textColorSecondary, borderWidth: 1, backgroundColor: Colors.buttonTextColor }}>
                                        <Text style={styles.textTitle3}>
                                            {paramData.FROM_WL_CODE}
                                        </Text>
                                    </View>
                                </ View>
                                < View width={deviceWidth / 3}>
                                    <View style={{ padding: 10, borderColor: Colors.textColorSecondary, borderWidth: 1, backgroundColor: Colors.textColorSecondary }}>
                                        <Text style={styles.textTitle1}>
                                            จากตำแหน่งเก็บ
                                        </Text>
                                    </View>
                                    <View style={{ padding: 10, borderColor: Colors.textColorSecondary, borderWidth: 1, backgroundColor: Colors.buttonTextColor }}>
                                        <Text style={styles.textTitle3}>
                                            {paramData.FROMWL_NAME}
                                        </Text>
                                    </View>
                                </View >
                            </View>
                            <View style={{
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                            }}>
                                <View width={deviceWidth / 3} >
                                    <View style={{ padding: 10, borderColor: Colors.textColorSecondary, borderWidth: 1, backgroundColor: Colors.textColorSecondary }}>
                                        <Text style={styles.textTitle1}>
                                            ไปรหัสตำแหน่งเก็บ
                                        </Text>
                                    </View>
                                    <View style={{ padding: 10, borderColor: Colors.textColorSecondary, borderWidth: 1, backgroundColor: Colors.buttonTextColor }}>
                                        <Text style={styles.textTitle3}>
                                            {paramData.TOWL_CODE}
                                        </Text>
                                    </View>
                                </ View>
                                < View width={deviceWidth / 3}>
                                    <View style={{ padding: 10, borderColor: Colors.textColorSecondary, borderWidth: 1, backgroundColor: Colors.textColorSecondary }}>
                                        <Text style={styles.textTitle1}>
                                            ไปตำแหน่งเก็บ
                                        </Text>
                                    </View>
                                    <View style={{ padding: 10, borderColor: Colors.textColorSecondary, borderWidth: 1, backgroundColor: Colors.buttonTextColor }}>
                                        <Text style={styles.textTitle3}>
                                            {paramData.TO_WL_NAME}
                                        </Text>
                                    </View>
                                </View >
                            </View>
                            <View style={{
                                paddingTop: 10,
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                            }}>
                                <View width={deviceWidth / 6} >
                                    <View style={{ padding: 10, borderColor: Colors.textColorSecondary, borderWidth: 1, backgroundColor: Colors.picking }}>
                                        <Text style={styles.textTitle2}>
                                            กลุ่ม
                                        </Text>
                                    </View>
                                    <View style={{ padding: 10, borderColor: Colors.textColorSecondary, borderWidth: 1, backgroundColor: Colors.buttonTextColor }}>
                                        <Text style={styles.textTitle3}>
                                            {paramData.WL_BLOCK}
                                        </Text>
                                    </View>
                                </ View>
                                < View width={deviceWidth / 6}>
                                    <View style={{ padding: 10, borderColor: Colors.textColorSecondary, borderWidth: 1, backgroundColor: Colors.picking }}>
                                        <Text style={styles.textTitle2}>
                                            แถว
                                        </Text>
                                    </View>
                                    <View style={{ padding: 10, borderColor: Colors.textColorSecondary, borderWidth: 1, backgroundColor: Colors.buttonTextColor }}>
                                        <Text style={styles.textTitle3}>
                                            {paramData.WL_ROW}
                                        </Text>
                                    </View>
                                </View >

                                <View width={deviceWidth / 6} >
                                    <View style={{ padding: 10, borderColor: Colors.textColorSecondary, borderWidth: 1, backgroundColor: Colors.picking }}>
                                        <Text style={styles.textTitle2}>
                                            ชั้น
                                        </Text>
                                    </View>
                                    <View style={{ padding: 10, borderColor: Colors.textColorSecondary, borderWidth: 1, backgroundColor: Colors.buttonTextColor }}>
                                        <Text style={styles.textTitle3}>
                                            {paramData.WL_LEVEL}
                                        </Text>
                                    </View>
                                </ View>
                                < View width={deviceWidth / 6}>
                                    <View style={{ padding: 10, borderColor: Colors.textColorSecondary, borderWidth: 1, backgroundColor: Colors.picking }}>
                                        <Text style={styles.textTitle2}>
                                            ช่อง
                                        </Text>
                                    </View>
                                    <View style={{ padding: 10, borderColor: Colors.textColorSecondary, borderWidth: 1, backgroundColor: Colors.buttonTextColor }}>
                                        <Text style={styles.textTitle3}>
                                            {paramData.WL_COLUMN}
                                        </Text>
                                    </View>
                                </View >
                            </View>
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
                    onPress={() => _CANCELPICKING()}>
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
                        backgroundColor: paramData.WS_TAG == WS_TAG ? Colors.picking : Colors.textColorSecondary,
                    }}
                    onPress={() => paramData.WS_TAG == WS_TAG ? _STARTPICKING() : console.log()}>
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

            {
                loading && (
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
    );
};

const styles = StyleSheet.create({
    container1: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',

        padding: 20
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
        height: FontSize.medium * 3,
        padding: 12,
        paddingLeft: 20,
        alignItems: 'center',
        backgroundColor: Colors.picking,
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    textTitle: {
        fontSize: FontSize.medium,
        fontWeight: 'bold',
        color: Colors.fontColor,
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
    textTitle3: {
        fontSize: FontSize.medium,
        fontWeight: 'bold',
        color: Colors.picking,
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


export default nextDelivery
