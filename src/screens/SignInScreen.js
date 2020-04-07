import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { Input, Button } from 'react-native-elements';
import firebase from 'react-native-firebase';
import HighlightedText from '../components/HighlightedText';
import LabelText from '../components/LabelText';


function validateEmail(email) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return true;
  }
  return false;
}

class SignInScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerRight: () => (
      <Button
        type='clear'
        onPress={() => navigation.navigate('Register')}
        title={'Register'}
      />
    )
  });

  email = this.props.navigation.getParam('email', '');
  state = {
    email: this.email || '',
    password: '',
    isWaiting: false,
    emailError: ' ',
    passwordError: ' ',
  };

  handleSignIn = async () => {
    const { email, password } = this.state;
    console.log('email and password', email, password);
    this.setState({ isWaiting: true });
    try {
      let user = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      if (user) return this.props.navigation.navigate('UserHome');
      console.log('The user', user);
    } catch (err) {
      this.setState({ passwordError: err.message });
    }
    this.setState({ isWaiting: false });
  };

  _checkSignIn = () => {
    const { email, password } = this.state;
    // Clear error messages
    this.setState({ emailError: '', passwordError: '' });
    // Check email
    if (!validateEmail(email))
      return this.setState({ emailError: 'A proper email please!' });

    // Check password and repassword
    if (password.length < 6)
      return this.setState({
        passwordError: 'Password is less than 6 characters!',
      });

    // Everything is ok, let's create account
    this.handleSignIn();
  };

  render() {
    const { email, password, emailError, passwordError, isWaiting } = this.state;
    return (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : ''} style={styles.container}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingVertical: 10,
            alignItems: 'center',
          }}>

          <HighlightedText text="You don’t need an account to watch." />
          <View style={{ alignSelf: 'stretch', paddingVertical: 20 }}>
            <LabelText label='Username' />
            <Input
              placeholder="user@email.com"
              placeholderTextColor="#b2c2bf"
              onChangeText={email => this.setState({ email, emailMessage: '' })}
              value={email}
              keyboardType="email-address"
              errorMessage={emailError}
              disabled={isWaiting}
              inputContainerStyle={styles.inputContainerStyle}
              containerStyle={{ paddingHorizontal: 0 }}
            />
            <LabelText label='Password' />
            <Input
              placeholder="******"
              placeholderTextColor="#b2c2bf"
              onChangeText={password =>
                this.setState({ password, passwordMessage: '' })
              }
              value={password}
              errorMessage={passwordError}
              secureTextEntry
              disabled={isWaiting}
              inputContainerStyle={styles.inputContainerStyle}
              containerStyle={{ paddingHorizontal: 0 }}
            />
            <View style={{ alignSelf: 'stretch' }}>
              <Button
                buttonStyle={styles.buttonStyle}
                title="Sign in"
                onPress={this._checkSignIn}
                disabled={this.state.isWaiting}

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
  },
  inputContainerStyle: {
    borderWidth: 0.7,
    borderColor: '#3b3a30',
    borderRadius: 6,
    paddingHorizontal: 10,
    marginHorizontal: 0,
    paddingVertical: 5,
  },
  buttonStyle: {
    backgroundColor: '#196BFF',
    borderRadius: 6,
    paddingVertical: 15
  }
});

export default SignInScreen;
