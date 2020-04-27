import React, { Component } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, KeyboardAvoidingView, ScrollView, TouchableOpacity } from 'react-native';
import { Input, Avatar } from 'react-native-elements';
import { auth, storage, functions } from "react-native-firebase";
import ImagePicker from "react-native-image-crop-picker";
import { connect } from 'react-redux';

import * as actions from '../appstate/actions/auth_actions'
import { DefaultButton } from '../components/Buttons';
import { ErrorLabel } from "../components/Labels";
import { ContactUs } from '../components/ContactUs';
import HeaderLeft from '../components/Headers/HeaderLeft';
import { colors } from '../constants';
import { AppText, BoldLabel } from '../components/Labels';
import { SafeAreaView } from 'react-navigation'
import { WaitingModal } from '../components/Modals';
import Logout from '../components/Headers/Logout';


class ProfileScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: () => null,
        headerLeft: () => <HeaderLeft onPress={navigation.goBack} />,
        headerRight: () => <Logout />
    });

    state = {
        ...this.props.profile,
        isNameChanged: false,
        isAvatarChanged: false,
        isWaiting: false,
        errorMessage: ''
    }

    handleProfileUpdate = async () => {
        let { uid, displayName, photoURL, isAvatarChanged } = this.state;
        let newProfile = { uid, displayName, photoURL }
        this.setState({ errorMessage: '', isWaiting: true })

        if (isAvatarChanged) {
            // Upload new Avatar to @Storage
            newProfile.photoURL = photoURL
            let avatarRef = storage().ref(`users/${uid}/avatar/${uid}.jpg`)
            try {
                await avatarRef.putFile(photoURL);
                let newPhotoURL = await avatarRef.getDownloadURL()
                newProfile.photoURL = newPhotoURL
            } catch (error) {
                console.log('Err at New avatar upload!', error)
                return this.setState({ errorMessage: error.message })
            }
        }

        // Update user @Authentication 
        auth().currentUser.updateProfile(newProfile)

        // Update user @Firestore
        try {
            let updateProfile = functions().httpsCallable('updateProfile');
            let result = await updateProfile(newProfile)
            if (result.data.state === 'ERROR') {
                return this.setState({
                    isWaiting: false,
                    errorMessage: result.data.message
                })
            }
        } catch (error) {
            return this.setState({ isWaiting: false, errorMessage: error.message })
        }
        this.props.setUserProfile()
        this.setState({ isNameChanged: false, isAvatarChanged: false, isWaiting: false })
    }

    onImagePicker = () => {
        ImagePicker.openPicker({
            path: 'my-profile-image.jpg',
            width: 200,
            height: 200,
            cropping: true,
        }).then(image => {
            if (Platform.OS === 'ios')
                image.path = image.path.replace('file://', '');
            this.setState({ photoURL: image.path, imagePickerResponse: image, isAvatarChanged: true });
        }).catch(err => console.log('image-picker err:', err))
    }

    _checkProfile = () => {
        const { displayName } = this.state;
        if (!displayName)
            return this.setState({ errorMessage: 'We need a display name' })
        this.handleProfileUpdate()
    }

    render() {
        const { email, displayName, photoURL, isAvatarChanged, isNameChanged, isWaiting, errorMessage } = this.state
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.container}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 40, paddingVertical: 10, borderTopLeftRadius: 26, borderTopRightRadius: 26, backgroundColor: 'white' }} >
                        <View style={{ flex: 1, justifyContent: 'space-between', }}>
                            <View>
                                <View style={{ alignItems: 'flex-start', marginTop: 20 }}>
                                    <AppText style={{ fontSize: 28, fontWeight: 'bold' }}> Edit Profile</AppText>
                                </View>
                                <View style={{ marginTop: 20, flexDirection: 'row', width: '100%', marginBottom: 20 }}>
                                    <Avatar
                                        renderPlaceholderContent={<ActivityIndicator />}
                                        containerStyle={{ alignSelf: 'flex-start' }}
                                        size='large'
                                        rounded={true}
                                        source={{ uri: photoURL }}
                                    />
                                    <View style={{ alignSelf: 'center', justifyContent: 'center', marginLeft: 20, }}>
                                        <TouchableOpacity onPress={this.onImagePicker} >
                                            <Text style={{ fontSize: 18, color: colors.BLUE }}>Change Profile Picture</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <BoldLabel label="Name" />
                                <Input
                                    placeholder='Display name'
                                    onChangeText={displayName => this.setState({ displayName, isNameChanged: true })}
                                    value={displayName}
                                    inputContainerStyle={styles.inputContainerStyle}
                                    containerStyle={{ paddingHorizontal: 0 }}
                                />
                                <BoldLabel label="E-mail" />
                                <Input
                                    placeholder='Enter Email'
                                    value={email}
                                    disabled
                                    inputContainerStyle={styles.inputContainerStyle}
                                    containerStyle={{ paddingHorizontal: 0 }}
                                />
                            </View>
                            <View>
                                <ErrorLabel label={errorMessage} />
                                <DefaultButton
                                    title='Save Changes'
                                    onPress={this._checkProfile}
                                    disabled={!(isNameChanged || isAvatarChanged)}
                                //loading={isWaiting}
                                />
                                <ContactUs title='Need Help?' screen='Profile' />
                                <WaitingModal isWaiting={isWaiting} text='Just a second...' />
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
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
    },
    inputContainerStyle: {
        borderWidth: 0.7,
        borderColor: '#909090',
        borderRadius: 6,
        paddingHorizontal: 10
        //paddingVertical: 5,

    },
})

const mapStateToProps = ({ auth }) => {
    return { profile: auth.profile }
}

export default connect(mapStateToProps, actions)(ProfileScreen);