import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { auth } from 'react-native-firebase';
import { connect } from 'react-redux';

import { AppText } from '../components/Labels';
import ImageSlider from '../components/ImageSlider';
import { loadAssets } from "../appstate/actions/app_actions";
import { generateRandomString } from '../utils/Utils';

import { setUserProfile, clearUserProfile } from "../appstate/actions/auth_actions";
import { setHostEventsListener, clearHostEventsListener } from "../appstate/actions/host_actions";

class SplashScreen extends Component {
    state = { isLoading: true, deviceID: null }

    async componentDidMount() {
        this.setState({ isLoading: true })
        setTimeout(async () => {
            await AsyncStorage.getItem('deviceID').then(deviceID => {
                this.setState({ isLoading: false, deviceID })
                if (deviceID) {
                    this.skipIntro();
                } else {
                    let deviceID = generateRandomString(5);
                    AsyncStorage.setItem('deviceID', deviceID);
                }
            });
        }, 1500)
    }

    componentWillUnmount() { }

    skipIntro = () => {
        try {
            this.props.loadAssets()
            const user = auth().currentUser;
            if (user) {
                this.props.setHostEventsListener()
                this.props.setUserProfile();
                this.props.navigation.navigate('User');
            } else {
                this.props.clearUserProfile()
                this.props.clearHostEventsListener()
                this.props.navigation.navigate('Home');
            }
        } catch (error) {
            console.log('Splash error:', error)
        }
    }

    render() {
        const { isLoading, deviceID } = this.state;
        console.log('render state', this.state)
        return (
            isLoading && !deviceID ? (<SplashView />) : !deviceID ? <ImageSlider onPress={this.skipIntro} /> : <SplashView />
        )
    }
}

function SplashView(props) {
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