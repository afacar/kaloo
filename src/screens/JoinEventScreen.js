import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import JoinEvent from '../components/JoinEvent';


class JoinEventScreen extends Component {
    event = this.props.navigation.getParam('event', '')

    render() {
        return <JoinEvent event={this.event} navigation={this.props.navigation} />
    }
}

const styles = StyleSheet.create({
})

export default JoinEventScreen;