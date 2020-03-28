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
    liveInfo: {
        position: 'absolute',
        flexDirection: 'row',
        top: 24,
        right: 24,
        backgroundColor: 'transparent',
    },
    timerCard: {
        fontSize: 16,
        backgroundColor: 'white',
        color: 'black',
        borderRadius: 56,
        textAlign: 'center',
        padding: 8
    },
    liveText: {
        marginLeft: 16,
        width: 70,
        height: 40,
        fontSize: 16,
        color: 'white',
        backgroundColor: colors.RED,
        borderRadius: 56,
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
    },
    startButton: {
        position: 'absolute',
        bottom: 24,
        width: 220,
        height: 46,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});