import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '../components/AppText';
import { Input, Button, Text } from 'react-native-elements';
import firebase from 'react-native-firebase';

class RegisterScreen extends Component {
    email = this.props.navigation.getParam('email', '');
    state = { user: '', email: this.email, password: '', password2: '' }

    handleRegister = async () => {
        const { email, password, password2 } = this.state;
        console.log('email and password', email, password);
        let user = await firebase.auth().createUserWithEmailAndPassword(email, password)
        console.log('New user', user)
        this.props.navigation.navigate('Profile')
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
                        disabled
                    />
                    <Input
                        placeholder='Enter Password'
                        secureTextEntry
                        leftIcon={{ type: 'font-awesome', name: 'chevron-right' }}
                        onChangeText={password => this.setState({ password })}
                        value={this.state.password}
                    />
                    <Input
                        placeholder='Password again'
                        leftIcon={{ type: 'font-awesome', name: 'chevron-right' }}
                        onChangeText={password2 => this.setState({ password2 })}
                        value={this.state.password2}
                    />
                </View>
                <View style={{ alignSelf: 'stretch', flexDirection: 'row', borderWidth: 2, justifyContent: 'space-evenly' }}>
                    <Button
                        title="Submit"
                        onPress={this.handleRegister}
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

export default RegisterScreen;