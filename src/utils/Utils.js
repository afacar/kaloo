import { Platform, PermissionsAndroid, Alert } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import { firestore } from 'react-native-firebase';
import { months } from '../constants'

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
    gmt = gmt >= 0 ? `+${gmt}` : `${gmt}`
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
                console.log('Camera permission accessed');
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
    onPress = () => { }
    Alert.alert(title, message, [
        {
            text: confirmText || 'Ok',
            onPress: onConfirm || onPress,
        },
    ],
        { cancelable: false }
    );
}

export function compare(a, b) {
    /** Compare functions to sort events based on their event date */
    if (a.eventDate < b.eventDate) {
        return -1;
    }
    if (a.eventDate > b.eventDate) {
        return 1;
    }
    return 0;
}

export function convert2Date(date, timestamp) {
    /** Convert firestore.Timestamp objects to JS Date object */ 

    if (date instanceof firestore.Timestamp) {
        date = date.toDate();
    } else if (timestamp) {
        date = new Date(timestamp);
    }
    return date
}

