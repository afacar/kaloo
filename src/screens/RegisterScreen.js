import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Text
} from 'react-native';
import { Input, Avatar, CheckBox } from 'react-native-elements';
import { functions, storage, auth } from 'react-native-firebase';
import ImagePicker from 'react-native-image-crop-picker';
import { SafeAreaView } from 'react-navigation';
import { connect } from "react-redux";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { setUserProfile } from "../appstate/actions/auth_actions";
import { setHostEventsListener } from "../appstate/actions/host_actions";

import { WaitingModal } from "../components/Modals";
import { HighlightedText, H1Label } from '../components/Labels';
import { validateEmail, checkAudioPermission, checkCameraPermission } from '../utils/Utils'
import { ClickableText, HyperLink, DefaultButton } from '../components/Buttons';
import { ContactUs } from '../components/ContactUs';
import HeaderLeft from '../components/Headers/HeaderLeft';
import HeaderRight from '../components/Headers/HeaderRight';
import CustomStatusBar from '../components/StatusBars/CustomStatusBar';
import { colors } from '../constants';
import MyAvatar from '../components/MyAvatar';


class RegisterScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: () => null,
    headerLeft: () => <HeaderLeft onPress={navigation.goBack} />,
    headerRight: () => <HeaderRight title='Sign in' onPress={() => navigation.navigate('SignIn')} />
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

  componentDidMount() {
    checkAudioPermission()
    checkCameraPermission()
  }

  createAccount = async () => {
    let { displayName, email, password, photoURL } = this.state;
    const { DEFAULT_PROFILE_IMAGE } = this.props.assets
    this.setState({ isWaiting: true });

    try {
      console.log('createUserWithEmailAndPassword...');

      await auth().createUserWithEmailAndPassword(email, password);
      const { currentUser } = auth();
      const { uid } = currentUser

      // Upload new profile image to @Storage
      if (photoURL !== DEFAULT_PROFILE_IMAGE) {
        console.log('uploading profile pic...');

        let avatarRef = storage().ref(`users/${uid}/avatar/${uid}.jpg`);
        await avatarRef.putFile(photoURL);
        console.log('Getting Download URL...');
        photoURL = await avatarRef.getDownloadURL()
      }

      console.log('currentUser.updateProfile...');

      // Update user profile @Authentication
      currentUser.updateProfile({ displayName, photoURL });
      // Create user @Firestore
      const newUser = { uid, displayName, photoURL }
      let createUser = functions().httpsCallable('createUser')
      console.log('creatingUser at db....');

      let result = await createUser(newUser)
      if (result.data.state === 'SUCCESS') {
        console.log('SUCCESSED and setting waitingstate to false');

        this.setState({ isWaiting: false });
        console.log('calling auth actions...');
        this.props.setHostEventsListener()
        this.props.setUserProfile()
        console.log('navigating UserHome');
        return this.props.navigation.navigate('UserHome', { displayName });
      } else {
        this.setState({ isWaiting: false, termsMessage: result.data.message });
      }
    } catch (error) {
      console.log('register error', error)
      this.setState({ isWaiting: false, termsMessage: error.message });
    }

  };

  checkAccount = async () => {
    const { displayName, email, password, repassword, terms } = this.state;
    // Set error messages to ''
    this.setState({ emailMessage: '', termsMessage: '', displayNameMessage: '', passwordMessage: '' })

    // Check email
    if (!validateEmail(email))
      return this.setState({ emailMessage: 'Check email format!' });

    // Check display name
    if (!displayName)
      return this.setState({ displayNameMessage: 'Enter a public display name!' });

    // Check password length
    if (password.length < 6)
      return this.setState({ passwordMessage: 'Password should be at least 6 characters!' });

    // Check password and repassword
    if (password !== repassword)
      return this.setState({ repasswordMessage: 'Passwords does not match!' });

    // Check terms
    if (!terms)
      return this.setState({ termsMessage: 'You must accepts terms to continue!' });

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
      if (Platform.OS === 'ios')
        image.path = image.path.replace('file://', '');
      this.setState({ photoURL: image.path, imagePickerResponse: image });
    }).catch(err => console.log('image-picker err:', err))
  }


  render() {
    const {
      displayName, email, password, repassword, photoURL, isWaiting, displayNameMessage, emailMessage, passwordMessage, repasswordMessage, termsMessage
    } = this.state;
    const { TERMS_LINK } = this.props.assets
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <CustomStatusBar />
        <View style={{ flex: 1, backgroundColor: colors.BLUE }}>
          <View style={styles.container}>
            <H1Label label="Register" />
            <KeyboardAwareScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scroll}
            >
              <View style={styles.componentStyle}>
                <HighlightedText
                  text='You only need an account if you’re planning to host a paid meeting.'
                  color='#FF5F99'
                />
                <View style={{ flexDirection: 'row', alignItems: "center", marginBottom: 5 }}>
                  <MyAvatar
                    onPress={this.onImagePicker}
                    source={{ uri: photoURL }}
                  />
                  <ClickableText text="Pick a profile picture" onPress={this.onImagePicker} />
                </View>
                <Input
                  placeholder="Enter Your email"
                  placeholderTextColor="#b2c2bf"
                  onChangeText={email => this.setState({ email: email.trim(), emailMessage: '' })}
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
                  onChangeText={repassword => this.setState({ repassword, repasswordMessage: '' })}
                  value={repassword}
                  errorMessage={repasswordMessage}
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
                    <HyperLink text="terms and conditions" link={TERMS_LINK} />
                  </View>
                </View>

                <Text style={{ color: 'red', paddingVertical: 2 }}>{termsMessage || emailMessage}</Text>
                <DefaultButton
                  title="Register"
                  onPress={this.checkAccount}
                  disabled={isWaiting} />
              </View>
              <WaitingModal isWaiting={isWaiting} text='Creating your account...' />
            </KeyboardAwareScrollView>
          </View>
          <ContactUs title="Have a problem?" screen='Register' />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    alignSelf: 'stretch',
    borderTopRightRadius: 26,
    borderTopLeftRadius: 26,
    backgroundColor: 'white'
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 20
  },
  checkBoxStyle: {
    flexDirection: 'row',
  },
  buttonStyle: {
    backgroundColor: '#196BFF',
    borderRadius: 6,
    paddingVertical: 15
  },
  inputContainerStyle: {
    borderWidth: 0.7,
    borderColor: '#909090',
    borderRadius: 6,
  }
});

const mapStateToProps = ({ assets }) => {
  return { assets }
}

export default connect(mapStateToProps, { setUserProfile, setHostEventsListener })(RegisterScreen);
