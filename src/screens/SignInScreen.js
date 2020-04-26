import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Input } from 'react-native-elements';
import { auth } from 'react-native-firebase';

import { setUserProfile } from "../appstate/actions/auth_actions";
import { setHostEventsListener } from "../appstate/actions/host_actions";
import { HighlightedText, H1Label } from '../components/Labels';
import { DefaultButton } from '../components/Buttons';
import { validateEmail } from '../utils/Utils'
import { ContactUs } from '../components/ContactUs';
import HeaderLeft from '../components/Headers/HeaderLeft';
import CustomStatusBar from '../components/StatusBars/CustomStatusBar';
import HeaderRight from '../components/Headers/HeaderRight';
import { WaitingModal } from '../components/Modals';
import { connect } from 'react-redux';

class SignInScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: () => null,
    headerLeft: () => <HeaderLeft onPress={navigation.goBack} />,
    headerRight: () => <HeaderRight title='Register' onPress={() => navigation.navigate('Register')} />
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
    this.setState({ isWaiting: true });
    try {
      let user = await auth().signInWithEmailAndPassword(email, password);
      if (user) {
        await this.props.setHostEventsListener()
        await this.props.setUserProfile();
        return this.props.navigation.navigate('UserHome');
      }
    } catch (err) {
      this.setState({ isWaiting: false, passwordError: err.message });
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
          <View style={{ flex: 1, backgroundColor: "#3598FE" }}>
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                alignItems: 'center',
                backgroundColor: "#3598FE"
              }}>

              <View style={styles.componentStyle}>
                <H1Label label='Sign In' />
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
                  <ContactUs title="Have a problem?" screen='SignIn' />
                </View>
              </View>
              <View style={styles.contactUs}>
                <ContactUs title="Have a problem?" screen='SignIn' />
                <WaitingModal isWaiting={isWaiting} text='Just a second...' />
              </View>
            </ScrollView>
          </View>
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

export default connect(null, { setUserProfile, setHostEventsListener })(SignInScreen);
