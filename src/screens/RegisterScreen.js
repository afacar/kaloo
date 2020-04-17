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
import { SafeAreaView } from 'react-navigation';
import { connect } from "react-redux";

import { HighlightedText, Label, BoldLabel } from '../components/Labels';
import { validateEmail } from '../utils/Utils'
import { ClickableText, HyperLink, DefaultButton } from '../components/Buttons';


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
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : ''} style={styles.container}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: 'center',
              backgroundColor: "#3598FE"
            }}>
            <View style={styles.componentStyle}>
              <BoldLabel label='Register' />
              <HighlightedText text="You only need an account if you’re planning to host a paid meeting. " />
              <View style={{ flexDirection: 'row', alignItems: "center", marginBottom: 5 }}>
                <Avatar
                  rounded
                  size="large"
                  //icon={{name: 'camera-outline', type: 'material-community', color:"#E7E7E7"}}
                  overlayContainerStyle={{ backgroundColor: 'white', borderWidth: 1, borderColor: "#E7E7E7" }}
                  onPress={this.onImagePicker}
                  containerStyle={{ marginRight: 20 }}
                  //showEditButton={true}
                  source={{ uri: photoURL }}
                />
                <ClickableText text="Pick a profile picture" onPress={this.onImagePicker} />
              </View>
              <Input
                placeholder="Enter Your email"
                placeholderTextColor="#b2c2bf"
                onChangeText={email => this.setState({ email, emailMessage: '' })}
                value={email}
                keyboardType="email-address"
                errorMessage={emailMessage}
                disabled={isWaiting}
                inputContainerStyle={styles.inputContainerStyle}
                containerStyle={{ paddingHorizontal: 0, marginTop: 10 }}
                leftIcon={{ type: 'material-community', name: 'email-outline', color: "#909090" }}
                leftIconContainerStyle={{ paddingHorizontal: 10, marginLeft: 0 }}
              />
              <Input
                placeholder="Enter your display name"
                placeholderTextColor="#b2c2bf"
                onChangeText={displayName => this.setState({ displayName, displayNameMessage: '' })}
                value={displayName}
                errorMessage={displayNameMessage}
                disabled={isWaiting}
                inputContainerStyle={styles.inputContainerStyle}
                containerStyle={{ paddingHorizontal: 0, marginTop: 10 }}
                leftIcon={{ type: 'material-community', name: 'account', color: "#909090" }}
                leftIconContainerStyle={{ paddingHorizontal: 10, marginLeft: 0 }}
              />
              <Input
                placeholder="Enter Your password"
                placeholderTextColor="#b2c2bf"
                onChangeText={password => this.setState({ password, passwordMessage: '' })}
                value={password}
                errorMessage={passwordMessage}
                secureTextEntry
                disabled={isWaiting}
                inputContainerStyle={styles.inputContainerStyle}
                containerStyle={{ paddingHorizontal: 0, marginTop: 10 }}
                leftIcon={{ type: 'material-community', name: 'key-variant', color: "#909090" }}
                leftIconContainerStyle={{ paddingHorizontal: 10, marginLeft: 0 }}
              />
              <Input
                placeholder="Repeat Your password"
                placeholderTextColor="#b2c2bf"
                onChangeText={repassword => this.setState({ repassword })}
                value={repassword}
                secureTextEntry
                disabled={isWaiting}
                inputContainerStyle={styles.inputContainerStyle}
                containerStyle={{ paddingHorizontal: 0, marginTop: 10 }}
                leftIcon={{ type: 'material-community', name: 'key-variant', color: "#909090" }}
                leftIconContainerStyle={{ paddingHorizontal: 10, marginLeft: 0 }}
              />
              <View style={styles.checkBoxStyle}>
                <CheckBox
                  //title="By checking this box I aggree with terms and conditions."
                  checked={this.state.terms}
                  onPress={() => !isWaiting && this.setState({ terms: !this.state.terms })}
                  containerStyle={{ backgroundColor: 'transparent', borderColor: 'transparent', marginLeft: 0 }}
                  uncheckedColor='#3598FE'
                  checkedColor='#3598FE'
                />
                <View style={{ justifyContent: 'center' }}>
                  <Text>By checking this box I aggree with</Text>
                  <HyperLink text="terms and conditions" />
                </View>
              </View>

              <Text style={{ color: 'red', paddingVertical: 2 }}>{termsMessage || emailMessage}</Text>
              <View style={{ paddingBottom: 20 }}>
                <DefaultButton
                  title="Register"
                  onPress={this.checkAccount}
                  disabled={isWaiting} />
              </View>
              <View style={styles.contactUs}>
                <ClickableText onPress={() => { }} text="Have a problem?" />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
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
    flexDirection: 'row',
  },
  buttonStyle: {
    backgroundColor: '#196BFF',
    borderRadius: 6,
    paddingVertical: 15
  },
  componentStyle: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignSelf: 'stretch',
    paddingVertical: 20,
    backgroundColor: "white",
    borderTopRightRadius: 26,
    borderTopLeftRadius: 26,
  },
  inputContainerStyle: {
    borderWidth: 0.7,
    borderColor: '#909090',
    borderRadius: 6,
    paddingVertical: 5,

  },
  contactUs: {
    position: 'absolute', //Here is the trick
    bottom: 0, //Here is the trick
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 10
  }
});

const mapStateToProps = ({ auth, assets }) => {
  return { profile: auth.profile, assets: assets.assets }
}

export default connect(mapStateToProps, null)(RegisterScreen);
