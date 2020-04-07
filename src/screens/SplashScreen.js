import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '../components/AppText';
import { auth } from 'react-native-firebase';

import { loadAssets } from "../appstate/actions/app_actions";
import { connect } from 'react-redux';

class SplashScreen extends Component {
    async componentDidMount() {
        try {
            await this.props.loadAssets()
            const user = auth().currentUser;
            this.setState({ isWaiting: false })
            if (user) this.props.navigation.navigate('User');
            else this.props.navigation.navigate('Home');
        } catch(error) {
            this.setState({ isWaiting: false })
        }
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

export default connect(null, { loadAssets })(SplashScreen);