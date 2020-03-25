import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '../components/AppText';
import { Input, Button, Avatar } from 'react-native-elements';
import firebase from "react-native-firebase";
import ImagePicker from "react-native-image-picker";

const db = firebase.firestore();

class ProfileScreen extends Component {
    user = firebase.auth().currentUser
    state = { email: this.user.email, displayName: this.user.displayName, photoUrl: null }

    componentDidMount() {
        this.fetchProfile = db.doc(`users/${this.user.uid}`).get().then(function(doc) {
            if (doc.exists) {
                console.log("Document data:", doc.data());
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
    }

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
                this.setState({ photoUrl: response.uri })
                console.log('uploading avatar...')
                await firebase.storage().ref(`users/${this.user.uid}/avatar/${this.user.uid}.jpg`).putFile(response.path);
                console.log('avatar is uploaded!')

            }
        });
    }

    render() {
        const { photoUrl } = this.state
        return (
            <View style={styles.container}>
                <Avatar
                    onPress={this.onAvatarPressed}
                    size="xlarge"
                    rounded={true}
                    showEditButton={true}
                    source={photoUrl ? {uri: photoUrl} : require('../assets/profile.png')}
                />
                <View style={{ alignSelf: 'stretch', borderWidth: 4 }}>
                    <Input
                        placeholder='Enter Email'
                        leftIcon={{ type: 'font-awesome', name: 'chevron-right' }}
                        rightIcon={{ type: 'font-awesome', name: 'chevron-right' }}
                        onChangeText={email => this.setState({ email })}
                        value={this.state.email}
                        disabled
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