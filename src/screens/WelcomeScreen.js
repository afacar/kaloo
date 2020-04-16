import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image
} from 'react-native';
import { Button, Text, Avatar } from 'react-native-elements';
import { connect } from 'react-redux';
import { DefaultButtonColor } from '../components/Buttons';
import Video from "react-native-video";

//const DEFAULT_LOGO = 'https://firebasestorage.googleapis.com/v0/b/influenceme-dev.appspot.com/o/assets%2Fdefault-logo.jpg?alt=media&token=20a6be6f-954f-417b-abfb-55e0ac75db02'

const { width, height } = Dimensions.get("window");

class WelcomeScreen extends Component {
  static navigationOptions = { headerShown: false }


  render() {
    const { DEFAULT_LOGO_IMAGE } = this.props.assets;
    return (
      <View style={styles.container}>
        <View style={{ flex: 8, justifyContent: 'center', alignItems: 'center' }}>
          <Video
            source={{ uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
            muted={true}
            repeat={true}
            resizeMode={"cover"}
            repeat
            style={styles.video}
          />
          <View style={{alignItems: 'center' }}>
            <Image
              source={require('../assets/5.png')}
              style={{ width: 150, height: 150 }}
            />
            <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'white' }}>
              Kaloo
            </Text>
            <Text style={{ width: 250, textAlign: 'center', color: 'white' }}> Access premium meetings to get together online</Text>
          </View>
          <View style={{margin:25, alignSelf: 'stretch' }}>
            <DefaultButtonColor
              title={"Join your meeting"}
              onPress={() => this.props.navigation.navigate('Ticket')}
            />
          </View>
          <View style={styles.footer}>
          <Text>Do you want to host your paid meeting?</Text>
          <View style={{ flexDirection: 'row', width: '70%', justifyContent: 'space-around', marginTop: 15,marginBottom:10 }}>
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
    padding: 35,
    shadowColor: 'gray',
    shadowOpacity: 0.5,
    overflow: 'hidden',
    width:'100%',
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
  return { assets: assets.assets }
}
export default connect(mapStateToProps, null)(WelcomeScreen);
