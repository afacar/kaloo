import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import AppText from '../components/AppText';
import { Input, Button, Avatar, Icon } from 'react-native-elements';
import firebase from "react-native-firebase";
import ImagePicker from "react-native-image-picker";

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

class ProfileScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerRight: () => (
            <Button
                buttonStyle={{ backgroundColor: 'grey', marginRight: 10 }}
                title='Signout'
                iconRight
                icon={<Icon
                    type='material-community'
                    name='logout'
                    containerStyle={{ marginLeft: 10 }}
                />}
                onPress={() => auth.signOut()}
            />

        )
    });

    user = firebase.auth().currentUser
    state = {
        email: this.user.email,
        displayName: this.user.displayName,
        photoURL: this.user.photoURL,
        isNameChanged: false,
        isAvatarChanged: false,
        isWaiting: false,
    }

    componentDidMount() { }

    handleProfileUpdate = async () => {
        let { displayName, photoURL, isAvatarChanged, isNameChanged, pickerResponse } = this.state;
        let newProfile = {}
        let isResizedImage = true;
        this.setState({ isWaiting: true })
        if (isAvatarChanged) {
            // Upload new Avatar to Storage
            newProfile.photoURL = photoURL
            console.log('uploading avatar...')
            let avatarRef = storage.ref(`users/${this.user.uid}/avatar/${this.user.uid}.jpg`)
            try {
                await avatarRef.putFile(pickerResponse.path);
                let newPhotoURL = await avatarRef.getDownloadURL()
                newProfile.photoURL = newPhotoURL
                isResizedImage = false
            } catch (err) {
                console.log('Err at New avatar upload!', err)
            }
            console.log('New avatar is uploaded!')
        }
        if (isNameChanged) {
            newProfile.displayName = displayName
        }

        // Update user @Authentication 
        await auth.currentUser.updateProfile(newProfile)
        // Update user @Firestore 
        let userRef = db.doc(`users/${this.user.uid}`)
        await userRef.set({ ...newProfile, isResizedImage }, { merge: true });
        console.log('user @db updated ', newProfile);
        this.setState({ isNameChanged: false, isAvatarChanged: false, isWaiting: false })
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
        const { photoURL, isAvatarChanged, isNameChanged, isWaiting } = this.state
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
                <View style={{ alignSelf: 'stretch', padding: 25 }}>
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
                <View style={{ alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'center' }}>
                    <Button
                        buttonStyle={{ backgroundColor: 'grey' }}
                        title={isWaiting ? "Updating..." : 'Update'}
                        onPress={this.handleProfileUpdate}
                        disabled={!isNameChanged && !isAvatarChanged || isWaiting}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
        justifyContent: 'flex-start',
        alignItems: 'center'
    }
})

export default ProfileScreen;