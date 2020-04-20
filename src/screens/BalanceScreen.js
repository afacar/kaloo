import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Input, Button, Avatar } from 'react-native-elements';
import { colors, dimensions } from '../constants';
import { auth } from 'react-native-firebase';
import HeaderLeft from '../components/Headers/HeaderLeft';
import { ContactUs } from '../components/ContactUs';
import { AppText } from '../components/Labels';
import UserAvatar from '../components/UserAvatar'

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
      <KeyboardAvoidingView style={styles.container}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 40, paddingVertical: 10, borderTopLeftRadius: 16, borderTopRightRadius: 16, backgroundColor: 'white' }} >

          <View style={{ alignItems: 'flex-start', marginTop: 20 }}>
            <AppText style={{ fontSize: 28, fontWeight: 'bold' }}> Total Earnings</AppText>
          </View>

          <View style={styles.balanceContainer}>
            <AppText style={{ fontSize: 28, fontWeight: 'bold' }}> {'$' + currentBalance}</AppText>
          </View>

          <Button
            title={'Requst Payment'}
            buttonStyle={styles.requestButton}
            containerStyle={styles.requestButtonContainer}
            onPress={this.requestPayment}
            loading={requestLoading}
          />

          <View style={{ position: 'absolute', bottom: 24, alignSelf: 'center' }}>
            <ContactUs title='Need Help?' screen='Profile' />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    borderWidth: 1
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
  }
});

export default BalanceScreen;
