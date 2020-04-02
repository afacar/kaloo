import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AppText from '../components/AppText';
import {Input, Button, Text, Avatar} from 'react-native-elements';
import firebase from 'react-native-firebase';

function ValidateEmail(email) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return true;
  }
  //AlertUser('Check  your email!', 'Your email seems a bit awkward!')
  return false;
}

const DEFAULT_PROFILE_PIC =
  'https://firebasestorage.googleapis.com/v0/b/influenceme-dev.appspot.com/o/assets%2Fprofile-icon.png?alt=media&token=89765144-f9cf-4539-abea-c9d5ac0b3d2d';

class SignInScreen extends Component {
  email = this.props.navigation.getParam('email', '');
  state = {
    email: this.email || 'user@influence.me',
    password: 'asdasd',
    isWaiting: false,
    emailError: ' ',
    passwordError: ' ',
  };

  handleSignIn = async () => {
    const {email, password} = this.state;
    console.log('email and password', email, password);
    this.setState({isWaiting: true});
    try {
      let user = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      if (user) return this.props.navigation.navigate('UserHome');
      console.log('The user', user);
    } catch (err) {
      this.setState({passwordError: err.message});
    }
    this.setState({isWaiting: false});
  };

  _checkSignIn = () => {
    const {email, password} = this.state;
    // Clear error messages
    this.setState({emailError: '', passwordError: ''});
    // Check email
    if (!ValidateEmail(email))
      return this.setState({emailError: 'A proper email please!'});

    // Check password and repassword
    if (password.length < 6)
      return this.setState({
        passwordError: 'Password is less than 6 characters!',
      });

    // Everything is ok, let's create account
    this.handleSignIn();
  };

  render() {
    const {email, password, emailError, passwordError, isWaiting} = this.state;
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
              paddingVertical:10
            }}>
            <Text style={{textAlign: 'center'}}>
              If you’re here to join a show with a ticket, you don’t need to
              register.
            </Text>
          </View>
          <View style={{alignSelf: 'stretch', alignItems: 'center'}}>
            <Avatar
              onPress={this.onAvatarPressed}
              size="small"
              rounded={true}
              showEditButton={false}
              source={{uri: DEFAULT_PROFILE_PIC}}
            />
            <Input
              placeholder="Enter Email"
              leftIcon={{type: 'material-community', name: 'email'}}
              placeholderTextColor="#b2c2bf"
              leftIconContainerStyle={{marginLeft: 0, paddingRight: 10}}
              onChangeText={email => this.setState({email, emailMessage: ''})}
              value={email}
              keyboardType="email-address"
              errorMessage={emailError}
              disabled={isWaiting}
            />
            <Input
              placeholder="Password"
              leftIcon={{type: 'material-community', name: 'lock'}}
              placeholderTextColor="#b2c2bf"
              leftIconContainerStyle={{marginLeft: 0, paddingRight: 10}}
              onChangeText={password =>
                this.setState({password, passwordMessage: ''})
              }
              value={password}
              errorMessage={passwordError}
              secureTextEntry
              disabled={isWaiting}
            />
            <View style={{alignSelf: 'stretch'}}>
              <Button
                buttonStyle={{backgroundColor: '#3b3a30'}}
                title="Sign in"
                onPress={this._checkSignIn}
                disabled={this.state.isWaiting}
              />
            </View>
          </View>
          <View style={{alignItems: 'center', flexDirection: 'column'}}>
            <Text>Want to Register?</Text>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('Register', {email})
              }>
              <Text style={{textDecorationLine: 'underline'}}>
                Register Here
              </Text>
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
  },
});

export default SignInScreen;
