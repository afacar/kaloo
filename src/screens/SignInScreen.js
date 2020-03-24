import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '../components/AppText';
import { Input, Button, Text } from 'react-native-elements';
import firebase from 'react-native-firebase';

class SignInScreen extends Component {
    email = this.props.navigation.getParam('email', '');
    state = { user:'', email: this.email, password: ''}

    handleSignIn = async () => {
        const { email, password } = this.state;
        console.log('email and password', email, password);
        let user = await firebase.auth().signInWithEmailAndPassword(email, password);
        console.log('The user', user)
        if (user) 
            return this.props.navigation.navigate('EventList')
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>User: {this.state.user}</Text>
                <View style={{ alignSelf: 'stretch', borderWidth: 4 }}>
                <Input
                    placeholder='Enter Email'
                    leftIcon={{ type: 'font-awesome', name: 'chevron-right' }}
                    onChangeText={email => this.setState({email})}
                    value={this.state.email}
                    disabled
                />
                <Input
                    placeholder='Enter Password'
                    secureTextEntry
                    leftIcon={{ type: 'font-awesome', name: 'chevron-right' }}
                    onChangeText={password => this.setState({password})}
                    value={this.state.password}
                />
                </View>
                <View style={{ alignSelf:'stretch', flexDirection: 'row', borderWidth: 2, justifyContent: 'space-evenly' }}>
                    <Button
                        title="Sign in"
                        onPress={this.handleSignIn}
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

export default SignInScreen;