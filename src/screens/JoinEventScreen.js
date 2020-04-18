import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import JoinEvent from '../components/JoinEvent';
import HeaderLeft from '../components/Headers/HeaderLeft';
import { colors } from '../constants';


class JoinEventScreen extends Component {
    event = this.props.navigation.getParam('event', '')
    static navigationOptions = ({ navigation }) => ({
        headerStyle: { backgroundColor: colors.BLUE },
        headerTitle: () => null,
        headerLeft: () => (
            <HeaderLeft onPress={navigation.goBack} />
        )
    });
    render() {
        return <JoinEvent event={this.event} navigation={this.props.navigation} />
    }
}

const styles = StyleSheet.create({
})

export default JoinEventScreen;