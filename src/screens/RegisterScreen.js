import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Text
} from 'react-native';
import { Input, Button, Avatar, CheckBox } from 'react-native-elements';
import { functions, storage, auth } from 'react-native-firebase';
import ImagePicker from 'react-native-image-crop-picker';
import { connect } from "react-redux";

import { HighlightedText, Label } from '../components/Labels';
import { validateEmail } from '../utils/Utils'


class RegisterScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerRight: () => (
      <Button
        type='clear'
        onPress={() => navigation.navigate('SignIn')}
        title={'Sign in'}
      />
    )
  });

  state = {
    displayName: '',
    email: '',
    password: '',
    repassword: '',
    terms: false,
    photoURL: this.props.assets.DEFAULT_PROFILE_IMAGE || null,
    imagePickerResponse: null,
    isWaiting: false,
    displayNameMessage: '',
    emailMessage: '',
    passwordMessage: '',
  };

  componentDidMount() { }

  createAccount = async () => {
    let { displayName, email, password, photoURL } = this.state;
    const { DEFAULT_PROFILE_IMAGE } = this.props.assets
    this.setState({ isWaiting: true });

    try {
      await auth().createUserWithEmailAndPassword(email, password);
      const { currentUser } = auth();
      const { uid } = currentUser

      // Upload new profile image to @Storage
      if (photoURL !== DEFAULT_PROFILE_IMAGE) {
        let avatarRef = storage().ref(`users/${uid}/avatar/${uid}.jpg`);
        await avatarRef.putFile(photoURL);
        photoURL = await avatarRef.getDownloadURL()
      }

      // Update user profile @Authentication
      await currentUser.updateProfile({ displayName, photoURL });
      // Create user @Firestore
      const newUser = { uid, displayName, photoURL }
      let createUser = functions().httpsCallable('createUser')
      await createUser(newUser)

      this.setState({ isWaiting: false });
      this.props.navigation.navigate('UserHome', { displayName });
    } catch (error) {
      this.setState({ isWaiting: false, termsMessage: error.message });
    }

  };

  checkAccount = async () => {
    const { displayName, email, password, repassword, terms } = this.state;
    // Set error messages to ''
    this.setState({ emailMessage: '', termsMessage: '', displayNameMessage: '', passwordMessage: '' })

    // Check terms
    if (!terms)
      return this.setState({ termsMessage: 'You must accepts terms to continue!' });

    // Check email
    if (!validateEmail(email))
      return this.setState({ emailMessage: 'Check email!' });

    // Check display name
    if (!displayName)
      return this.setState({ displayNameMessage: 'We need a name!' });

    // Check password and repassword
    if (password !== repassword || password.length < 6)
      return this.setState({ passwordMessage: 'Check password!' });

    // Everything is ok, let's create account
    this.createAccount();
  };

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
      this.setState({ photoURL: image.path, imagePickerResponse: image });
    }).catch(err => console.log('image-picker err:', err))
  }


  render() {
    const {
      displayName, email, password, repassword, photoURL, isWaiting, displayNameMessage, emailMessage, passwordMessage, termsMessage
    } = this.state;
    return (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : ''} style={styles.container}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'space-between',
            paddingHorizontal: 30,
            paddingVertical: 10,
            alignItems: 'center',
          }}>

          <HighlightedText text="You don’t need an account to watch." />
          <View style={{ alignSelf: 'stretch', paddingVertical: 20 }}>
            <Label label='Choose your profile picture' />
            <Avatar
              onPress={this.onImagePicker}
              size="large"
              avatarStyle={{ borderWidth: 1, borderColor: 'gray', borderRadius: 6, overflow: 'hidden' }}
              overlayContainerStyle={{ backgroundColor: "white" }}
              imageProps={{ borderRadius: 6 }}
              showEditButton={true}
              source={{ uri: photoURL }}
            />
            <Label label='E-Mail' />
            <Input
              placeholder="abc@abc.com"
              placeholderTextColor="#b2c2bf"
              onChangeText={email => this.setState({ email, emailMessage: '' })}
              value={email}
              keyboardType="email-address"
              errorMessage={emailMessage}
              disabled={isWaiting}
              inputContainerStyle={styles.inputContainerStyle}
              containerStyle={{ paddingHorizontal: 0 }}
            />

            <Label label='Full Name' />
            <Input
              placeholder="Name Surname"
              placeholderTextColor="#b2c2bf"
              onChangeText={displayName => this.setState({ displayName, displayNameMessage: '' })}
              value={displayName}
              errorMessage={displayNameMessage}
              disabled={isWaiting}
              inputContainerStyle={styles.inputContainerStyle}
              containerStyle={{ paddingHorizontal: 0 }}
            />

            <Label label='Password' />
            <Input
              placeholder="Password"
              placeholderTextColor="#b2c2bf"
              onChangeText={password => this.setState({ password, passwordMessage: '' })}
              value={password}
              errorMessage={passwordMessage}
              secureTextEntry
              disabled={isWaiting}
              inputContainerStyle={styles.inputContainerStyle}
              containerStyle={{ paddingHorizontal: 0 }}
            />
            <Label label='Repeat Password' />
            <Input
              placeholder="Repassword"
              placeholderTextColor="#b2c2bf"
              onChangeText={repassword => this.setState({ repassword })}
              value={repassword}
              secureTextEntry
              disabled={isWaiting}
              inputContainerStyle={styles.inputContainerStyle}
              containerStyle={{ paddingHorizontal: 0 }}
            />
            <View style={styles.checkBoxStyle}>
              <CheckBox
                title="I accept privacy and legal terms"
                checked={this.state.terms}
                onPress={() => !isWaiting && this.setState({ terms: !this.state.terms })}
                containerStyle={{ backgroundColor: 'transparent', borderColor: 'transparent' }}
                checkedColor='#3b3a30'
              />
              <Text style={{ color: 'red' }}>{termsMessage || emailMessage}</Text>
              <Button
                buttonStyle={styles.buttonStyle}
                title="Create My Account"
                onPress={this.checkAccount}
                disabled={isWaiting}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  inputContainerStyle: {
    borderWidth: 0.7,
    borderColor: '#3b3a30',
    borderRadius: 6,
    paddingHorizontal: 10,
    marginHorizontal: 0,
    paddingVertical: 5,
  },
  checkBoxStyle: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  buttonStyle: {
    backgroundColor: '#196BFF',
    borderRadius: 6,
    paddingVertical: 15
  }
});

const mapStateToProps = ({ auth, assets }) => {
  return { profile: auth.profile, assets: assets.assets }
}

export default connect(mapStateToProps, null)(RegisterScreen);
