import React, { Component } from 'react';
import { View, StyleSheet, Alert, Text, ScrollView } from 'react-native';
import AppText from '../components/AppText';
import { Input, Button, Avatar, CheckBox } from 'react-native-elements';
import firebase, { functions } from "react-native-firebase";
import ImagePicker from "react-native-image-picker";

const db = firebase.firestore();
const DEFAULT_PROFILE_PIC = 'https://firebasestorage.googleapis.com/v0/b/influenceme-dev.appspot.com/o/assets%2Fprofile.png?alt=media&token=16ac53b5-b273-4731-aeb5-50dee2533651'

function AlertUser(title, message) {
    Alert.alert(title, message,
        [
            { text: 'Ok! I will try my best', onPress: () => { } },
        ],
    )
}

function ValidateEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return (true)
    }
    //AlertUser('Check  your email!', 'Your email seems a bit awkward!')
    return (false)
}

class RegisterScreen extends Component {
    state = {
        displayName: '',
        email: '',
        password: '',
        repassword: '',
        photoURL: DEFAULT_PROFILE_PIC,
        imagePickerResponse: null,
        isWaiting: false,
    }

    componentDidMount() { }

    createAccount = async () => {
        let { displayName, email, password, photoURL, imagePickerResponse } = this.state;
        console.log('creates account with email and password')
        await firebase.auth().createUserWithEmailAndPassword(email, password)
        const { currentUser } = firebase.auth()
        console.log('user is created', currentUser);
        let isResizedImage = true;
        // Upload new profile pict if it is new
        if (photoURL !== DEFAULT_PROFILE_PIC) {
            isResizedImage = false;
            console.log('uploading avatar...')
            let avatarRef = firebase.storage().ref(`users/${currentUser.uid}/avatar/${currentUser.uid}.jpg`)
            await avatarRef.putFile(imagePickerResponse.path)
            photoURL = await avatarRef.getDownloadURL()
            console.log('avatar is uploaded!')
        }
        // Update user profile @Authentication
        console.log('update profile', displayName, photoURL)
        await currentUser.updateProfile({ displayName, photoURL });
        // Create user @Firestore
        let userRef = db.doc(`users/${currentUser.uid}`)
        let userStatsRef = db.doc('users/--stats--');

        db.runTransaction(async function (transaction) {
            // This code may get re-run multiple times if there are conflicts.
            return transaction.get(userStatsRef).then(function (userStatsDoc) {
                // Set an initial value for event number
                let userNumber = 0
                if (userStatsDoc.exists) {
                    userNumber = userStatsDoc.data().counter + 1;
                }
                // Increment counter and write user to @Firestore
                transaction.set(userStatsRef, { counter: userNumber }, { merge: true });
                transaction.set(userRef, { email, displayName, photoURL, userNumber, isResizedImage }, { merge: true });
            });
        }).then(() => {
            // Navigate user to Event List
            this.props.navigation.navigate('EventList', { displayName })
        }).catch((error) => {
            console.log("User create failed: ", error);
        });
        this.setState({ isWaiting: false })
    }

    checkAccount = async () => {
        const { displayName, email, password, repassword } = this.state;
        // Check display name
        if (!displayName)
            return AlertUser('We need a name!', 'Any name to show people :>')
        // Check email
        if (!ValidateEmail(email))
            return AlertUser('Check email!', 'Your email seems a bit awkward, can you check it again :>')

        // Check password and repassword
        if (password !== repassword || password.length < 6)
            return AlertUser('Check password!', 'Password shoud be at least 6 chars and same with repassword!')

        // Check if account exists already
        this.setState({ isWaiting: true })
        let result = await firebase.auth().fetchSignInMethodsForEmail(email);
        console.log('fetchSignInMethodsForEmail', result)
        if (result.length > 0) {
            this.setState({ isWaiting: false })
            return AlertUser('Consider Sign in!', `It looks like you already have account with ${email}`)
        }

        // Everything is ok, let's create account
        this.createAccount()
    }

