import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '../components/AppText';
class SplashScreen extends Component {

    componentDidMount() {
        setTimeout(()=>{
            this.props.navigation.navigate('Main');
        },1500)
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