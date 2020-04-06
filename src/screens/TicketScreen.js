import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Input, Button, Text, Avatar } from 'react-native-elements';
import firebase from 'react-native-firebase';
import LabelText from '../components/LabelText';
const db = firebase.firestore();

const DEFAULT_LOGO = 'https://firebasestorage.googleapis.com/v0/b/influenceme-dev.appspot.com/o/assets%2Fdefault-logo.jpg?alt=media&token=20a6be6f-954f-417b-abfb-55e0ac75db02'

class TicketScreen extends Component {
  state = { ticket: '', isWaiting: false, ticketError: '', isTicketFormat: false };

  checkTicket = async () => {
    //if (!this._checkTicketFormat()) return
    let { ticket } = this.state;
    ticket = ticket.trim()
    this.setState({ isWaiting: true })
    const [userNumber, eventNumber, ticketNumber] = ticket.split('-')
    let [eventData] = await db.collection('events').where("userNumber", "==", userNumber).where("eventNumber", "==", eventNumber)
        .get()
        .then(function (querySnapshot) {
            let res = []
            querySnapshot.forEach(function (doc) {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                res.push(doc.data())
            });
            return res
        })
        .catch(function (error) {
            console.log("Error getting tickets: ", error);
        });

    console.log('event data:', eventData)
    if (eventData) {
        // GET EVENT DOC
        let ticketDoc = await db.doc(`events/${eventData.eid}/tickets/${ticketNumber}`).get()
        let ticketData = ticketDoc.data()
        eventData.ticket = { ...ticketData }
        console.log('event dataxx:', eventData)
        this.setState({ isWaiting: false })
        this.props.navigation.navigate('JoinEvent', { event: eventData })
    } else {
        this.setState({ isWaiting: false, ticketError: 'No such a ticket!' })
    }
}

  _checkTicketFormat = (ticket) => {
    const [userNumber, eventNumber, ticketNumber] = ticket.split('-');
    if (userNumber && eventNumber && ticketNumber && ticketNumber.length == 4) {
      this.setState({ ticket, ticketError: '', isTicketFormat: true });
    } else {
      this.setState({ ticket, ticketError: '', isTicketFormat: false });
    }
  };

  render() {
    const { ticket, isWaiting, ticketError, isTicketFormat } = this.state;
    return (
      
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingVertical: 10,
            backgroundColor: 'white',
          }}>
            <KeyboardAvoidingView style={styles.container}>
          <Avatar
            source={{ uri: DEFAULT_LOGO }}
            size="large"
          />
          <View style={{ alignSelf: 'stretch', alignItems: 'center' }}>
            <View style={{ alignSelf: "flex-start" ,paddingTop:100}}>
              <LabelText label="Enter your ticket number" />
            </View>
            <Input
              placeholder="xxxx-xxxx-xxxx"
              placeholderTextColor="#b2c2bf"
              //leftIcon={{ type: 'material-community', name: 'ticket' }}
              //leftIconContainerStyle={{ marginLeft: 0, paddingRight: 10 }}
              inputStyle={{ textAlign: 'center' }}
              onChangeText={this._checkTicketFormat}
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
                title="Watch Now"
                buttonStyle={{
                  backgroundColor: '#196BFF',
                  borderRadius: 6,
                  paddingVertical: 15
                }} 
                onPress={this.checkTicket}
                disabled={!isTicketFormat || isWaiting}
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
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

export default TicketScreen;
