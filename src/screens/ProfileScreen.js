import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import AppText from '../components/AppText';
import { Input, Button, Avatar } from 'react-native-elements';
import firebase from "react-native-firebase";
import ImagePicker from "react-native-image-picker";

const db = firebase.firestore();

class ProfileScreen extends Component {
    user = firebase.auth().currentUser
    state = {
        email: this.user.email,
        displayName: this.user.displayName,
        photoURL: this.user.photoURL,
        isNameChanged: false,
        isAvatarChanged: false
    }

    async componentDidMount() {
        let { photoURL } = this.state;
        let userDoc = await db.doc(`users/${this.user.uid}`).get()
        let { isResizedPhoto } = userDoc.data()
        if (!isResizedPhoto) {
            let avatarRef = firebase.storage().ref(`users/${this.user.uid}/avatar/${this.user.uid}_200x200.jpg`)
            let resizedPhoto = await avatarRef.getDownloadURL();
            if (resizedPhoto) {
                // Replace resized image with original one
                console.log('There is a resized image')
                await firebase.auth().currentUser.updateProfile({ photoURL: resizedPhoto })
                let userRef = db.doc(`users/${this.user.uid}`)
                await userRef.set({ photoURL: resizedPhoto, isResizedPhoto: true }, { merge: true });
                this.setState({ photoURL: resizedPhoto })
                console.log('Resized image is set')
            }
        }
    }

    handleProfileUpdate = async () => {
        let { displayName, photoURL, isAvatarChanged, isNameChanged, pickerResponse } = this.state;
        let newProfile = {}
        if (isAvatarChanged) {
            // Upload new Avatar to Storage
            console.log('uploading avatar...')
            let avatarRef = firebase.storage().ref(`users/${this.user.uid}/avatar/${this.user.uid}.jpg`)
            await avatarRef.putFile(pickerResponse.path);
            console.log('avatar is uploaded!')
            // TODO: We need to get compressed avatar later
            newProfile.photoURL = await avatarRef.getDownloadURL();
        }
        if (isNameChanged) {
            newProfile.displayName = displayName
        }
        // Update user @Authentication 
        await firebase.auth().currentUser.updateProfile(newProfile)
        console.log('user auth updated!', firebase.auth().currentUser)
        // Update user @Firestore 
        let userRef = db.doc(`users/${this.user.uid}`)
        newProfile.isResizedPhoto = false;
        await userRef.set({ ...newProfile }, { merge: true });
        console.log('user @db updated');
        this.setState({ isNameChanged: false, isAvatarChanged: false })
    }

    onAvatarPressed = () => {
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
                this.setState({ photoURL: response.uri, pickerResponse: response, isAvatarChanged: true })
            }
        });
    }

    render() {
        const { photoURL } = this.state
        return (
            <View style={styles.container}>
                <Avatar
                    //onPress={this.onAvatarPressed}
                    renderPlaceholderContent={<ActivityIndicator />}
                    onEditPress={this.onAvatarPressed}
                    size='xlarge'
                    rounded={true}
                    showEditButton={true}
                    source={{ uri: photoURL }}
                />
                <View style={{ alignSelf: 'stretch', paddingHorizontal: 25 }}>
                    <Input
                        placeholder='Enter Email'
                        leftIcon={{ type: 'MaterialCommunity', name: 'email' }}
                        //onChangeText={email => this.setState({ email })}
                        value={this.state.email}
                        disabled
                    />
                    <Input
                        placeholder='Display name'
                        leftIcon={{ type: 'MaterialCommunity', name: 'account-circle' }}
                        onChangeText={displayName => this.setState({ displayName, isNameChanged: true })}
                        value={this.state.displayName}
                    />
                </View>
                <View style={{ alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <Button
                        title="Submit"
                        onPress={this.handleProfileUpdate}
                        disabled={!this.state.isNameChanged && !this.state.isAvatarChanged}
                    />
                    <Button
                        title="Go to Balance"
                        onPress={() => this.props.navigation.navigate('Balance')}
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