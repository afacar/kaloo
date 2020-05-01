import React, { Component } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Linking } from 'react-native';
import { functions, auth } from 'react-native-firebase';
import { connect } from 'react-redux';

import { colors } from '../constants';
import HeaderLeft from '../components/Headers/HeaderLeft';
import { ContactUs } from '../components/ContactUs';
import UserAvatar from '../components/UserAvatar'
import { H1Label, H2Label, ErrorLabel, HighlightedText } from '../components/Labels';
import { SafeAreaView } from 'react-navigation'
import { DefaultButton } from '../components/Buttons';


class BalanceScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: () => <UserAvatar />,
    headerLeft: () => <HeaderLeft onPress={navigation.goBack} />
  });

  state = { totalBalance: '', currentBalance: 0, requestLoading: false, stripeUrl: '' };

  componentDidMount() {
    console.log('BalanceDidMount props', this.props.profile)
  }

  createStripeAccount = async () => {
    let { uid } = this.props.profile
    this.setState({ requestLoading: true })
    let getCreateUserAccountUrl = functions().httpsCallable('getCreateUserAccountUrl')
    let response = await getCreateUserAccountUrl({ uid })
    this.setState({ requestLoading: false })
    if (response.data.state === 'SUCCESS' && response.data.url) {
      Linking.openURL(response.data.url)
    } else {
      this.setState({ errorMessage: response.data.message || 'Check your connection and try again later!' })
    }
  }

  requestPayment = async () => {
    let { uid, email, displayName, connectedAccountId } = this.props.profile
    this.setState({ requestLoading: true })
    let requestPayment = functions().httpsCallable('requestPayment')
    let response = await requestPayment({ uid, email, displayName, connectedAccountId })
    this.setState({ requestLoading: false })
    if (response.data.state === 'SUCCESS') {
      this.setState({ successMessage: 'Payment request recieved!' })
    } else {
      this.setState({ errorMessage: response.data.message || 'Check your connection and try again later!' })
    }
  }

  render() {
    let { connectedAccountId, pendingPaymentRequest } = this.props.profile
    const { requestLoading, currentBalance, successMessage, errorMessage } = this.state
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <KeyboardAvoidingView style={styles.container}>
          <View style={styles.componentStyle}>
            <View style={{ marginTop: 35 }}>
              <H1Label label="Total Earnings" />
              <View style={styles.balanceContainer}>
                <H1Label label={'$' + currentBalance} />
              </View>
            </View>
            <H2Label label={successMessage} />
            <ErrorLabel label={errorMessage} />
            <View>
              {connectedAccountId ? (
                <DefaultButton
                  title={pendingPaymentRequest ? 'Payment Request Pending' : 'Request Payment'}
                  onPress={this.requestPayment}
                  loading={requestLoading}
                  disabled={pendingPaymentRequest}
                />
              ) : (
                  <View>
                    <HighlightedText
                      text='You need to create a Stripe account to get payments!'
                    />
                    <DefaultButton
                      title={'Connect with Stripe'}
                      onPress={this.createStripeAccount}
                      loading={requestLoading}
                      disabled={requestLoading}
                    />
                  </View>
                )
              }
              <ContactUs title='Need Help?' screen='Profile' />
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BLUE
  },
  balanceContainer: {
    marginTop: 20,
    backgroundColor: colors.LIGHT_GREY,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8
  },
  requestButtonContainer: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 72,
  },
  requestButton: {
    backgroundColor: colors.CYAN,
    width: 300,
    height: 50,
    borderRadius: 16,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  componentStyle: {
    flex: 1,
    paddingHorizontal: 20,
    alignSelf: 'stretch',
    backgroundColor: "white",
    borderTopRightRadius: 26,
    borderTopLeftRadius: 26,
    justifyContent: 'space-between',
  },
});

const mapStateToProps = ({ profile }) => {
  return { profile }
}

export default connect(mapStateToProps, null)(BalanceScreen);
