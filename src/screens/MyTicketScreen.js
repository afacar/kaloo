import React, { Component } from 'react';
import Ticket from '../components/Ticket';


class MyTicketScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Find my event'
    });

    render() {
        return <Ticket navigation={this.props.navigation} />
    }
}

export default MyTicketScreen;
