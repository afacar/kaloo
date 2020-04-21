import React, { Component } from 'react';
import { ScrollView, StyleSheet, NativeModules, View } from 'react-native';
import { RtcEngine } from 'react-native-agora';


import * as actions from '../appstate/actions/event_actions';
//import { clearEventListener } from '../utils/EventHandler';
import EventShare from '../components/EventShare';
import EventHeader from '../components/EventHeader';
import { SafeAreaView } from 'react-navigation'
import { DefaultButton } from '../components/Buttons';
import { ContactUs } from '../components/ContactUs';
import { app, colors } from '../constants';
import HeaderLeft from '../components/Headers/HeaderLeft';
import UserAvatar from '../components/UserAvatar';
import { connect } from 'react-redux';

const { Agora } = NativeModules;

const {
    FPS30,
    AgoraAudioProfileMusicHighQuality,
    AgoraAudioScenarioShowRoom,
    Adaptative
} = Agora

const { COMPLETED, SUSPENDED, IN_PROGRESS, SCHEDULED } = app.EVENT_STATUS

class MyEventScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerStyle: { backgroundColor: colors.BLUE, borderBottomWidth: 0, elevation: 0, shadowOpacity: 0 },
        headerTitle: () => <UserAvatar />,
        headerLeft: () => <HeaderLeft onPress={navigation.goBack} />
    });

    event = this.props.navigation.getParam('event', '')
    state = { ...this.event, Live: this.props.eventLive, isPublished: true }

    componentDidMount() {
        const { eid, eventType } = this.state
        // live channelProfile: 1 & call channelProfile: 0
        let channelProfile = eventType === 'live' ? 1 : 0
        let eventScreen = eventType === 'live' ? 'Live' : 'HostMeeting'
        // Host clientRole: 1
        let clientRole = 1
        this.setState({ channelProfile, eventScreen, clientRole })
        this.props.setLiveEventListener(eid, this.updateState);

        console.log('MyEvent DidMount state', this.state)
    }

    updateState = (Live) => {
        this.setState({ Live })
        console.log('MyEvent new state', this.state)
    }

    componentWillUnmount() {
        this.props.clearLiveEventListener();
    }

    onCamera = () => {
        const { channelProfile, clientRole, eventScreen } = this.state
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
        // Opening camera here
        RtcEngine.init(options)
        this.props.navigation.navigate(eventScreen, { eventData: this.state })
    }

    render() {
        console.log('RENDER', this.state)
        var { status, eventLink } = this.state
        let buttonTitle = status === COMPLETED ? 'Meeting Completed' : status === SUSPENDED ? 'Continue Meeting' : status === SCHEDULED ? 'Preview audio and video' : 'Meeting in Progress'
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                <ScrollView contentContainerStyle={{
                    flexGrow: 1,
                    alignItems: 'center',
                    backgroundColor: "#3598FE"
                }}>
                    <View style={styles.componentStyle}>
                        <EventHeader
                            event={this.state}
                            navigation={this.props.navigation}
                        />
                        <EventShare
                            link={eventLink}
                        />
                        <View style={{ marginVertical: 15 }}>
                            <DefaultButton
                                title={buttonTitle}
                                onPress={this.onCamera}
                                disabled={status === COMPLETED}
                            />
                        </View>
                    </View>
                </ScrollView>
                <ContactUs />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        marginHorizontal: 10,
        padding: 10,
        borderRadius: 15,
    },
    componentStyle: {
        flex: 1,
        paddingHorizontal: 40,
        paddingVertical: 10,
        alignSelf: 'stretch',
        paddingVertical: 20,
        backgroundColor: "white",
        borderTopRightRadius: 26,
        borderTopLeftRadius: 26,
    },
})

const mapStateToProps = ({ eventLive }) => {
    console.log('MyEvent mapStateToProps', eventLive)
    return { eventLive }
}

export default connect(mapStateToProps, actions)(MyEventScreen);