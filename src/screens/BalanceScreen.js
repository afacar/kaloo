import React, {Component} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import AppText from '../components/AppText';
import {Input, Button} from 'react-native-elements';

class BalanceScreen extends Component {
  state = {iban: '', totalBalance: '', currentBalance: ''};

  render() {
    return (
      <View style={styles.container}>
        <View>
          <View style={{alignSelf: 'stretch', alignItems: 'center'}}>
            <View
              style={{
                alignContent: 'center',
                backgroundColor: '#b2c2bf',
                borderRadius: 10,
                paddingHorizontal: 10,
                paddingVertical: 10,
                marginBottom: 20,
              }}>
              <Text style={{textAlign: 'center'}}>
                You need to register a bank account info to recieve your monthly
                payouts.
              </Text>
            </View>
          </View>
          <View style={{alignSelf: 'stretch'}}>
            <Button
              buttonStyle={{
                backgroundColor: '#3b3a30',
                borderRadius: 10,
                paddingVertical: 10,
                paddingHorizontal: 10,
                marginBottom: 30,
              }}
              title="Register Bank Account Details"
            />
          </View>
          <View style={{alignSelf: 'flex-start', paddingHorizontal: 10}}>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>
              Current Balance
            </Text>
            <Text
              style={{
                fontSize: 40,
                fontWeight: 'bold',
                color: 'black',
                paddingVertical: 10,
              }}>
              $0
            </Text>
            <Text style={{fontSize: 15, marginBottom: 30}}>
              Your collected balance would be paid out monthly to your provided
              bank account.
            </Text>
          </View>

          <View style={{alignSelf: 'flex-start', paddingHorizontal: 10}}>
            <Text style={{fontSize: 20, fontWeight: 'bold', color: 'gray'}}>
              Earned Total
            </Text>
            <Text
              style={{
                fontSize: 40,
                fontWeight: 'bold',
                color: 'gray',
                paddingVertical: 10,
              }}>
              $0
            </Text>
          </View>
        </View>
        <View style={{alignItems: 'center', flexDirection: 'column'}}>
          <TouchableOpacity
            onPress={() => {
              /TODO: Contact us/;
            }}>
            <Text style={{textDecorationLine: 'underline'}}>Having Trouble?</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
});

export default BalanceScreen;
