import React, { Component } from 'react';
import { ScrollView, StyleSheet, NativeModules, View } from 'react-native';
import { RtcEngine } from 'react-native-agora';

import * as actions from '../appstate/actions/host_actions';
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
const { BROADCAST } = app.EVENT_TYPE;

class HostScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerStyle: { backgroundColor: colors.BLUE, borderBottomWidth: 0, elevation: 0, shadowOpacity: 0 },
        headerTitle: () => <UserAvatar />,
        headerLeft: () => <HeaderLeft onPress={navigation.goBack} />
    });

    componentDidMount() {
        const { eventType } = this.props.event
        // Broadcast channelProfile: 1 & Call channelProfile: 0
        let channelProfile = eventType === BROADCAST ? 1 : 0
        // Host clientRole: 1; Guest clientRole: 2
        let clientRole = 1

        this.setState({ channelProfile, clientRole })
    }

    componentWillUnmount() { }

    onCamera = () => {
        const { channelProfile, clientRole } = this.state
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
        this.props.navigation.push('HostVideo')
    }

    render() {
        var { status, eventLink } = this.props.event
        let buttonTitle = status === COMPLETED ? 'Session Completed' : status === SUSPENDED ? 'Back to Session' : status === SCHEDULED ? 'Preview audio and video' : 'Session in Progress'
        return (
            <SafeAreaView style={styles.container}>
                <View style={{ flex: 1, backgroundColor: colors.BLUE }}>
                    <View style={styles.cardStyle}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ flexGrow: 1 }}
                        >
                            <EventHeader
                                event={this.props.event}
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
                        </ScrollView>
                        <ContactUs title='Have a problem?' screen='HostScreen' />
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        backgroundColor: "#fff"
    },
    cardStyle: {
        flex: 1,
        paddingHorizontal: 30,
        alignSelf: 'stretch',
        backgroundColor: "white",
        borderTopRightRadius: 26,
        borderTopLeftRadius: 26,
    },
})

const mapStateToProps = ({ hostEvents }) => {
    const { hostEvent, myViewers } = hostEvents
    return { event: hostEvent, viewers: myViewers }
}

export default connect(mapStateToProps, actions)(HostScreen);