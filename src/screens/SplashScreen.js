import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '../components/AppText';
import firebase from 'react-native-firebase';

class SplashScreen extends Component {

    componentDidMount() {
        const user = firebase.auth().currentUser;
        if (user) this.props.navigation.navigate('User');
        else this.props.navigation.navigate('Home');
    }

    componentWillUnmount() {
        console.log('Splash unmount')
    }

    render() {
        return (
            <View style={styles.container}>
                <AppText>This is sample Splash Screen!</AppText>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default SplashScreen;