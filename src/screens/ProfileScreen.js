import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '../components/AppText';
import { Input, Button } from 'react-native-elements';
import firebase from "react-native-firebase";

const db = firebase.firestore();

class ProfileScreen extends Component {
    user = firebase.auth().currentUser
    state = { email: this.user.email, displayName: this.user.displayName }

    handleProfileUpdate = async () => {
        const { displayName } = this.state;
        console.log('user before', this.user)
        console.log('this.state', this.state)
        let userRef = db.doc(`users/${this.user.uid}`)
        await firebase.auth().currentUser.updateProfile({ displayName })
        await userRef.set({
            displayName
        }, { merge: true });
        console.log('user after', firebase.auth().currentUser);
    }

    render() {
        return (
            <View style={styles.container}>
                <AppText>Profile</AppText>
                <View style={{ alignSelf: 'stretch', borderWidth: 4 }}>
                    <Input
                        placeholder='Enter Email'
                        leftIcon={{ type: 'font-awesome', name: 'chevron-right' }}
                        onChangeText={email => this.setState({ email })}
                        value={this.state.email}
                    />
                    <Input
                        placeholder='Display name'
                        leftIcon={{ type: 'font-awesome', name: 'chevron-right' }}
                        onChangeText={displayName => this.setState({ displayName })}
                        value={this.state.displayName}
                    />
                </View>
                <View style={{ alignSelf: 'stretch', flexDirection: 'row', borderWidth: 2, justifyContent: 'space-evenly' }}>
                    <Button
                        title="Submit"
                        onPress={this.handleProfileUpdate}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center'
    }
})

export default ProfileScreen;