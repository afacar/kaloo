import React, { Component } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, KeyboardAvoidingView, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Input, Button, Avatar, Icon } from 'react-native-elements';
import { firestore, auth, storage } from "react-native-firebase";
import ImagePicker from "react-native-image-crop-picker";
import { ClickableText } from '../components/Buttons';
import { ContactUs } from '../components/ContactUs';
import HeaderLeft from '../components/Headers/HeaderLeft';
import { colors } from '../constants';
import { AppText } from '../components/Labels';

const db = firestore();

class ProfileScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerStyle: { backgroundColor: colors.BLUE, borderBottomWidth: 0, elevation: 0, shadowOpacity: 0 },
        headerTitle: () => null,
        headerLeft: () => (
            <HeaderLeft onPress={navigation.goBack} />
        ),
        headerRight: () => (
            <View style={{ marginRight: 10 }}>
                <ClickableText color='white' text='Logout' onPress={() => auth().signOut()} />
            </View>
        )
    });

    user = auth().currentUser
    state = {
        email: this.user.email,
        displayName: this.user.displayName,
        photoURL: this.user.photoURL,
        isNameChanged: false,
        isAvatarChanged: false,
        saveLoading: false,
    }

    componentDidMount() { }

    handleProfileUpdate = async () => {
        let { displayName, photoURL, isAvatarChanged, isNameChanged } = this.state;
        let newProfile = {}
        let isResizedImage = true;
        this.setState({ saveLoading: true })
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
        this.setState({ isNameChanged: false, isAvatarChanged: false, saveLoading: false })
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
        const { email, displayName, photoURL, isAvatarChanged, isNameChanged, saveLoading } = this.state
        return (
            <KeyboardAvoidingView style={styles.container}>
                <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 40, paddingVertical: 10, borderTopLeftRadius: 16, borderTopRightRadius: 16, backgroundColor: 'white' }} >
                    <View style={{ alignItems: 'flex-start', marginTop: 20 }}>
                        <AppText style={{ fontSize: 28, fontWeight: 'bold' }}> Edit Profile</AppText>
                    </View>
                    <View style={{ marginTop: 20, flexDirection: 'row', width: '100%', }}>
                        <Avatar
                            renderPlaceholderContent={<ActivityIndicator />}
                            containerStyle={{ alignSelf: 'flex-start' }}
                            size='xlarge'
                            rounded={true}
                            source={{ uri: photoURL }}
                        />
                        <View style={{ alignSelf: 'center', justifyContent: 'center', marginLeft: 60, }}>
                            <TouchableOpacity onPress={this.onImagePicker} >
                                <Text style={{ fontSize: 18, color: colors.BLUE }}>Change Profile Picture</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <AppText>Name</AppText>
                        <Input
                            placeholder='Display name'
                            onChangeText={displayName => this.setState({ displayName, isNameChanged: true })}
                            value={displayName}
                            containerStyle={{ borderWidth: 1, borderRadius: 6, marginTop: 8 }}
                            inputContainerStyle={{ borderBottomWidth: 0 }}
                        />
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <AppText>E-mail</AppText>
                        <Input
                            placeholder='Enter Email'
                            leftIcon={{ type: 'material-community', name: 'email' }}
                            value={email}
                            disabled
                            containerStyle={{ borderWidth: 1, borderRadius: 6, marginTop: 8 }}
                            inputContainerStyle={{ borderBottomWidth: 0 }}
                        />
                    </View>

                    <Button
                        title={isNameChanged ? 'Save Changes' : 'Edit Your Profile'}
                        buttonStyle={styles.saveButton}
                        containerStyle={styles.saveButtonContainer}
                        onPress={this.handleProfileUpdate}
                        loading={saveLoading}
                        disabled={!(isNameChanged || isAvatarChanged)}
                    />

                    <View style={{ position: 'absolute', bottom: 24, alignSelf: 'center' }}>
                        <ContactUs title='Need Help?' screen='Profile' />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.BLUE
    },
    saveButtonContainer: {
        position: 'absolute',
        alignSelf: 'center',
        bottom: 72,
    },
    saveButton: {
        backgroundColor: colors.CYAN,
        width: 300,
        height: 50,
        borderRadius: 16,
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default ProfileScreen;