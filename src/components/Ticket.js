import React, { Component } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, ScrollView, Image, Text } from 'react-native';
import { Input, Button, Avatar } from 'react-native-elements';
import { functions, firestore, auth } from 'react-native-firebase';
import { connect } from "react-redux";
import { SafeAreaView } from 'react-navigation';

import { Label } from './Labels';
import { ClickableText, DefaultButton } from '../components/Buttons';


class Ticket extends Component {

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
        let nextScreen = auth().currentUser ? 'MyJoinEvent' : 'JoinEvent'
        this.setState({ isWaiting: false })
        this.props.navigation.navigate(nextScreen, { event: eventData })
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
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
            backgroundColor: 'white',
          }}>
          <KeyboardAvoidingView style={styles.container}>
            <Image
              source={require('../assets/icon.png')}
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
                title={isWaiting ? 'Checking Ticket...' : "Watch Now"}
                onPress={this.checkTicket}
                disabled={isWaiting || ticket.length === 0} />
            </View>
            <View style={styles.contactUs}>
              <Text>Lost your ticket number?</Text>
              <ClickableText onPress={() => { }} text="Contact Us" />
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactUs: {
    position: 'absolute', //Here is the trick
    bottom: 0, //Here is the trick
    alignItems: 'center',
  }
});

const mapStateToProps = ({ assets }) => {
  return { assets: assets.assets }
}

export default connect(mapStateToProps, null)(Ticket);
