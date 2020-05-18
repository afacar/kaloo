import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { AppText } from '../components/Labels';
import { auth } from 'react-native-firebase';

import { loadAssets } from "../appstate/actions/app_actions";
import { connect } from 'react-redux';
import { generateRandomString } from '../utils/Utils';

import { setUserProfile, clearUserProfile } from "../appstate/actions/auth_actions";
import { setHostEventsListener, clearHostEventsListener } from "../appstate/actions/host_actions";

class SplashScreen extends Component {
    async componentDidMount() {
        setTimeout(async () => {
            var deviceID
            await AsyncStorage.getItem('deviceID').then(value => {
                deviceID = value
            });
            if (!deviceID) {
                deviceID = generateRandomString(5);
                await AsyncStorage.setItem('deviceID', deviceID);
            }
            try {
                await this.props.loadAssets()
                const user = auth().currentUser;
                console.log('Splash user', user)
                if (user) {
                    await this.props.setHostEventsListener()
                    await this.props.setUserProfile();
                    this.props.navigation.navigate('User');
                } else {
                    this.props.clearUserProfile()
                    this.props.clearHostEventsListener()
                    this.props.navigation.navigate('Home');
                }
            } catch (error) {
                console.log('Splash error:', error)
            }
        }, 1500)
    }

    componentWillUnmount() { }

    render() {
        return (
            <View style={styles.container}>
                <Image
                    source={require('../assets/default-logo.png')}
                    style={styles.iconStyle}
                />
                <AppText>
                    Welcome to your online gathering platform
                </AppText>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    iconStyle: {
        width: 200,
        height: 200
    }
})

export default connect(null, { loadAssets, setUserProfile, clearUserProfile, setHostEventsListener, clearHostEventsListener })(SplashScreen);