import React, { Component, Fragment } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { auth } from "react-native-firebase";
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-navigation'

import { checkAudioPermission, checkCameraPermission } from '../utils/Utils';
import * as actions from '../appstate/actions/host_actions';
import { ContactUs } from '../components/ContactUs';
import { DefaultButton, ClearButton } from '../components/Buttons';
import DashboardHeader from "../components/DashboardHeader";
import CustomStatusBar from '../components/StatusBars/CustomStatusBar';
import LiveEventList from '../components/LiveEventList';
import UpcomingEventList from '../components/UpcomingEventList';
import PastEventList from '../components/PastEventList';


class EventListScreen extends Component {
    static navigationOptions = { headerShown: false }

    state = {
        liveEvents: [],
        upcomingEvents: [],
        pastEvents: [],
        isLoading: false,
    }

    componentDidMount = async () => {
        checkCameraPermission()
        checkAudioPermission()
    }

    render() {
        const { liveEvents, upcomingEvents, pastEvents, navigation } = this.props;

        return (
            <Fragment>
                <SafeAreaView style={{ flex: 0, backgroundColor: "#3598FE" }} />
                <SafeAreaView style={{ flex: 1, backgroundColor: "white" }} >
                    <View style={{ flex: 1, backgroundColor: '#3598FE' }}>
                        <CustomStatusBar />
                        <DashboardHeader
                            profile={this.props.profile}
                            navigation={this.props.navigation}
                        //earnings={earnings} // TODO
                        />
                        <View style={styles.container}>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                overScrollMode='never'
                                contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}
                            >
                                <View>
                                    <View style={{ flexDirection: 'column', justifyContent: 'space-evenly' }}>
                                        <DefaultButton
                                            title='+ Create an Event'
                                            onPress={() => this.props.navigation.navigate('EventCreate')} />
                                        <ClearButton
                                            title='Join a show'
                                            onPress={() => this.props.navigation.navigate('Ticket')} />
                                    </View>
                                    <LiveEventList events={liveEvents} navigation={navigation} />
                                    <UpcomingEventList events={upcomingEvents} navigation={navigation} />
                                    <PastEventList events={pastEvents} navigation={navigation} />
                                </View>
                            </ScrollView>
                            <ContactUs title='Have a problem?' screen='EventList' />
                        </View>
                    </View>
                </SafeAreaView>
            </Fragment>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        paddingHorizontal: 15,
        paddingTop: 10,
        backgroundColor: 'white',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16
    }
})

const mapStateToProps = ({ profile, hostEvents }) => {
    const { liveEvents, upcomingEvents, pastEvents } = hostEvents
    return { profile, liveEvents, upcomingEvents, pastEvents }
}

export default connect(mapStateToProps, actions)(EventListScreen);