import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '../components/AppText';
import { Input, Button, Text } from 'react-native-elements';
import firebase from 'react-native-firebase';

function ValidateEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return (true)
    }
    //AlertUser('Check  your email!', 'Your email seems a bit awkward!')
    return (false)
}

class SignInScreen extends Component {
    email = this.props.navigation.getParam('email', '');
    state = { 
        email: this.email || 'user@influence.me', 
        password: 'asdasd', 
        isWaiting: false,
        emailError: ' ', 
        passwordError: ' ' }

    handleSignIn = async () => {
        const { email, password } = this.state;
        console.log('email and password', email, password);
        this.setState({ isWaiting: true })
        let user = await firebase.auth().signInWithEmailAndPassword(email, password);
        console.log('The user', user)
        this.setState({ isWaiting: false })
        if (user)
            return this.props.navigation.navigate('EventList')
    }

    _checkSignIn = () => {
        const { email, password } = this.state;
        // Check email
        if (!ValidateEmail(email))
            return this.setState({ emailError: 'A proper email please!' })

        // Check password and repassword
        if (password.length < 6)
            return this.setState({ passwordError: 'Password is less than 6 characters!' })

        // Everything is ok, let's create account
        this.handleSignIn()
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Sign in with your email and password</Text>
                <View style={{ alignSelf: 'stretch', paddingHorizontal: 20 }}>
                    <Input
                        placeholder='Enter Email'
                        leftIcon={{ type: 'font-awesome', name: 'chevron-right' }}
                        onChangeText={email => this.setState({ email, emailError: ' ' })}
                        value={this.state.email}
                        disabled={this.state.isWaiting}
                        errorMessage={this.state.emailError}
                    />
                    <Input
                        placeholder='Enter Password'
                        secureTextEntry
                        leftIcon={{ type: 'font-awesome', name: 'chevron-right' }}
                        onChangeText={password => this.setState({ password, passwordError: ' ' })}
                        value={this.state.password}
                        disabled={this.state.isWaiting}
                        errorMessage={this.state.passwordError}
                    />
                    <View style={{ alignSelf: 'stretch', alignItems: 'flex-end' }}>
                        <Button
                            title="Sign in"
                            onPress={this._checkSignIn}
                            disabled={this.state.isWaiting}
                        />
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'blue',

    }
})

export default SignInScreen;