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

import * as dataActions from '../../src/actions/dataActions';


import Colors from '../../src/Colors';
import { fontSize, fontWeight } from 'styled-system';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const saveDeliveryInfo = ({ route }) => {

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


    const [paramData, setparamData] = useState({});
    const [paramPost, setparamPost] = useState('');
    const [tempPost, settempPost] = useState('');
    useEffect(() => {
        if (dataReducer.nextJOB && dataReducer.nextJOB.data)
            setparamData(dataReducer.nextJOB.data)
        console.log(paramData)
        //backsakura013
    }, [route.params?.data]);
    useEffect(() => {
        if (route.params.post || route.params.code) {
            setparamPost(route.params.post)
            _C_WL_CODE(route.params.post)
            settempPost(route.params.post)
            console.log(route.params.code)
        } else if (tempPost.length > 0) {
            setparamPost(tempPost)
            _C_WL_CODE(tempPost)
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

    const _C_WL_CODE = (TOWL_CODE) => {
        console.log('TOWL_CODE ' + paramData.TOWL_CODE)
        if (paramData.TOWL_CODE == TOWL_CODE)
            Alert.alert(
                Language.t('notiAlert.header'),
                'รหัสตำแหน่งเก็บถูกต้อง', [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        else Alert.alert(
            Language.t('notiAlert.header'),
            'รหัสตำแหน่งเก็บไม่ถูกต้อง', [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
    };

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
                    Alert.alert(
                        Language.t('notiAlert.header'),
                        'ยกเลิกสำเร็จ', [{
                            text: Language.t('alert.ok'), onPress: () =>
                                navigation.dispatch(
                                    navigation.replace('Splashs', { name: 'อ่านรายละเอียดงานจัดส่ง', data: 'MD' }))
                        }
                    ]);

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

    const _FINISHPICKING = async () => {
        letsLoading()
        console.log(paramData.TO_WL_NAME)
        await fetch(databaseReducer.Data.urlser + '/PickAndPack', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': loginReducer.serviceID,
                'BPAPUS-LOGIN-GUID': loginReducer.guid,
                'BPAPUS-FUNCTION': 'FINISHPICKING',
                'BPAPUS-PARAM':
                    '{"FORK_CODE": "' +
                    databaseReducer.Data.ForkCode +
                    '","WS_TAG": "' +
                    paramData.WS_TAG +
                    '","WS_KEY": "' +
                    paramData.WS_KEY +
                    '","WS_PICKER": "' +
                    loginReducer.userNameED +
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
                    await dispatch(dataActions.setPicking([]))
                    Alert.alert(
                        Language.t('notiAlert.header'),
                        'จัดเก็บสำเร็จ', [{
                            text: Language.t('alert.ok'), onPress: () =>
                            navigation.dispatch(
                                navigation.replace('Main', {})
                              )
                                // navigation.dispatch(
                                //     navigation.replace('Splashs', { name: 'อ่านรายละเอียดงานจัดส่ง', data: 'MD' }))
                        }
                    ]);

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
                        <View width={deviceWidth / 1.5} style={{
                            alignSelf: 'center',
                            justifyContent: 'center',
                            alignContent: 'center',
                            backgroundColor: Colors.buttonTextColor
                        }}>
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
                                < View width={deviceWidth / 2}>
                                    <View style={{ padding: 10, }}>
                                        <Text style={styles.textTitle2}>
                                            {paramData.SKU_CODE}
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
                                < View width={deviceWidth / 2}>
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
                                            รหัสตำแหน่งเก็บ
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
                                        <Text style={styles.textTitle1} >
                                            ชื่อตำแหน่งเก็บ
                                        </Text>
                                    </View>
                                    <View style={{ padding: 10, borderColor: Colors.textColorSecondary, borderWidth: 1, backgroundColor: Colors.buttonTextColor }}>
                                        <Text style={styles.textTitle3} >
                                            {paramData.TO_WL_NAME}
                                        </Text>
                                    </View>
                                </View >
                            </View>
                        </View>
                    </View>
                </ScrollView>
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
                                        <Text style={{
                                            color: Colors.fontColor,
                                            alignSelf: 'center',
                                            fontSize: FontSize.large,
                                            fontWeight: 'bold',
                                        }}>
                                            ไม่สามารถจัดเก็บได้ กรุณากด "ตกลง" เพื่อยกเลิกรายการ
                                        </Text>
                                        <View style={{ flexDirection: "row", alignSelf: 'center' }}>
                                            <TouchableOpacity
                                                onPress={() => _CANCELPICKING()}>
                                                <View
                                                    style={{
                                                        width: deviceWidth / 4.2,
                                                        margin: 10,
                                                        borderRadius: 20,
                                                        flexDirection: 'column',
                                                        alignSelf: 'center',
                                                        padding: 20,
                                                        backgroundColor: Colors.picking,
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
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => setModalVisible(!modalVisible)}>
                                                <View
                                                    style={{
                                                        width: deviceWidth / 4.2,
                                                        margin: 10,
                                                        borderRadius: 20,
                                                        flexDirection: 'column',
                                                        alignSelf: 'center',
                                                        padding: 20,
                                                        backgroundColor: Colors.buttonColorPrimary,
                                                    }}>
                                                    <Text
                                                        style={{
                                                            color: Colors.buttonTextColor,
                                                            alignSelf: 'center',
                                                            fontSize: FontSize.medium,
                                                            fontWeight: 'bold',
                                                        }}>
                                                        {'ยกเลิก'}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>

                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </Modal>
                </View>
            </SafeAreaView>

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: 20,
                backgroundColor: Colors.backgroundColor
            }}>
                <TouchableOpacity
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
                            backgroundColor: Colors.buttonColorPrimary,
                        }}>
                        <Text
                            style={{
                                color: Colors.buttonTextColor,
                                alignSelf: 'center',
                                fontSize: FontSize.medium * 1.5,
                                fontWeight: 'bold',
                            }}>
                            {'เก็บไม่ได้'}
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
                        backgroundColor:  Colors.picking  ,
                    }}
                    onPress={() =>  _FINISHPICKING()   }>

                    <View>
                        <Text
                            style={{
                                color: Colors.buttonTextColor,
                                alignSelf: 'center',
                                fontSize: FontSize.medium * 1.5,
                                fontWeight: 'bold',
                            }}>
                            {'จัดเก็บได้'}
                        </Text>
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
                            color={Colors.picking}
                        />
                    </View>
                )
            }

            {
                modalVisible && (
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
                )
            }
        </>
    );
};

const styles = StyleSheet.create({
    container1: {
        paddingTop: 20,
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
        height:  FontSize.medium * 3,
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
        backgroundColor: Colors.picking,
        borderRadius: 20,
        padding: 20,
        width: deviceWidth / 1.5,
        shadowColor: "#000",
    },
});


export default saveDeliveryInfo;