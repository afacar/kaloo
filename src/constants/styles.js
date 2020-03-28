import { StyleSheet, Dimensions } from 'react-native';
import app from './app';
import colors from './colors';


var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

export default StyleSheet.create({
    videoQuitButton: {
        flexDirection: 'row',
        position: 'absolute',
        top: 24,
        left: 24,
        backgroundColor: 'transparent'
    },
    timerCard: {
        position: 'absolute',
        top: 24,
        right: 24,
        backgroundColor: 'white',
        fontSize: 16,
        color: 'black',
        borderRadius: 55,
        textAlign: 'center',
        padding: 8
    },
    viewerCard: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        backgroundColor: 'white',
        fontSize: 16,
        color: 'black',
        borderRadius: 55,
        textAlign: 'center',
        padding: 8
    },
    localVideoBox: {
        position: 'absolute',
        width: 130,
        height: 140,
        bottom: 24,
        right: 24
    }
});