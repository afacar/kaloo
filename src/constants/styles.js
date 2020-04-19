import { StyleSheet, Dimensions } from 'react-native';
import app from './app';
import colors from './colors';
import dimensions from './dimensions';


var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

export default StyleSheet.create({
    videoQuitButton: {
        flexDirection: 'row',
        position: 'absolute',
        top: 24 + dimensions.HEADER_MARGIN,
        left: 24,
        backgroundColor: 'transparent'
    },
    liveInfo: {
        position: 'absolute',
        top: 24 + dimensions.HEADER_MARGIN,
        left: 24,
        backgroundColor: 'transparent',
    },
    timerNViewer: {
        position: 'absolute',
        top: 24 + dimensions.HEADER_MARGIN,
        right: 24,
        backgroundColor: 'transparent',
    },
    timer: {
        position: 'absolute',
        top: 24 + dimensions.HEADER_MARGIN,
        right: 24,
        backgroundColor: 'transparent',
    },
    timerCard: {
        fontSize: 12,
        backgroundColor: 'white',
        color: 'black',
        borderRadius: 6,
        textAlign: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        padding: 8,
    },
    timerCardRed: {
        fontSize: 12,
        backgroundColor: colors.PINK,
        color: 'white',
        borderRadius: 6,
        textAlign: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        padding: 8,
    },
    liveText: {
        marginLeft: 16,
        fontSize: 12,
        color: 'white',
        backgroundColor: colors.PINK,
        borderRadius: 6,
        textAlign: 'center',
        padding: 8,
        paddingHorizontal: 20
    },
    standybyText: {
        marginLeft: 16,
        fontSize: 12,
        color: 'white',
        backgroundColor: colors.BLUE,
        borderRadius: 6,
        textAlign: 'center',
        padding: 8,
        paddingHorizontal: 20
    },
    viewerCard: {
        position: 'absolute',
        top: 24 + dimensions.HEADER_MARGIN,
        left: 24,
        backgroundColor: 'white',
        fontSize: 12,
        color: 'black',
        borderRadius: 6,
        textAlign: 'center',
        padding: 8,
    },
    viewerText: {
        backgroundColor: 'white',
        fontSize: 12,
        color: 'black',
        borderRadius: 6,
        textAlign: 'center',
    },
    localVideoBox: {
        position: 'absolute',
        width: 140,
        height: 160,
        bottom: 72,
        left: 24,
    },
    startButton: {
        position: 'absolute',
        alignSelf: 'center',
        backgroundColor: colors.GREEN,
        bottom: 24,
        width: 300,
        height: 50,
        // borderWidth: 1,
        borderRadius: 6,
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    endButton: {
        position: 'absolute',
        alignSelf: 'center',
        backgroundColor: colors.PINK,
        bottom: 24,
        width: 300,
        height: 50,
        // borderWidth: 1,
        borderRadius: 6,
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    waitingBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    connectingCard: {
        backgroundColor: colors.ORANGE,
        padding: 4,
        borderRadius: 6
    },
    connectingText: {
        color: 'black',
        fontSize: 12
    },
    headerTransparent: {
        position: 'absolute',
        backgroundColor: 'transparent',
        zIndex: 100,
        top: 0,
        left: 0,
        right: 0
    }
});