import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '../components/AppText';
import { Input, Button } from 'react-native-elements';

class EventScreen extends Component {

    render() {
        return (
            <View style={styles.container}>
                <AppText>The Event</AppText>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center'
    }
})

export default EventScreen;