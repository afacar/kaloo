import React, { Component } from 'react';
import Ticket from '../components/Ticket';
import { Button } from 'react-native-elements';
import HeaderLeft from '../components/Headers/HeaderLeft';
import { colors } from '../constants';


class TicketScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerStyle: { backgroundColor: colors.BLUE },
    headerTitle: () => null,
    headerLeft: () => <HeaderLeft onPress={navigation.goBack} />
  });

  render() {
    return <Ticket navigation={this.props.navigation} />
  }
}

export default TicketScreen;