    onAvatarPressed = () => {
        if (this.state.isWaiting) return;
        var customButtons = [];
        /* if (this.state.profile.photoURL !== strings.DEFAULT_PROFILE_PIC) {
          customButtons = [{
            name: 'DeleteButton',
            title: 'Fotoğrafı Sil'
          }]
        } */
        const options = {
            title: 'Upload Foto',
            chooseFromLibraryButtonTitle: 'From Lib',
            takePhotoButtonTitle: 'Open Cam',
            cancelButtonTitle: 'Close',

            customButtons: customButtons,
            mediaType: 'photo',
            storageOptions: {
                skipBackup: true,
                path: 'images',
                allowsEditing: true,
                cameraRoll: true,
                path: Platform.OS == 'ios' ? 'Documents/ConsultMe Images/ProfilePictures' : 'Pictures/ ConsultMe Images/ProfilePictures'
            },
        };

        ImagePicker.showImagePicker(options, async (response) => {
            console.log('response', response);
            if (response.didCancel) {
            }
            else if (response.error) {
            }
            else if (response.customButton) {
                const { user } = this.props;
                user.photoURL = strings.DEFAULT_PROFILE_PIC;
                this.setState({
                    disabled: false,
                    saveButtonTitle: saveButtonEnabledTitle
                })
            }
            else {
                if (Platform.OS === 'ios')
                    response.path = response.uri.replace("file://", '');
                console.log('response', response);
                this.setState({ photoURL: response.uri, imagePickerResponse: response })
                /*                  */
            }
        });
    }

    render() {
        const { displayName, email, password, repassword, photoURL, isWaiting } = this.state
        return (
            <ScrollView>
                <View style={styles.container}>
                    <Avatar
                        onPress={this.onAvatarPressed}
                        size='large'
                        rounded={true}
                        showEditButton={true}
                        source={{ uri: photoURL || DEFAULT_PROFILE_PIC }}
                    />
                    <View style={{ alignSelf: 'stretch', paddingHorizontal: 20 }}>
                        <Input
                            placeholder='Display name'
                            leftIcon={{ type: 'MaterialCommunity', name: 'account-circle' }}
                            onChangeText={displayName => this.setState({ displayName })}
                            value={displayName}
                            disabled={isWaiting}
                        />
                        <Input
                            placeholder='Enter Email'
                            leftIcon={{ type: 'MaterialCommunity', name: 'email' }}
                            onChangeText={email => this.setState({ email })}
                            value={email}
                            keyboardType='email-address'
                            disabled={isWaiting}
                        />
                        <Input
                            placeholder='Password'
                            leftIcon={{ type: 'MaterialCommunity', name: 'lock' }}
                            onChangeText={password => this.setState({ password })}
                            value={password}
                            secureTextEntry
                            disabled={isWaiting}
                        />
                        <Input
                            placeholder='Repassword'
                            leftIcon={{ type: 'MaterialCommunity', name: 'lock' }}
                            onChangeText={repassword => this.setState({ repassword })}
                            value={repassword}
                            secureTextEntry
                            disabled={isWaiting}
                        />
                    </View>
                    <View style={{ alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'center' }}>
                        <CheckBox
                            title='I accept terms'
                            checked={this.state.terms}
                            onPress={() => this.setState({ terms: !this.state.terms })}
                        />
                        <Button
                            title="Create My Account"
                            onPress={this.checkAccount}
                            disabled={isWaiting}
                        />
                    </View>
                    <View style={{ alignSelf: 'stretch', flexDirection: 'row', borderWidth: 2, justifyContent: 'space-evenly' }}>
                        <Text>or Signin if you have account</Text>
                        <Button
                            title="Sign In"
                            onPress={() => this.props.navigation.navigate('SignIn', { email })}
                        />
                    </View>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 10
    }
})

export default RegisterScreen;