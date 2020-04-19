import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Input, Button } from 'react-native-elements';
import { auth } from 'react-native-firebase';

import { HighlightedText, BoldLabel } from '../components/Labels';
import { DefaultButton, ClickableText } from '../components/Buttons';
import { validateEmail } from '../utils/Utils'
import { colors } from '../constants';
import HeaderLeft from '../components/Headers/HeaderLeft';
import CustomStatusBar from '../components/StatusBars/CustomStatusBar';

class SignInScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerStyle: { backgroundColor: colors.BLUE, borderBottomWidth: 0, elevation: 0, shadowOpacity: 0 },
    headerTitle: () => null,
    headerLeft: () => (
      <HeaderLeft onPress={navigation.goBack} />
    ),
    headerRight: () => (
      <Button
        type='clear'
        onPress={() => navigation.navigate('Register')}
        title={'Register'}
        titleStyle={{ color: 'white' }}
      />
    )
  });

  email = this.props.navigation.getParam('email', '');
  state = {
    email: this.email || '',
    password: '',
    isWaiting: false,
    emailError: '',
    passwordError: '',
  };

  handleSignIn = async () => {
    const { email, password } = this.state;
    console.log('email and password', email, password);
    this.setState({ isWaiting: true });
    try {
      let user = await auth()
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
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <CustomStatusBar />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : ''} style={styles.container}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: 'center',
              backgroundColor: "#3598FE"
            }}>

            <View style={styles.componentStyle}>
              <BoldLabel label='Sign In' />
              <HighlightedText text='You don’t need an account if you want to join a meeting.' />
              <Input
                placeholder="Enter Your email"
                placeholderTextColor="#b2c2bf"
                onChangeText={email => this.setState({ email, emailMessage: '' })}
                value={email}
                keyboardType="email-address"
                errorMessage={emailError}
                disabled={isWaiting}
                inputContainerStyle={styles.inputContainerStyle}
                containerStyle={{ paddingHorizontal: 0, marginTop: 10 }}
                leftIcon={{ type: 'material-community', name: 'email-outline', color: "#909090" }}
                leftIconContainerStyle={{ paddingHorizontal: 10, marginLeft: 0 }}
              />
              <Input
                placeholder="Enter Your password"
                placeholderTextColor="#b2c2bf"
                onChangeText={password => this.setState({ password, passwordMessage: '' })}
                value={password}
                errorMessage={passwordError}
                secureTextEntry
                disabled={isWaiting}
                inputContainerStyle={styles.inputContainerStyle}
                containerStyle={{ paddingHorizontal: 0, marginTop: 10 }}
                leftIcon={{ type: 'material-community', name: 'key-variant', color: "#909090" }}
                leftIconContainerStyle={{ paddingHorizontal: 10, marginLeft: 0 }}
              />
              <View style={{ alignSelf: 'stretch', marginTop: 15 }}>
                <DefaultButton
                  title="Sign in"
                  onPress={this._checkSignIn}
                  disabled={this.state.isWaiting} />
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
  buttonStyle: {
    backgroundColor: '#196BFF',
    borderRadius: 6,
    paddingVertical: 15
  },
  contactUs: {
    position: 'absolute', //Here is the trick
    bottom: 0, //Here is the trick
    alignItems: 'center',
    alignSelf: 'center',

  }
});

export default SignInScreen;
