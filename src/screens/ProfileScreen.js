import React, { Component } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, KeyboardAvoidingView, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Input, Button, Avatar, Icon } from 'react-native-elements';
import { firestore, auth, storage } from "react-native-firebase";
import ImagePicker from "react-native-image-crop-picker";
import { HyperLink } from '../components/Buttons';
import { ClickableText } from '../components/Buttons';

const db = firestore();

class ProfileScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerRight: () => (
            <Button
                buttonStyle={{ marginRight: 10 }}
                title='Wallet'
                titleStyle={{ color: 'grey' }}
                type='clear'
                iconRight
                icon={<Icon
                    type='material-community'
                    name='wallet-outline'
                    color='grey'
                    containerStyle={{ marginLeft: 5 }}
                />}
                onPress={() => navigation.navigate('Balance')}
            />

        )
    });

    user = auth().currentUser
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
        let { displayName, photoURL, isAvatarChanged, isNameChanged } = this.state;
        let newProfile = {}
        let isResizedImage = true;
        this.setState({ isWaiting: true })
        if (isAvatarChanged) {
            // Upload new Avatar to @Storage
            newProfile.photoURL = photoURL
            console.log('uploading avatar...')
            let avatarRef = storage().ref(`users/${this.user.uid}/avatar/${this.user.uid}.jpg`)
            try {
                await avatarRef.putFile(photoURL);
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
        await auth().currentUser.updateProfile(newProfile)
        // Update user @Firestore 
        let userRef = db.doc(`users/${this.user.uid}`)
        await userRef.set({ ...newProfile, isResizedImage }, { merge: true });
        console.log('user @db updated ', newProfile);
        this.setState({ isNameChanged: false, isAvatarChanged: false, isWaiting: false })
    }

    onImagePicker = () => {
        ImagePicker.openPicker({
            path: 'my-profile-image.jpg',
            width: 200,
            height: 200,
            cropping: true,
        }).then(image => {
            console.log(image);
            if (Platform.OS === 'ios')
                image.path = image.path.replace('file://', '');
            console.log('picked image', image);
            this.setState({ photoURL: image.path, imagePickerResponse: image, isAvatarChanged: true });
        }).catch(err => console.log('image-picker err:', err))
    }

    render() {
        const { email, displayName, photoURL, isAvatarChanged, isNameChanged, isWaiting } = this.state
        return (
            <KeyboardAvoidingView style={styles.container}>
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between', paddingHorizontal: 40, paddingVertical: 10, alignItems: 'center' }} >
                    <View style={{ alignSelf: 'stretch', alignItems: 'center' }}>
                        <Avatar
                            //onPress={this.onAvatarPressed}
                            renderPlaceholderContent={<ActivityIndicator />}
                            onEditPress={this.onImagePicker}
                            size='xlarge'
                            rounded={true}
                            showEditButton={true}
                            source={{ uri: photoURL }}
                        />
                        <Input
                            placeholder='Enter Email'
                            leftIcon={{ type: 'material-community', name: 'email' }}
                            //onChangeText={email => this.setState({ email })}
                            value={email}
                            disabled
                        />
                        <Input
                            placeholder='Display name'
                            leftIcon={{ type: 'material-community', name: 'account-circle' }}
                            onChangeText={displayName => this.setState({ displayName, isNameChanged: true })}
                            value={displayName}
                        />
                        <View style={{ alignSelf: 'stretch', marginTop: 15 }}>
                            <Button
                                buttonStyle={{ backgroundColor: 'grey' }}
                                title={isWaiting ? "Updating..." : 'Update'}
                                onPress={this.handleProfileUpdate}
                                disabled={!isNameChanged && !isAvatarChanged || isWaiting}
                            />
                        </View>
                    </View>
                    <View style={{ alignSelf: 'stretch', justifyContent: 'space-around', flexDirection: 'row' }}>
                        <ClickableText text='Log out' onPress={() => auth().signOut()} />
                        <HyperLink text='Need Help?' link={`mailto:support@speechtext.io?subject=${auth().currentUser.uid}`} />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})

export default ProfileScreen;