import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '../components/AppText';
import { Input, Button, Text } from 'react-native-elements';
import firebase from 'react-native-firebase';

class SignUpScreen extends Component {
    state = { user: '', email: '', password: '' }

    handleSignUp = async () => {
        const { email, password } = this.state;
        console.log('email and password', email, password);
        let user = await firebase.auth().createUserWithEmailAndPassword(email, password)
        console.log('New user', user)
        this.setState({ user: JSON.stringify(user) })
    }

    signOut = async () => {
        await firebase.auth().signOut();
        this.setState({ user: 'Emptied' })
    }

    checkUser = async () => {
        const { email } = this.state;
        let result = await firebase.auth().fetchSignInMethodsForEmail(email);
        console.log('fetchSignInMethodsForEmail', result)
        if (result.length == 0)
            this.props.navigation.navigate('Register', { email })
        else if (result.length > 0)
            this.props.navigation.navigate('SignIn', { email })

    }

    render() {
        return (
            <View style={styles.container}>
                <Text>User: {this.state.user}</Text>
                <View style={{ alignSelf: 'stretch', borderWidth: 4 }}>
                    <Input
                        placeholder='Enter Email'
                        leftIcon={{ type: 'font-awesome', name: 'chevron-right' }}
                        onChangeText={email => this.setState({ email })}
                        value={this.state.email}
                    />
                </View>
                <View style={{ alignSelf: 'stretch', flexDirection: 'row', borderWidth: 2, justifyContent: 'space-evenly' }}>
                    <Button
                        title="Next"
                        onPress={this.checkUser}
                    />
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

export default SignUpScreen;