import React, { Component } from 'react';
import { View, StyleSheet, Alert, Text, ScrollView, TouchableOpacity, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import AppText from '../components/AppText';
import { Input, Button, Avatar, CheckBox } from 'react-native-elements';
import firebase, { functions } from "react-native-firebase";
import ImagePicker from "react-native-image-picker";

const db = firebase.firestore();
const DEFAULT_PROFILE_PIC = 'https://firebasestorage.googleapis.com/v0/b/influenceme-dev.appspot.com/o/assets%2Fprofile-icon.png?alt=media&token=89765144-f9cf-4539-abea-c9d5ac0b3d2d'

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
        displayNameMessage: '',
        emailMessage: '',
        passwordMessage: '',
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
            avatarRef.putFile(imagePickerResponse.path)
            //photoURL = await avatarRef.getDownloadURL()
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
            return this.setState({ displayNameMessage: 'We need a name!' })
        //return AlertUser('We need a name!', 'Any name to show people :>')
        // Check email
        if (!ValidateEmail(email))
            return this.setState({ emailMessage: 'Check email!' })
        //return AlertUser('Check email!', 'Your email seems a bit awkward, can you check it again :>')

        // Check password and repassword
        if (password !== repassword || password.length < 6)
            return this.setState({ passwordMessage: 'Check password!' })
        //return AlertUser('Check password!', 'Password shoud be at least 6 chars and same with repassword!')

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
        const { displayName, email, password, repassword, photoURL, isWaiting, displayNameMessage, emailMessage, passwordMessage } = this.state
        return (
            <KeyboardAvoidingView style={styles.container}>
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between', paddingHorizontal: 40, paddingVertical: 10, alignItems: 'center' }} >
                    <View style={{ alignContent: 'center', backgroundColor: '#9fa9a3', borderRadius: 10, paddingHorizontal: 10 }}>
                        <Text style={{ textAlign: 'center' }}>If you’re here to join a show with a ticket, you don’t need to register.</Text>
                    </View>
                    <View style={{ alignSelf: 'stretch', alignItems:'center' }}>
                        <Avatar
                            onPress={this.onAvatarPressed}
                            size='large'
                            rounded={true}
                            showEditButton={true}
                            source={{ uri: photoURL || DEFAULT_PROFILE_PIC }}
                        />
                        <Input
                            placeholder='Display name'
                            leftIcon={{ type: 'material-community', name: 'account-circle' }}
                            onChangeText={displayName => this.setState({ displayName, displayNameMessage: '' })}
                            value={displayName}
                            errorMessage={displayNameMessage}
                            disabled={isWaiting}
                        />
                        <Input
                            placeholder='Enter Email'
                            leftIcon={{ type: 'material-community', name: 'email' }}
                            onChangeText={email => this.setState({ email, emailMessage: '' })}
                            value={email}
                            keyboardType='email-address'
                            errorMessage={emailMessage}
                            disabled={isWaiting}
                        />
                        <Input
                            placeholder='Password'
                            leftIcon={{ type: 'material-community', name: 'lock' }}
                            onChangeText={password => this.setState({ password, passwordMessage: '' })}
                            value={password}
                            errorMessage={passwordMessage}
                            secureTextEntry
                            disabled={isWaiting}
                        />
                        <Input
                            placeholder='Repassword'
                            leftIcon={{ type: 'material-community', name: 'lock' }}
                            onChangeText={repassword => this.setState({ repassword })}
                            value={repassword}
                            secureTextEntry
                            disabled={isWaiting}
                        />
                        <View style={{ alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'center' }}>
                            <CheckBox
                                title='I accept privacy and legal terms'
                                checked={this.state.terms}
                                onPress={() => this.setState({ terms: !this.state.terms })}
                            />
                            <Button
                                buttonStyle={{ backgroundColor: 'grey', borderWidth: 2, borderColor: 'black' }}
                                title="Create My Account"
                                onPress={this.checkAccount}
                                disabled={isWaiting}
                            />
                        </View>
                    </View>
                    <View style={{ alignItems: 'center', flexDirection: 'column' }}>
                        <Text>Already Registered?</Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('SignIn', { email })} >
                            <Text style={{ textDecorationLine: 'underline' }}>SignIn Here</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
})

export default RegisterScreen;