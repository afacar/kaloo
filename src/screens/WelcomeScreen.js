import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Button, Text, Avatar } from 'react-native-elements';

const DEFAULT_LOGO = 'https://firebasestorage.googleapis.com/v0/b/influenceme-dev.appspot.com/o/assets%2Fdefault-logo.jpg?alt=media&token=20a6be6f-954f-417b-abfb-55e0ac75db02'

class WelcomeScreen extends Component {
  static navigationOptions = { headerShown: false }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 7, paddingHorizontal: 25, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ paddingBottom: 50, alignItems: 'center' }}>
            <Avatar
              source={{ uri: DEFAULT_LOGO }}
              size="large"
            />
            <Text style={{ fontSize: 25, fontWeight: 'bold' }}>
              Streamio
            </Text>
            <Text>
              Get in touch anywhere
              </Text>
          </View>
          <View style={{ alignSelf: 'stretch' }}>
            <Button
              title="Access your stream"
              onPress={() => this.props.navigation.navigate('Ticket')}
            />
          </View>
        </View>
        <View style={{
          flex: 1, flexDirection: 'column', backgroundColor: '#F3F5F9', padding: 15, shadowColor: 'gray', shadowOpacity: 0.5}}>
          <Text>Are you planning to cast your service?</Text>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Register')}>
            <Text style={{ fontSize: 19, fontWeight: 'bold' }}>
              Sign up >
              </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
});

export default WelcomeScreen;
