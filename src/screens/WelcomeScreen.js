import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import { Text } from 'react-native-elements';
import { connect } from 'react-redux';
import { DefaultButton } from '../components/Buttons';
import Video from "react-native-video";
import TransparentStatusBar from '../components/StatusBars/TransparentStatusBar';


class WelcomeScreen extends Component {
  static navigationOptions = { headerShown: false }

  render() {
    return (
      <View style={styles.container}>
        <TransparentStatusBar />
        <View style={{ flex: 8, justifyContent: 'center', alignItems: 'center' }}>
          <Video
            source={require('../assets/welcome-video.mp4')}
            muted={true}
            repeat={true}
            resizeMode={"cover"}
            repeat
            style={styles.video}
          />
          <View style={{ alignItems: 'center' }}>
            <Image
              source={require('../assets/default-logo.png')}
              style={{ width: 75, height: 75 }}
            />
            <Text style={{ marginTop: 10, width: 250, textAlign: 'center', color: 'white' }}> Access premium meetings to get together online</Text>
          </View>
          <View style={{ margin: 25, alignSelf: 'stretch' }}>
            <DefaultButton
              title={"Join your meeting"}
              onPress={() => this.props.navigation.navigate('ATicket')}
            />
          </View>
          <View style={styles.footer}>
            <Text>Do you want to host your paid meeting?</Text>
            <View style={{ flexDirection: 'row', width: '70%', justifyContent: 'space-around', marginTop: 15, marginBottom: 10 }}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('SignIn')}>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
                  Sign in
              </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Register')}>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
                  Register
              </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  footer: {
    alignItems: 'center',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    flexDirection: 'column',
    backgroundColor: '#F3F5F9',
    padding: 20,
    shadowColor: 'gray',
    shadowOpacity: 0.5,
    overflow: 'hidden',
    width: '100%',
    position: 'absolute', //Here is the trick
    bottom: 0, //Here is the trick
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

const mapStateToProps = ({ assets }) => {
  return { assets }
}
export default connect(mapStateToProps, null)(WelcomeScreen);
