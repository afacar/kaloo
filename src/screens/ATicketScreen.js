import React, { Component } from 'react';
import Ticket from '../components/Ticket';
import HeaderLeft from '../components/Headers/HeaderLeft';


class ATicketScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: () => null,
    headerLeft: () => <HeaderLeft onPress={navigation.goBack} />
  });

  render() {
    return <Ticket navigation={this.props.navigation} />
  }
}

export default ATicketScreen;
