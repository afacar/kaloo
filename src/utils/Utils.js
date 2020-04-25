import { Platform, PermissionsAndroid, Alert } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import { months } from '../constants'
import firebase, { functions, auth } from "react-native-firebase";

export const formatTime = (seconds) => {
    var negative = false;
    if (seconds < 0) {
        seconds *= -1;
        negative = true;
    }
    var sec_num = parseInt(seconds); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    if (hours > 0) {
        if (negative)
            return '-' + hours + ':' + minutes + ':' + seconds;
        else
            return hours + ':' + minutes + ':' + seconds;
    }
    else {
        if (negative)
            return '-' + minutes + ':' + seconds;
        else
            return minutes + ':' + seconds;

    }
}

export function formatDuration(duration) {
    // Takes duration as minutes and return as a readible, rounded time format
    // Can be used to show remaining duration or duration for an event 
    let minus = duration >= 0 ? 1 : -1;
    duration = duration * minus;

    if (duration == 0)
        return ''

    if (duration < 60)
        return (duration * minus) + ' min'

    let hours = Math.floor(duration / 60)
    let minutes = duration - (hours * 60)
    minutes = minutes > 0 ? ` ${minutes} min` : ''

    if (hours < 24)
        return `${hours * minus} hr${minutes}`

    let days = Math.floor(hours / 24)
    hours = hours - (days * 24)
    hours = hours > 0 ? ` ${hours} hr` : ''

    if (days < 7)
        return `${days * minus} day${hours}`

    let weeks = Math.floor(days / 7)
    days = days - (weeks * 7)
    days = days > 0 ? ` ${days} day` : ''

    return `${weeks * minus} week${days}`
}

export function addZeroToTime(time) {
    if (time < 10) {
        time = '0' + time
    }
    return time
}

export function splitDate(dateObj) {
    // Takes date object and return {date, time, gmt} object

    const month = months[dateObj.getMonth()]
    const year = dateObj.getFullYear()
    const day = dateObj.getDate()
    const hour = addZeroToTime(dateObj.getHours())
    let minutes = addZeroToTime(dateObj.getMinutes())

    let gmt = dateObj.getTimezoneOffset() / -60
    gmt = gmt >= 0 ? `+${gmt}` : `-${gmt}`
    const date = day + ' ' + month + ' ' + year
    const time = hour + ':' + minutes
    return { date, time, gmt }
}

export function generateRandomString(length) {
    let alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
    let randomString = '';
    for (var i = length; i > 0; i--) {
        randomString += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return randomString;
}

export async function getDeviceID() {
    var deviceID;
    await AsyncStorage.getItem('deviceID').then(value => {
        deviceID = value
    });
    return deviceID;
}

export function validateEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return true;
    }
    return false;
}

export const checkAudioPermission = async () => {
    if (Platform.OS === 'android') {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                {
                    title: 'Microphone Permission',
                    message:
                        'Kaloo needs access to your microphone',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                // granted
            } else {
                // not granted
            }
        } catch (err) {
            // console.warn(err);
        }
    }
}

export const checkCameraPermission = async () => {
    if (Platform.OS === 'android') {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA);
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('You can use the camera');
            } else {
                console.log('Camera permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    }
}

export function ConfirmModal(title, message, confirmText, canceltext, onConfirm) {
    Alert.alert(title, message, [
        {
            text: canceltext || 'Cancel',
            onPress: () => { },
            style: 'cancel',
        },
        {
            text: confirmText || 'Confirm',
            onPress: onConfirm,
        },
    ],
        { cancelable: false }
    );
}

export function InfoModal(title, message, confirmText, onConfirm) {
    Alert.alert(title, message, [
        {
            text: confirmText || 'Ok',
            onPress: onConfirm,
        },
    ],
        { cancelable: false }
    );
}

export function compare(a, b) {
    if (a.eventDate < b.eventDate) {
        return -1;
    }
    if (a.eventDate > b.eventDate) {
        return 1;
    }
    return 0;
}


export const checkNotificationPermission = async () => {
    try {
        let enabled = await firebase.messaging().hasPermission()
        if (enabled) {
            console.log("Push permission var, token al!");
            var token = await getFCMToken();
            if (auth().currentUser)
                saveFCMToken(token)
        } else {
            requestNotificationPermission();
        }
    } catch (error) {
        console.log('checkPermisson error:', error.message);
    }
}

export const requestNotificationPermission = async () => {
    try {
        await firebase.messaging().requestPermission();
        // User has authorised
        var token = await getFCMToken();
        if (auth().currentUser)
            saveFCMToken(token)
    } catch (error) {
        // User has rejected permissions
        console.log('permission rejected');
    }
}

export const getFCMToken = async () => {
    try {
        let token = "";
        console.log("Existing token is,", token);
        if (!token) {
            token = await firebase.messaging().getToken();
            console.log("New Token is taken :", token);
            return token
        }
    } catch (error) {
        console.log('getFCMToken error:', error.message);
    }

}

export const saveFCMToken = async (token) => {
    const { uid, displayName, photoURL } = firebase.auth().currentUser;
    const url = `users/${uid}/FCMToken/${token}`;

    if (token) {
        // user has a device token
        console.log('saveFCMToken url', url);
        console.log('saveFCMToken token', token);
        try {
            console.log("started try")
            let updateFCM = functions().httpsCallable('updateFCMToken');
            let result = await updateFCM({ uid, token })
            console.log("resulted function", result)
            if (result.data.state !== 'SUCCESS') {
                console.log("saveFCMToken FCMToken is saved to firebase!");
            } else {
                console.log("saveFCMToken FCMToken could not be saved to firebase!");
            }
        } catch (error) {
            console.log("saveFCMToken has error", error.message);
        }
    }
}