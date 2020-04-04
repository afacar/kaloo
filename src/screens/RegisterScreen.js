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

const DEFAULT_PROFILE_PIC = 'https://firebasestorage.googleapis.com/v0/b/influenceme-dev.appspot.com/o/assets%2Fprofile-icon.png?alt=media&token=89765144-f9cf-4539-abea-c9d5ac0b3d2d';

function ValidateEmail(email) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return true;
  }
  //AlertUser('Check  your email!', 'Your email seems a bit awkward!')
  return false;
}

class RegisterScreen extends Component {
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
      <KeyboardAvoidingView style={styles.container}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'space-between',
            paddingHorizontal: 40,
            paddingVertical: 10,
            alignItems: 'center',
          }}>
          <View
            style={{
              alignContent: 'center',
              backgroundColor: '#9fa9a3',
              borderRadius: 10,
              paddingHorizontal: 10,
              paddingVertical: 10,
            }}>
            <Text style={{ textAlign: 'center' }}>
              If you’re here to join a show with a ticket, you don’t need to
              register.
            </Text>
          </View>
          <View style={{ alignSelf: 'stretch', alignItems: 'center' }}>
            <Avatar
              onPress={this.onImagePicker}
              size="large"
              rounded={true}
              showEditButton={true}
              source={{ uri: photoURL || DEFAULT_PROFILE_PIC }}
            />
            <Input
              placeholder="Display name"
              placeholderTextColor="#b2c2bf"
              leftIcon={{ type: 'material-community', name: 'account-circle' }}
              leftIconContainerStyle={{ marginLeft: 0, paddingRight: 10 }}
              onChangeText={displayName =>
                this.setState({ displayName, displayNameMessage: '' })
              }
              value={displayName}
              errorMessage={displayNameMessage}
              disabled={isWaiting}
            />
            <Input
              placeholder="Enter Email"
              placeholderTextColor="#b2c2bf"
              leftIcon={{ type: 'material-community', name: 'email' }}
              leftIconContainerStyle={{ marginLeft: 0, paddingRight: 10 }}
              onChangeText={email => this.setState({ email, emailMessage: '' })}
              value={email}
              keyboardType="email-address"
              errorMessage={emailMessage}
              disabled={isWaiting}
            />
            <Input
              placeholder="Password"
              placeholderTextColor="#b2c2bf"
              leftIcon={{ type: 'material-community', name: 'lock' }}
              leftIconContainerStyle={{ marginLeft: 0, paddingRight: 10 }}
              onChangeText={password =>
                this.setState({ password, passwordMessage: '' })
              }
              value={password}
              errorMessage={passwordMessage}
              secureTextEntry
              disabled={isWaiting}
            />
            <Input
              placeholder="Repassword"
              placeholderTextColor="#b2c2bf"
              leftIcon={{ type: 'material-community', name: 'lock' }}
              leftIconContainerStyle={{ marginLeft: 0, paddingRight: 10 }}
              onChangeText={repassword => this.setState({ repassword })}
              value={repassword}
              secureTextEntry
              disabled={isWaiting}
            />
            <View
              style={{
                alignSelf: 'stretch',
                flexDirection: 'column',
                justifyContent: 'center',
              }}>
              <CheckBox
                title="I accept privacy and legal terms"
                checked={this.state.terms}
                onPress={() => this.setState({ terms: !this.state.terms })}
                containerStyle={{ backgroundColor: 'transparent', borderColor: 'transparent' }}
                checkedColor='#3b3a30'
              />
              <Button
                buttonStyle={{ backgroundColor: '#3b3a30' }}
                title="Create My Account"
                onPress={this.checkAccount}
                disabled={isWaiting}
              />
            </View>
          </View>
          <View style={{ alignItems: 'center', flexDirection: 'column' }}>
            <Text>Already Registered?</Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('SignIn', { email })}>
              <Text style={{ textDecorationLine: 'underline' }}>SignIn Here</Text>
            </TouchableOpacity>
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
});

export default RegisterScreen;
