import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { AppText } from '../components/Labels';
import { auth } from 'react-native-firebase';

import { loadAssets } from "../appstate/actions/app_actions";
import { connect } from 'react-redux';
import { generateRandomString } from '../utils/Utils';

import { setUserProfile } from "../appstate/actions/auth_actions";

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
                if (user) {
                    await this.props.setUserProfile();
                    this.props.navigation.navigate('User');
                } else { 
                    this.props.navigation.navigate('Home');
                }
            } catch (error) {
                console.log('Splash error:', error)
            }
        }, 1500)
    }

    componentWillUnmount() {
        console.log('Splash unmount')
    }

    render() {
        return (
            <View style={styles.container}>
                <Image
                    source={require('../assets/default-logo.png')}
                    style={styles.iconStyle}
                />
                <AppText>Loading...</AppText>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconStyle: {
        width: 200,
        height: 200
    }
})

export default connect(null, { loadAssets, setUserProfile })(SplashScreen);