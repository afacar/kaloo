import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Input, Button, Avatar, CheckBox } from 'react-native-elements';
import { functions, storage, auth } from 'react-native-firebase';
import ImagePicker from 'react-native-image-crop-picker';
import HighlightedText from '../components/HighlightedText';
import LabelText from '../components/LabelText';


const DEFAULT_PROFILE_PIC = 'https://firebasestorage.googleapis.com/v0/b/influenceme-dev.appspot.com/o/assets%2Fprofile-icon.png?alt=media&token=89765144-f9cf-4539-abea-c9d5ac0b3d2d';

function ValidateEmail(email) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return true;
  }
  //AlertUser('Check  your email!', 'Your email seems a bit awkward!')
  return false;
}

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
    photoURL: DEFAULT_PROFILE_PIC,
    imagePickerResponse: null,
    isWaiting: false,
    displayNameMessage: '',
    emailMessage: '',
    passwordMessage: '',
  };

  componentDidMount() { }

  createAccount = async () => {
    let {
      displayName,
      email,
      password,
      photoURL,
      imagePickerResponse,
    } = this.state;
    await auth().createUserWithEmailAndPassword(email, password);
    const { currentUser } = auth();
    console.log('user is created', currentUser);
    const { uid } = currentUser
    let isResizedImage = true;
    // Upload new profile pict if it is new
    if (photoURL !== DEFAULT_PROFILE_PIC) {
      isResizedImage = false;
      console.log('uploading avatar...');
      let avatarRef = storage().ref(`users/${uid}/avatar/${uid}.jpg`);
      await avatarRef.putFile(imagePickerResponse.path);
      photoURL = await avatarRef.getDownloadURL()
      console.log('avatar is uploaded!');
    }

    let createUser = functions().httpsCallable('createUser')
    // Update user profile @Authentication
    console.log('update profile', displayName, photoURL);
    await currentUser.updateProfile({ displayName, photoURL });
    // Create user @Firestore
    const newUser = { uid, displayName, photoURL, isResizedImage: isResizedImage }
    let res = await createUser(newUser)
    console.log('user creation completed ', res)
    this.setState({ isWaiting: false });
    this.props.navigation.navigate('UserHome', { displayName });
  };

  checkAccount = async () => {
    const { displayName, email, password, repassword } = this.state;
    // Check display name
    if (!displayName)
      return this.setState({ displayNameMessage: 'We need a name!' });

    // Check email
    if (!ValidateEmail(email))
      return this.setState({ emailMessage: 'Check email!' });

    // Check password and repassword
    if (password !== repassword || password.length < 6)
      return this.setState({ passwordMessage: 'Check password!' });

    // Check if account exists already
    this.setState({ isWaiting: true });
    let result = await auth().fetchSignInMethodsForEmail(email);
    console.log('fetchSignInMethodsForEmail', result);
    if (result.length > 0) {
      return this.setState({ isWaiting: false, emailMessage: 'There is an account with this email' });
    }

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
      displayName,
      email,
      password,
      repassword,
      photoURL,
      isWaiting,
      displayNameMessage,
      emailMessage,
      passwordMessage,
    } = this.state;
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
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
            <LabelText label='Choose your profile picture' />
            <Avatar
              //title="⊕"
              onPress={this.onImagePicker}
              size="large"
              avatarStyle={{ borderWidth: 1, borderColor: 'gray', borderRadius: 6, overflow: 'hidden' }}
              overlayContainerStyle={{ backgroundColor: "white" }}
              imageProps={{ borderRadius: 6 }}
              //rounded={true}
              showEditButton={true}
              source={{ uri: photoURL || DEFAULT_PROFILE_PIC }}
            />
            <LabelText label='E-Mail' />
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

            <LabelText label='Full Name' />
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

            <LabelText label='Password' />
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
            <LabelText label='Repeat Password' />
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
                onPress={() => this.setState({ terms: !this.state.terms })}
                containerStyle={{ backgroundColor: 'transparent', borderColor: 'transparent' }}
                checkedColor='#3b3a30'
              />
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

export default RegisterScreen;
