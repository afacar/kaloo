import React, { Component } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { Input } from 'react-native-elements';
import { functions, auth } from 'react-native-firebase';
import { connect } from "react-redux";
import { SafeAreaView } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import * as actions from '../appstate/actions/audience_actions';
import { Label } from './Labels';
import { DefaultButton } from './Buttons';
import { ContactUs } from './ContactUs';
import CustomStatusBar from './StatusBars/CustomStatusBar';
import { convert2Date } from '../utils/Utils';


class TicketView extends Component {

  state = { ticket: '', isWaiting: false, ticketError: '', isTicketFormat: false };

  checkTicket = async () => {
    let { ticket } = this.state;
    ticket = ticket.trim()
    this.setState({ isWaiting: true })

    try {
      let validateTicket = functions().httpsCallable('validateTicket')
      let response = await validateTicket({ ticketId: ticket })
      if (response && response.data && response.data.state === 'SUCCESS') {
        let eventData = response.data.event;
        eventData.eventDate = convert2Date(eventData.eventDate, eventData.eventTimestamp);

        let guestScreen = auth().currentUser ? 'Guest' : 'AGuest'
        this.setState({ isWaiting: false })
        this.props.setGuestEventListener(eventData)
        this.props.setTicketListener(eventData)
        this.props.setViewerListener(eventData);
        this.props.navigation.navigate(guestScreen, { event: eventData })
      } else {
        this.setState({ isWaiting: false, ticketError: response.data.message })
      }
    } catch (error) {
      this.setState({ isWaiting: false, ticketError: error.message })
    }
  }

  onTicketChange = (ticket) => {
    let formattedTicket = ticket.trim().toUpperCase().split('-').join('')
    let first = formattedTicket.substr(0, 4)
    let second = formattedTicket.substr(4, 4)
    let third = formattedTicket.substr(8, 4)
    if (first) formattedTicket = first
    if (second) formattedTicket += '-' + second
    if (third) formattedTicket += '-' + third

    this.setState({ ticket: formattedTicket, ticketError: '' })
  }

  render() {
    const { ticket, isWaiting, ticketError } = this.state;
    const { TICKET_FORMAT, DEFAULT_LOGO_IMAGE } = this.props.assets;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <CustomStatusBar />
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
        >
          <View>
            {/** EMPTY HEADER COMPONENT */}
          </View>
          <View style={styles.body}>
            {/** BODY */}
            <Image
              source={{ uri: DEFAULT_LOGO_IMAGE }}
              style={{ width: 150, height: 150 }}
            />
            <Label label="Get your ticket ready!" />
            <Input
              placeholder={TICKET_FORMAT || ''}
              placeholderTextColor="gray"
              inputStyle={{ textAlign: 'center' }}
              onChangeText={this.onTicketChange}
              value={ticket}
              keyboardType="ascii-capable"
              errorMessage={ticketError}
              autoCapitalize="characters"
              disabled={isWaiting}
              maxLength={TICKET_FORMAT.length || 14}
              containerStyle={{ paddingVertical: 10, paddingHorizontal: 0 }}
              inputContainerStyle={{
                borderWidth: 0.7,
                borderColor: '#3b3a30',
                borderRadius: 8,
                paddingHorizontal: 10,
                marginHorizontal: 0,
                paddingVertical: 5,
              }}
            />
            <View style={{ alignSelf: 'stretch' }}>
              <DefaultButton
                title={isWaiting ? 'Checking Ticket...' : 'Access the Meeting'}
                onPress={this.checkTicket}
                disabled={isWaiting || ticket.length === 0} />
            </View>
          </View>
          <View style={{ alignItems: 'center' }}>
            {/** FOOTER */}
            <Text>Lost your ticket number?</Text>
            <ContactUs screen='TicketScreen' />
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  body: {
    paddingHorizontal: 20,
    alignSelf: 'stretch',
    alignItems: 'center'
  },
});

const mapStateToProps = ({ assets }) => {
  return { assets }
}

export default connect(mapStateToProps, actions)(TicketView);
