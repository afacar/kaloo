import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '../components/AppText';
import { Input, Button } from 'react-native-elements';
import firebase from "react-native-firebase";

class EventListScreen extends Component {
    componentDidMount() {
        this.authListener = firebase.auth().onAuthStateChanged(user => {
            console.log('EventList onAuthStateChange>', user);
            if (user && !user.isAnonymous) {
                this.props.navigation.navigate('User');
            } else {
                this.props.navigation.navigate('Splash');
            }
        })
    }

    componentWillUnmount() {
        if(this.authListener) {
            console.log('EventList Unmounts');
            this.authListener();
        } 
    }

    render() {
        return (
            <View style={styles.container}>
                <AppText>List of Events</AppText>
                <Button
                    title="Sign Out"
                    onPress={() => firebase.auth().signOut()}
                />
                <Button
                    title="Go to Balance"
                    onPress={() => this.props.navigation.navigate('Balance')}
                />
                <Button
                    title="Go to Profile"
                    onPress={() => this.props.navigation.navigate('Profile')}
                />
                <Button
                    title="Go to Create Event"
                    onPress={() => this.props.navigation.navigate('CreateEvent')}
                />
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

export default EventListScreen;