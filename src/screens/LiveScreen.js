import React, { Component } from 'react';
import { View, Text, NativeModules, PermissionsAndroid, Alert, StatusBar, TouchableOpacity } from 'react-native';
import app from '../constants/app';
import { RtcEngine, AgoraView } from 'react-native-agora';
import { decrementViewer, clearEventListener, setEventListener, incrementViewer, startLive, endLive } from '../utils/EventHandler';
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../utils/BackHandler';
import AppButton from '../components/AppButton';
import { styles } from '../constants';
import AppText from '../components/AppText';
import { formatTime } from '../utils/Utils';
import firebase from 'react-native-firebase';
const { Agora } = NativeModules;

const {
    FPS30,
    AgoraAudioProfileMusicHighQuality,
    AgoraAudioScenarioShowRoom,
    Adaptative
} = Agora

export default class LiveScreen extends Component {

    state = {
        uid: Math.floor(Math.random() * 100),
        showButtons: false,
        peerIds: [],
        joinSucceed: false,
        viewers: 0,
        time: 0,
        timeStr: '',
        status: undefined
    };

    checkCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA);
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                // granted
            } else {
                // not granted
            }
        } catch (err) {
            // console.warn(err);
        }
    }

    checkAudioPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                {
                    title: 'Microphone Permission',
                    message:
                        'InfluenceMe needs access to your camera',
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

    incrementViewers() {
        var eventID = this.props.navigation.getParam('eventID', 'agora_test');
        var result = incrementViewer(eventID);
        if (result == -1) {
            incrementViewers();
        }
    }

    decrementViewers() {
        var eventID = this.props.navigation.getParam('eventID', 'agora_test');
        var result = decrementViewer(eventID);
        if (result == -1) {
            this.decrementViewers();
        }
    }

    componentWillMount() {
        // init RTCEngine
        const channelProfile = this.props.navigation.getParam('channelProfile', 1);
        const clientRole = this.props.navigation.getParam('clientRole', 2);
        const options = {
            appid: app.AGORA_APP_ID,
            channelProfile,
            clientRole,
            videoEncoderConfig: {
                width: 360,
                height: 480,
                bitrate: 1,
                frameRate: FPS30,
                orientationMode: Adaptative,
            },
            audioProfile: AgoraAudioProfileMusicHighQuality,
            audioScenario: AgoraAudioScenarioShowRoom
        };
        // rtc object
        RtcEngine.on('userJoined', (data) => {
            const { peerIds } = this.state;
            if (peerIds.indexOf(data.uid) === -1) {
                this.setState({
                    peerIds: [...this.state.peerIds, data.uid]
                })
            }
        })
        RtcEngine.on('error', (error) => {
            // console.warn("error", error);
        })
        RtcEngine.init(options);
    }

    componentDidMount() {
        this.checkAudioPermission();
        this.checkCameraPermission();
        var channelName = this.props.navigation.getParam('eventID', 'agora_test');
        const clientRole = this.props.navigation.getParam('clientRole', 2);
        var ticketID = this.props.navigation.getParam('ticketID', Math.random() * 100);
        this.setState({
            uid: ticketID
        })
        RtcEngine.joinChannel(channelName, ticketID)
            .then((result) => {
                if (clientRole == 2) {
                    console.warn('increasing viewer count')
                    this.incrementViewers();
                } else {
                    startLive(channelName);
                }
            })
            .catch((error) => {
            });

        // setup listener for  watcherCount
        var eventID = this.props.navigation.getParam('eventID', 'agora_test');
        setEventListener(eventID, ({ status, viewerCount, startedAt }) => {
            var time = 0;
            if (startedAt) {
                time = parseInt(firebase.firestore.Timestamp.now().seconds) - parseInt(startedAt);
                this.setState({ time });
                console.log("time is ", time);
                if (!this.timer) {
                    this.timer = setInterval(() => {
                        var time = this.state.time;
                        var timeStr = formatTime(time);
                        console.log("time 1 is ", time);
                        console.log("timeStr is ", timeStr);
                        this.setState({
                            time: this.state.time + 1,
                            timeStr
                        })
                    }, 1000)
                }
            }
            this.setState({ viewers: viewerCount, status: status })
        });

        // setup back button listener
        const { navigation } = this.props;
        handleAndroidBackButton(navigation, this.backButtonPressed);
    }

    backButtonPressed(navigation) {
        Alert.alert(
            "Confirm Exit",
            "You can continue live from the event page",
            [
                {
                    text: 'Cancel', onPress: () => { },
                    style: 'cancel'
                },
                {
                    text: 'OK', onPress: () => {
                        navigation.goBack();
                        navigation.goBack();
                    }
                },
            ],
            { cancelable: false }
        );
    }

    endLive = () => {
        Alert.alert(
            "Confirm End",
            "You cannot continue if you finish the live",
            [
                {
                    text: 'Cancel', onPress: () => { },
                    style: 'cancel'
                },
                {
                    text: 'OK', onPress: () => {
                        RtcEngine.leaveChannel();
                        endLive(this.props.navigation.getParam('eventID', 'agora_test'));
                        this.props.navigation.goBack();
                        this.props.navigation.goBack();
                    }
                },
            ],
            { cancelable: false }
        );
    }

    leaveLive = () => {
        this.backButtonPressed(this.props.navigation);
    }


    toggleShowState = () => {
        const { showButtons } = this.state;
        if (!showButtons) {
            this.setState({
                showButtons: true
            })
            setTimeout(() => {
                this.setState({
                    showButtons: false
                })
            }, 3000)
        }
    }

    clearTimer() {
        if (this.timer)
            clearInterval(this.timer);
    }

    render() {
        const clientRole = this.props.navigation.getParam('clientRole', 1);
        return (
            <TouchableOpacity activeOpacity={1} onPress={() => this.toggleShowState()} style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <StatusBar hidden={true} />
                    {
                        // The Host
                        clientRole === 1 && (
                            <View style={{ flex: 1 }}>
                                <AgoraView style={{ flex: 1 }} showLocalVideo={true} mode={1} />
                                {/* {
                                    this.state.showButtons && (
                                        <AppButton style={styles.videoQuitButton} onPress={this.endLive}>
                                            <AppText style={{ color: '#FFFFFF', marginLeft: 8, fontSize: 20 }}>End</AppText>
                                        </AppButton>
                                    )
                                } */}
                                <AppButton style={styles.videoQuitButton} onPress={this.endLive}>
                                    <AppText style={{ color: '#FFFFFF', marginLeft: 8, fontSize: 16, fontWeight: 'bold' }}>End</AppText>
                                </AppButton>
                                <View style={styles.liveInfo}>
                                    <AppText style={styles.timerCard}>{this.state.timeStr}</AppText>
                                    <AppText style={styles.liveText}>Live</AppText>
                                </View>

                                <AppText style={styles.viewerCard}>{this.state.viewers + ' Viewers'}</AppText>
                            </View>
                        )
                    }
                    {
                        // Watcher
                        clientRole === 2 && (
                            <View style={{ flex: 1 }}>
                                <AgoraView mode={1} key={this.state.peerIds[0]} style={{ flex: 1 }} remoteUid={this.state.peerIds[0]} />
                                {/* {
                                    this.state.showButtons && (
                                        <AppButton style={styles.videoQuitButton} onPress={this.leaveLive}>
                                            <AppText style={{ color: '#FFFFFF', marginLeft: 8, fontSize: 20 }}>Leave</AppText>
                                        </AppButton>
                                    )
                                } */}
                                <AppButton style={styles.videoQuitButton} onPress={this.leaveLive}>
                                    <AppText style={{ color: '#FFFFFF', marginLeft: 8, fontSize: 16, fontWeight: 'bold' }}>Quit Show</AppText>
                                </AppButton>
                                <AppText style={styles.timerCard}>{this.state.timeStr}</AppText>
                                <AppText style={styles.viewerCard}>{this.state.viewers + ' Viewers'}</AppText>
                            </View>
                        )
                    }
                </View>
            </TouchableOpacity>
        )
    }

    componentWillUnmount() {
        removeAndroidBackButtonHandler();
        clearEventListener();
        RtcEngine.leaveChannel()
            .then(res => {
                if (this.props.navigation.getParam('clientRole', 1) === 2)
                    this.decrementViewers();
            });
        this.clearTimer();
    }
}