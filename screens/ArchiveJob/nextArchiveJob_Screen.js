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
import { color, fontSize, fontWeight, padding } from 'styled-system';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const NextArchiveJob = ({ route }) => {

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


    var qrcode = require('qrcode-terminal');
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
    const [paramPost, setparamPost] = useState('');
    const [tempPost, settempPost] = useState('');
    useEffect(() => {
        if (route.params.data)
            setparamData(route.params.data)
        console.log(paramData)

        //backsakura013
    }, [route.params?.data]);
    useEffect(() => {

        if (route.params.post || route.params.code) {
            setparamPost(route.params.post)
            _C_WS_TAG(route.params.post)
            settempPost(route.params.post)
            console.log(route.params.code)
        } else if (tempPost.length > 0) {
            setparamPost(tempPost)
            _C_WS_TAG(tempPost)
            console.log(route.params.code)
        }


    }, [route.params?.code && route.params.code]);
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
    };
    const _STARTSTORAGE = async () => {
        // letsLoading()
        let objItem = {
            name: 'SAJ_Info',
            data: paramData
        }
        await dispatch(dataActions.setNextJOB(objItem))
        await navigation.dispatch(
            navigation.replace('SAJ_Info', { name: 'บันทึกรายละเอียดงานจัดเก็บ', data: paramData })
        )
        // navigation.dispatch(
        //     navigation.replace('SAJ_Info', { name: 'บันทึกรายละเอียดงานจัดเก็บ', data: paramData })
        // )

        // await fetch(databaseReducer.Data.urlser + '/PickAndPack', {
        //     method: 'POST',
        //     body: JSON.stringify({
        //         'BPAPUS-BPAPSV': loginReducer.serviceID,
        //         'BPAPUS-LOGIN-GUID': loginReducer.guid,
        //         'BPAPUS-FUNCTION': 'STARTSTORAGE',
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
        //                 name: 'SAJ_Info',
        //                 data: paramData
        //             }
        //             await dispatch(dataActions.setNextJOB(objItem))
        //             Alert.alert(
        //                 Language.t('notiAlert.header'),
        //                 'รับงานสำเร็จ', [{
        //                     text: Language.t('alert.ok'), onPress: () =>
        //                         navigation.dispatch(
        //                             navigation.replace('SAJ_Info', { name: 'บันทึกรายละเอียดงานจัดเก็บ', data: paramData })
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
    const _CANCELSTORAGE = async () => {
        letsLoading()
        await fetch(databaseReducer.Data.urlser + '/PickAndPack', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': loginReducer.serviceID,
                'BPAPUS-LOGIN-GUID': loginReducer.guid,
                'BPAPUS-FUNCTION': 'CANCELSTORAGE',
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
                        navigation.replace('Splashs', { name: 'อ่านรายละเอียดงานจัดเก็บ', data: 'MAJ' }))


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
                        }}> {'Put-away'}</Text>
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
                        <View width={deviceWidth > 960 ? deviceWidth / 1.5 : deviceWidth}
                            style={{
                                alignSelf: 'center',
                                justifyContent: 'center',
                                alignContent: 'center',
                                backgroundColor: Colors.buttonTextColor
                            }}>
                            <View style={{
                                padding: 10,
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                                marginBottom: 5
                            }}>
                                <View
                                    style={{
                                        justifyContent: 'center',
                                        paddingRight: 5,
                                    }} >

                                    <Text style={styles.textTitle1}>
                                        รหัสพาเล็ท :
                                    </Text>

                                </ View>
                                < View width={deviceWidth > 960 ? deviceWidth / 2 : deviceWidth * 0.8}>
                                    <View style={{}}>
                                        <View style={{ flexDirection: 'row', }}>
                                            <TextInput
                                                width={deviceWidth > 960 ? deviceWidth / 2.5 : deviceWidth * 0.6}
                                                style={{
                                                    justifyContent: 'flex-end',
                                                    borderBottomColor: Colors.putAwayItem,
                                                    color: Colors.darkPrimiryColor,
                                                    fontSize: FontSize.medium,
                                                    borderBottomWidth: 1,

                                                }}
                                                placeholderTextColor={Colors.putAwayItem}
                                                placeholder={'รหัสพาเล็ท ..'}
                                                value={paramPost}
                                                onFocus={() => setparamPost('')}

                                                onSubmitEditing={(val) => _C_WS_TAG(val)}
                                                onChangeText={(val) => {
                                                    setparamPost(val)
                                                }}></TextInput>
                                            <TouchableOpacity style={{
                                                marginLeft: 10,
                                                justifyContent: 'center'
                                            }} onPress={() => navigation.navigate('ScanQR', { route: 'NAJ', key: 'WS_TAG', data: paramData, name: 'อ่านรายละเอียดงานจัดเก็บ' })}>
                                                <FontAwesome
                                                    name="qrcode"
                                                    size={FontSize.medium * 2}
                                                    color={Colors.putAwayItem}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View >
                            </View>

                            <View style={{
                                padding: 10,
                                justifyContent: 'space-between',
                                flexDirection: 'row', borderColor: Colors.textColorSecondary, borderWidth: 1, backgroundColor: Colors.putAwayItem,
                            }}>
                                <View style={{
                                    justifyContent: 'center',
                                    paddingRight: 5,
                                }} >
                                    <Text style={styles.textTitle2}>
                                        รหัสสินค้า :
                                    </Text>

                                </ View>
                                < View width={deviceWidth > 960 ? deviceWidth / 2 : deviceWidth * 0.7}>
                                    <View style={{ padding: 10, }}>
                                        <Text style={styles.textTitle2}>
                                            {paramData.SKU_CODE}
                                        </Text>
                                    </View>
                                </View >
                            </View>
                            <View style={{
                                padding: 10,
                                justifyContent: 'space-between',
                                flexDirection: 'row', borderColor: Colors.textColorSecondary, borderWidth: 1, backgroundColor: Colors.putAwayItem,
                            }}>
                                <View style={{
                                    justifyContent: 'center',
                                    paddingRight: 5,
                                }} >
                                    <Text style={styles.textTitle2}>
                                        ชื่อสินค้า :
                                    </Text>
                                </ View>
                                < View width={deviceWidth > 960 ? deviceWidth / 2 : deviceWidth * 0.7}>
                                    <View style={{ padding: 10, }}>
                                        <Text style={styles.textTitle2}>
                                            {paramData.SKU_NAME}
                                        </Text>
                                    </View>
                                </View >
                            </View>
                        </View>
                        <View>
                            <View style={{
                                width: deviceWidth > 960 ? deviceWidth / 1.5 : deviceWidth,
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                            }}>
                                <View width={deviceWidth > 960 ? deviceWidth / 3 : deviceWidth * 0.5} >
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
                                < View width={deviceWidth > 960 ? deviceWidth / 3 : deviceWidth * 0.5}>
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
                                <View width={deviceWidth > 960 ? deviceWidth / 3 : deviceWidth * 0.5} >
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
                                < View width={deviceWidth > 960 ? deviceWidth / 3 : deviceWidth * 0.5}>
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
                                paddingTop: 10,
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                            }}>
                                <View width={deviceWidth > 960 ? deviceWidth / 3 : deviceWidth * 0.5} >
                                    <View style={{ padding: 10, borderColor: Colors.textColorSecondary, borderWidth: 1, backgroundColor: Colors.putAway }}>
                                        <Text style={styles.textTitle2}>
                                            ไปรหัสตำแหน่งเก็บ
                                        </Text>
                                    </View>
                                    <View style={{ padding: 10, borderColor: Colors.textColorSecondary, borderWidth: 1, backgroundColor: Colors.buttonTextColor }}>
                                        <Text style={styles.textTitle3}>
                                            {paramData.TOWL_CODE}
                                        </Text>
                                    </View>
                                </ View>
                                < View width={deviceWidth > 960 ? deviceWidth / 3 : deviceWidth * 0.5}>
                                    <View style={{ padding: 10, borderColor: Colors.textColorSecondary, borderWidth: 1, backgroundColor: Colors.putAway }}>
                                        <Text style={styles.textTitle2}>
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

                                justifyContent: 'space-between',
                                flexDirection: 'row',
                            }}>
                                <View width={deviceWidth > 960 ? deviceWidth / 6 : deviceWidth * 0.25} >
                                    <View style={{ padding: 10, borderColor: Colors.textColorSecondary, borderWidth: 1, backgroundColor: Colors.putAway }}>
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
                                < View width={deviceWidth > 960 ? deviceWidth / 6 : deviceWidth * 0.25}>
                                    <View style={{ padding: 10, borderColor: Colors.textColorSecondary, borderWidth: 1, backgroundColor: Colors.putAway }}>
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

                                <View width={deviceWidth > 960 ? deviceWidth / 6 : deviceWidth * 0.25} >
                                    <View style={{ padding: 10, borderColor: Colors.textColorSecondary, borderWidth: 1, backgroundColor: Colors.putAway }}>
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
                                < View width={deviceWidth > 960 ? deviceWidth / 6 : deviceWidth * 0.25}>
                                    <View style={{ padding: 10, borderColor: Colors.textColorSecondary, borderWidth: 1, backgroundColor: Colors.putAway }}>
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
                        width: deviceWidth > 960 ? (deviceWidth / 4) : (deviceWidth * 0.4),
                        height: deviceWidth > 960 ? (deviceWidth / 12) : (deviceWidth * 0.2),
                        justifyContent: 'center',
                        margin: 10,
                        borderRadius: 20,
                        flexDirection: 'column',
                        padding: 10,
                        backgroundColor: Colors.buttonColorPrimary,
                    }}
                    onPress={() => _CANCELSTORAGE()}>
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
                            {'ยกเลิก'}
                        </Text>
                        <View>

                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        width: deviceWidth > 960 ? (deviceWidth / 4) : (deviceWidth * 0.4),
                        height: deviceWidth > 960 ? (deviceWidth / 12) : (deviceWidth * 0.2),
                        justifyContent: 'center',
                        margin: 10,
                        borderRadius: 20,
                        flexDirection: 'column',
                        padding: 10,
                        backgroundColor: paramData.WS_TAG == paramPost ? Colors.putAway : Colors.textColorSecondary,
                    }}
                    onPress={() => paramData.WS_TAG == paramPost ? _STARTSTORAGE() : console.log()}>
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
                            {'ต่อไป'}
                        </Text>
                        <FontAwesome
                            name="caret-right"
                            size={FontSize.large * 1.5}
                            color={Colors.textColorSecondary}
                        />
                        <View>

                        </View>
                    </View>
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
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container1: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',

        padding: deviceWidth > 960 ? 20 : 0
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
        backgroundColor: Colors.putAway,
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
        color: Colors.putAway,
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


export default NextArchiveJob;
