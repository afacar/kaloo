import React, { Component } from 'react';
import Ticket from '../components/Ticket';
import { colors } from '../constants';
import HeaderLeft from '../components/Headers/HeaderLeft';


class MyTicketScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerStyle: { backgroundColor: colors.BLUE },
        headerTitle: () => null,
        headerLeft: () => (
            <HeaderLeft onPress={navigation.goBack} />
        )
    });

    render() {
        return <Ticket navigation={this.props.navigation} />
    }
}

export default MyTicketScreen;
