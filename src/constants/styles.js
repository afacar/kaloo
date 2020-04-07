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
        top: 24,
        left: 24,
        backgroundColor: 'transparent',
    },
    timerNViewer: {
        position: 'absolute',
        top: 24,
        right: 24,
        backgroundColor: 'transparent',
    },
    timerCard: {
        fontSize: 12,
        backgroundColor: 'white',
        color: 'black',
        borderRadius: 56,
        textAlign: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        padding: 8,
    },
    liveText: {
        marginLeft: 16,
        fontSize: 12,
        color: 'white',
        backgroundColor: colors.RED,
        borderRadius: 56,
        textAlign: 'center',
        padding: 8,
        paddingHorizontal: 20
    },
    standybyText: {
        marginLeft: 16,
        fontSize: 12,
        color: 'white',
        backgroundColor: colors.GREEN,
        borderRadius: 56,
        textAlign: 'center',
        padding: 8,
        paddingHorizontal: 20
    },
    viewerCard: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        backgroundColor: 'white',
        fontSize: 12,
        color: 'black',
        borderRadius: 55,
        textAlign: 'center',
        padding: 8
    },
    viewerText: {
        backgroundColor: 'white',
        fontSize: 12,
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
        right: 24,
    },
    startButton: {
        position: 'absolute',
        alignSelf: 'center',
        backgroundColor: colors.GREEN,
        bottom: 24,
        // width: 220,
        // height: 46,
        // borderWidth: 1,
        borderRadius: 38,
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    endButton: {
        position: 'absolute',
        alignSelf: 'center',
        backgroundColor: colors.RED,
        bottom: 24,
        // width: 220,
        // height: 46,
        // borderWidth: 1,
        borderRadius: 38,
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    waitingBox: {
        position: 'absolute',
        alignSelf: 'center',
        top: deviceHeight / 2,
        flexDirection: 'row'
    }
});