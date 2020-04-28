import React, { Component } from 'react';
import TicketView from '../components/TicketView';
import HeaderLeft from '../components/Headers/HeaderLeft';


class TicketScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: () => null,
    headerLeft: () => <HeaderLeft onPress={navigation.goBack} />
  });

  render() {
    return <TicketView navigation={this.props.navigation} />
  }
}

export default TicketScreen;