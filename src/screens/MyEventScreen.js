import React, { Component } from 'react';
import { ScrollView, StyleSheet, NativeModules } from 'react-native';
import { Button } from 'react-native-elements';
import { RtcEngine } from 'react-native-agora';
import { setEventListener, clearEventListener } from '../utils/EventHandler';
import EventShare from '../components/EventShare';
import EventHeader from '../components/EventHeader';
import { app } from '../constants';
const { Agora } = NativeModules;

const {
    FPS30,
    AgoraAudioProfileMusicHighQuality,
    AgoraAudioScenarioShowRoom,
    Adaptative
} = Agora

class MyEventScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.getParam('event').title}`,
    });

    event = this.props.navigation.getParam('event', '')
    state = { ...this.event }

    componentDidMount() {
        setEventListener(this.state.eid, (event) => {
            if (event) {
                this.setState({ ...event })
            }
        })
    }
    componentWillUnmount() {
        clearEventListener(this.event.eid);
    }

    onCamera = () => {
        const { eventType, eid, duration } = this.state
        // live channelProfile: 1 & call channelProfile: 0
        let channelProfile = eventType === 'live' ? 1 : 0
        // Host clientRole: 1
        let clientRole = 1
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
        // TODO: Opening camera here
        RtcEngine.init(options)
        if (eventType === 'live') {
            this.props.navigation.navigate('Live', { liveData: { clientRole, channelProfile, eventID: eid + '', duration } })
        } else if (eventType === 'call') {
            this.props.navigation.navigate('VideoChat', { liveData: { clientRole, channelProfile, eventID: eid + '', duration } })
        }
    }

    render() {
        const thisEvent = { ...this.state, isPublished: true }
        var { status } = thisEvent;
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <EventHeader
                    event={thisEvent}
                    navigation={this.props.navigation}
                />
                <EventShare
                    link={thisEvent.eventLink}
                />
                <Button
                    title={status === app.EVENT_STATUS.COMPLETED ? 'Event Completed' : 'Preview audio and video'}
                    disabled={status === app.EVENT_STATUS.COMPLETED}
                    onPress={this.onCamera}
                    disabled={this.state.status === app.EVENT_STATUS.COMPLETED}
                    buttonStyle={{ backgroundColor: 'blue', borderRadius: 15 }}
                />
            </ScrollView>
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
    }
})

export default MyEventScreen;