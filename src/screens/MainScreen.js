import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '../components/AppText';
import { Input, Button, Text } from 'react-native-elements';
import firebase from 'react-native-firebase';
const db = firebase.firestore()

class MainScreen extends Component {
    state = { ticket: '', isWaiting: false, errorMessage: ' ', isFormatOk: false }

    checkTicket = async () => {
        if (!this._checkTicketFormat()) return
        let { ticket } = this.state;
        ticket = ticket.trim()
        this.setState({ isWaiting: true })
        const [eventId, _t] = ticket.split('-')
        let ticketPath = `events/${eventId}/tickets/${ticket}`
        console.log('ticketPath', ticketPath)
        let ticketDoc = await db.doc(ticketPath).get()
        console.log('ticket data:', ticketDoc.data())
        if (ticketDoc.exists) {
            this.setState({ isWaiting: false })
            // GET EVENT DOC
            let eventDoc = await db.doc(`events/${eventId}`).get()
            let event = eventDoc.data()
            event.ticket = {...ticketDoc.data(), ticket }
            console.log('event dataxx:', event)
            this.props.navigation.navigate('JoinEvent', { event })
        } else {
            this.setState({ isWaiting: false, errorMessage: 'No such a ticket!' })
        }
    }

    _checkTicketFormat = () => {
        const { ticket } = this.state;
        const [eventId, ticketId] = ticket.split('-')
        if (eventId && ticketId && ticketId.length == 4) {
            return true
        } else {
            this.setState({ errorMessage: 'Ticket format is wrong!' })
            return false;
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Enter your ticket number to join the event!</Text>
                <Input
                    value={this.state.ticket}
                    placeholder='Enter Your Ticket'
                    leftIcon={{ type: 'entypo', name: 'ticket' }}
                    onChangeText={ticket => this.setState({ ticket: ticket.trim(), errorMessage: ' ' })}
                    errorMessage={this.state.errorMessage}
                    autoCapitalize='characters'
                />
                <Button
                    title="Go to Event"
                    onPress={this.checkTicket}
                    disabled={this.state.isWaiting}
                />
                <View>
                    <AppText>Or SignUp as Influencer</AppText>
                    <Button
                        title="Create Event"
                        onPress={() => this.props.navigation.navigate('Register')}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center'
    }
})

export default MainScreen;