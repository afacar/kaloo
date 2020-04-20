import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView } from 'react-native';
import { colors } from '../constants';
import HeaderLeft from '../components/Headers/HeaderLeft';
import { ContactUs } from '../components/ContactUs';
import UserAvatar from '../components/UserAvatar'
import { H1Label } from '../components/Labels';
import { SafeAreaView } from 'react-navigation'
import { DefaultButton } from '../components/Buttons';


class BalanceScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: () => <UserAvatar />,
    headerLeft: () => <HeaderLeft onPress={navigation.goBack} />
  });

  state = { iban: '', totalBalance: '', currentBalance: 0, requestLoading: false };

  requestPayment = () => {
    this.setState({ requestLoading: true })
    console.warn('Request Payment is clicked')
    this.setState({ requestLoading: false })
  }

  render() {
    const { requestLoading, currentBalance } = this.state
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <KeyboardAvoidingView style={styles.container}>
          <View style={styles.componentStyle}>
            <View>
              <H1Label label="Total Earnings" />
              <View style={styles.balanceContainer}>
                <H1Label label={'$' + currentBalance} />
              </View>
            </View>

            <View>
              <DefaultButton 
              title={'Requst Payment'}
              onPress={this.requestPayment}
              loading={requestLoading} />
              <ContactUs title='Need Help?' screen='Profile' />
            </View>

          </View>
        </KeyboardAvoidingView >
      </SafeAreaView >
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
    paddingVertical: 10,
    alignSelf: 'stretch',
    paddingVertical: 20,
    backgroundColor: "white",
    borderTopRightRadius: 26,
    borderTopLeftRadius: 26,
    justifyContent: 'space-between',
  },
});

export default BalanceScreen;
