import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import JoinEvent from '../components/JoinEvent';
import HeaderLeft from '../components/Headers/HeaderLeft';
import { colors } from '../constants';


class MyJoinEventScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: () => null,
        headerLeft: () =><HeaderLeft onPress={navigation.goBack} />
    });

    event = this.props.navigation.getParam('event', '')

    render() {
        return <JoinEvent event={this.event} navigation={this.props.navigation} />
    }
}

const styles = StyleSheet.create({
})

export default MyJoinEventScreen;