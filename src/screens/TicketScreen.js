import React, { Component } from 'react';
import Ticket from '../components/Ticket';


class TicketScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Find your event'
  });

  render() {
    return <Ticket navigation={this.props.navigation} />
  }
}

export default TicketScreen;
