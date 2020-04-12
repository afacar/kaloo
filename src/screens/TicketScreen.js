import React, { Component } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Input, Button, Avatar } from 'react-native-elements';
import { functions, firestore } from 'react-native-firebase';
import { connect } from "react-redux";

import LabelText from '../components/LabelText';


class TicketScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Find your event'
  });

  state = { ticket: '', isWaiting: false, ticketError: '', isTicketFormat: false };

  checkTicket = async () => {
    let { ticket } = this.state;
    ticket = ticket.trim()
    this.setState({ isWaiting: true })

    try {
      let validateTicket = functions().httpsCallable('validateTicket')
      let response = await validateTicket({ ticketId: ticket })
      console.log('ticketvalidation response', response)
      if (response && response.data && response.data.state === 'SUCCESS') {
        let eventData = response.data.event;
        let date = eventData.eventDate
        if (date instanceof firestore.Timestamp) {
          date = date.toDate()
        } else if (eventData.eventTimestamp) {
          date = new Date(eventData.eventTimestamp)
        }
        eventData.eventDate = date
        this.setState({ isWaiting: false })
        this.props.navigation.navigate('JoinEvent', { event: eventData })
      } else {
        this.setState({ isWaiting: false, ticketError: response.data.message })
      }
    } catch (error) {
      this.setState({ isWaiting: false, ticketError: error.message })
    }
  }

  onTicketChange = (ticket) => {
    let formattedTicket = ticket.trim().split('-').join('')
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
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingVertical: 10,
          backgroundColor: 'white'
        }}>
        <KeyboardAvoidingView style={styles.container}>
          <Avatar
            source={{ uri: DEFAULT_LOGO_IMAGE }}
            size="large"
          />
          <View style={{ alignSelf: 'stretch', alignItems: 'center' }}>
            <View style={{ alignSelf: "flex-start", paddingTop: 100 }}>
              <LabelText label="Enter your ticket number" />
            </View>
            <Input
              placeholder={TICKET_FORMAT || ''}
              placeholderTextColor="#b2c2bf"
              inputStyle={{ textAlign: 'center' }}
              onChangeText={this.onTicketChange}
              value={ticket}
              keyboardType="ascii-capable"
              errorMessage={ticketError}
              autoCapitalize="characters"
              disabled={isWaiting}
              containerStyle={{ paddingVertical: 10, paddingHorizontal: 0 }}
              inputContainerStyle={{
                borderWidth: 0.7,
                borderColor: '#3b3a30',
                borderRadius: 6,
                paddingHorizontal: 10,
                marginHorizontal: 0,
                paddingVertical: 5,
              }}
            />
            <View style={{ alignSelf: 'stretch' }}>
              <Button
                title={isWaiting ? 'Checking Ticket...' : "Watch Now"}
                buttonStyle={{
                  backgroundColor: '#196BFF',
                  borderRadius: 6,
                  paddingVertical: 15
                }}
                onPress={this.checkTicket}
                disabled={isWaiting || ticket.length === 0}
              />
            </View>
          </View>
        </KeyboardAvoidingView>

      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
});

const mapStateToProps = ({ assets }) => {
  return { assets: assets.assets }
}

export default connect(mapStateToProps, null)(TicketScreen);
