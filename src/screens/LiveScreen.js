import React, { Component } from 'react';
import { View, Platform, NativeModules, PermissionsAndroid, Alert, StatusBar, TouchableOpacity, BackHandler, ToastAndroid } from 'react-native';
import app from '../constants/app';
import { RtcEngine, AgoraView } from 'react-native-agora';
import { decrementViewer, clearLiveEventListener, setLiveEventListener, incrementViewer, startLive, endLive, suspendLive, continueLive } from '../utils/EventHandler';
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

    constructor(props) {
        super(props);
        this.backButtonPressed = this.backButtonPressed.bind(this);
    }

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
        }
    }

    incrementViewers() {
        var eventID = this.props.navigation.getParam('eventID', 'agora_test');
        var result = incrementViewer(eventID);
        if (result == -1) {
            incrementViewer();
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
            console.warn("user joined")
            const { peerIds } = this.state;
            if (peerIds.indexOf(data.uid) === -1) {
                this.setState({
                    peerIds: [...this.state.peerIds, data.uid]
                })
            }
        })
        RtcEngine.on('error', (error) => {
        })
        RtcEngine.init(options);
    }

    componentDidMount() {
        if (Platform.OS === 'android') {
            this.checkCameraPermission();
            this.checkAudioPermission();
        }
        var channelName = this.props.navigation.getParam('eventID', 'agora_test');
        const clientRole = this.props.navigation.getParam('clientRole', 2);
        var ticketID = this.props.navigation.getParam('ticketID', Math.random() * 100);
        this.setState({
            uid: ticketID
        })

        if (clientRole === 2) {
            RtcEngine.joinChannel(channelName, ticketID)
                .then((result) => {
                    console.warn('joined', channelName)
                    this.incrementViewers();
                })
                .catch((error) => {
                });
        } else if (clientRole === 1) {
            RtcEngine.joinChannel(firebase.auth().currentUser.uid, 0)
                .then((result) => {
                })
                .catch((error) => {
                });
        }
        // setup listener for  watcherCount
        var eventID = this.props.navigation.getParam('eventID', 'agora_test');
        setLiveEventListener(eventID, ({ status, viewerCount, startedAt }) => {
            var time = 0;
            if (startedAt && status === app.EVENT_STATUS.IN_PROGRESS) {
                if (clientRole === 1 && !this.state.joinSucceed) {
                    RtcEngine.leaveChannel();
                    RtcEngine.joinChannel(channelName)
                        .then((result) => {
                            this.setState({
                                joinSucceed: true
                            })
                        })
                        .catch((error) => {
                        });
                }
                time = parseInt(firebase.firestore.Timestamp.now().seconds) - parseInt(startedAt);
                this.setState({ time });
                if (!this.timer) {
                    this.timer = setInterval(() => {
                        var time = this.state.time;
                        var timeStr = formatTime(time);
                        this.setState({
                            time: this.state.time + 1,
                            timeStr
                        })
                    }, 1000)
                }
            }
            else if (status === app.EVENT_STATUS.COMPLETED && clientRole === 2) {
                this.onEventCompleted();
            }
            this.setState({ viewers: viewerCount || 0, status: status })
        });

        // setup back button listener
        handleAndroidBackButton(this.backButtonPressed);
    }

    onEventCompleted() {
        Alert.alert(
            "Event Finished",
            "Host ended the meeting",
            [

                {
                    text: 'OK', onPress: () => {
                        this.props.navigation.goBack();
                        return false;
                    }
                },
            ],
            { cancelable: false }
        );
    }

    startLive = () => {
        var channelName = this.props.navigation.getParam('eventID', 'agora_test');
        var ticketID = this.props.navigation.getParam('ticketID', 0);
        Alert.alert(
            "Start broadcast",
            "Are you sure you want to start broadcasting?",
            [
                {
                    text: 'No', onPress: () => { },
                    style: 'cancel'
                },
                {
                    text: 'Yes', onPress: () => {
                        RtcEngine.leaveChannel();
                        RtcEngine.joinChannel(channelName)
                            .then((result) => {
                                startLive(channelName);
                            })
                            .catch((error) => {
                            });
                    }
                },
            ],
            { cancelable: false }
        );
    }

    continueLive = () => {
        var channelName = this.props.navigation.getParam('eventID', 'agora_test');
        var ticketID = this.props.navigation.getParam('ticketID', 0);
        Alert.alert(
            "Continue broadcast",
            "Are you sure you want to continue broadcasting?",
            [
                {
                    text: 'No', onPress: () => { },
                    style: 'cancel'
                },
                {
                    text: 'Yes', onPress: () => {
                        RtcEngine.leaveChannel();
                        RtcEngine.joinChannel(channelName)
                            .then((result) => {
                                continueLive(channelName);
                            })
                            .catch((error) => {
                            });
                    }
                },
            ],
            { cancelable: false }
        );
    }

    suspendLive = () => {
        this.backButtonPressed();
    }

    endLive = () => {
        Alert.alert(
            "Confirm End",
            "Do you want to end your stream early?",
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
                    }
                },
            ],
            { cancelable: false }
        );
    }

    backButtonPressed() {
        const { navigation } = this.props;
        var clientRole = this.props.navigation.getParam('clientRole', 2);
        var eventID = this.props.navigation.getParam('eventID', 'agora_test');

        Alert.alert(
            "Confirm Exit",
            "You can continue live from MyEvent page",
            [
                {
                    text: 'Cancel', onPress: () => {
                        return true;
                    },
                    style: 'cancel'
                },
                {
                    text: 'OK', onPress: () => {
                        if (clientRole === 1) {
                            suspendLive(eventID)
                        }
                        navigation.goBack();
                        return false;
                    }
                },
            ],
            { cancelable: false }
        );
        return true;
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
                                <AppButton style={styles.videoQuitButton} onPress={this.suspendLive}>
                                    <AppText style={{ color: '#FFFFFF', marginLeft: 8, fontSize: 16, fontWeight: 'bold' }}>Go back</AppText>
                                </AppButton>
                                <View style={styles.liveInfo}>
                                    <View style={{ flex: 1, marginBottom: 10, justifyContent: 'center', alignItems: 'center' }}>
                                        <AppText style={styles.viewerText}>{this.state.viewers + ' Viewers'}</AppText>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <AppText style={styles.timerCard}>{this.state.timeStr}</AppText>
                                        <AppText style={styles.liveText}>Live</AppText>
                                    </View>
                                </View>

                                {
                                    this.state.status === app.EVENT_STATUS.IN_PROGRESS && (
                                        <AppButton style={styles.startButton} onPress={this.endLive}>
                                            <AppText style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>End Broadcasting</AppText>
                                        </AppButton>
                                    )
                                }
                                {
                                    this.state.status === app.EVENT_STATUS.SUSPENDED && (
                                        <AppButton style={styles.startButton} onPress={this.continueLive}>
                                            <AppText style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Continue Broadcasting</AppText>
                                        </AppButton>
                                    )
                                }
                                {
                                    this.state.status === app.EVENT_STATUS.SCHEDULED && (
                                        <AppButton style={styles.startButton} onPress={this.startLive}>
                                            <AppText style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Start Broadcasting</AppText>
                                        </AppButton>
                                    )
                                }
                            </View>
                        )
                    }
                    {
                        // Viewer
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
                                <AppButton style={styles.videoQuitButton} onPress={this.suspendLive}>
                                    <AppText style={{ color: '#FFFFFF', marginLeft: 8, fontSize: 16, fontWeight: 'bold' }}>Quit Show</AppText>
                                </AppButton>
                                <View style={styles.liveInfo}>
                                    <AppText style={styles.timerCard}>{this.state.timeStr}</AppText>
                                </View>
                                <AppText style={styles.viewerCard}>{this.state.viewers + ' Viewers'}</AppText>
                            </View>
                        )
                    }
                </View>
            </TouchableOpacity>
        )
    }

    componentWillUnmount() {
        removeAndroidBackButtonHandler(this.backButtonPressed);
        clearLiveEventListener();
        RtcEngine.leaveChannel()
            .then(res => {
                if (this.props.navigation.getParam('clientRole', 1) === 2)
                    this.decrementViewers();
            });
        this.clearTimer();
    }
}