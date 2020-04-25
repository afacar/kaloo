import React, { Component } from 'react';
import JoinEvent from '../components/JoinEvent';
import HeaderLeft from '../components/Headers/HeaderLeft';


class GuestScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: () => null,
    headerLeft: () => <HeaderLeft onPress={navigation.goBack} />
  });

  event = this.props.navigation.getParam('event', '')

  render() {
    return <JoinEvent event={this.event} navigation={this.props.navigation} />
  }
}

export default GuestScreen;