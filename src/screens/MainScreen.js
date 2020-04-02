import React, { Component } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableOpacity } from 'react-native';
import AppText from '../components/AppText';
import { Input, Button, Text, Avatar } from 'react-native-elements';
import firebase from 'react-native-firebase';
const db = firebase.firestore()

class MainScreen extends Component {
    state = { ticket: '', isWaiting: false, ticketError: '' }

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
            event.ticket = { ...ticketDoc.data(), ticket }
            console.log('event dataxx:', event)
            this.props.navigation.navigate('JoinEvent', { event })
        } else {
            this.setState({ isWaiting: false, ticketError: 'No such a ticket!' })
        }
    }

    _checkTicketFormat = () => {
        const { ticket } = this.state;
        const [eventId, ticketId] = ticket.split('-')
        if (eventId && ticketId && ticketId.length == 4) {
            return true
        } else {
            this.setState({ ticketError: 'Ticket format is wrong!' })
            return false;
        }
    }

    render() {
        const { ticket, isWaiting, ticketError } = this.state
        return (
            <KeyboardAvoidingView style={styles.container}>
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between', paddingHorizontal: 40, paddingVertical: 10, alignItems: 'center' }} >
                    <Avatar
                        onPress={this.onAvatarPressed}
                        size='large'
                        rounded={true}
                        title='LOGO'
                    />
                    <View style={{ alignSelf: 'stretch', alignItems: 'center' }}>
                        <View style={{ alignContent: 'center', backgroundColor: '#9fa9a3', borderRadius: 10, paddingHorizontal: 10 }}>
                            <Text style={{ textAlign: 'center' }}>Please enter your ticket number given after your purchase.</Text>
                        </View>
                        <Input
                            placeholder='Ticket Number'
                            leftIcon={{ type: 'material-community', name: 'ticket' }}
                            onChangeText={ticket => this.setState({ ticket, ticketError: '' })}
                            value={ticket}
                            keyboardType='ascii-capable'
                            errorMessage={ticketError}
                            autoCapitalize='characters'
                            disabled={isWaiting}
                            containerStyle={{ paddingVertical: 20 }}
                        />
                        <View style={{ alignSelf: 'stretch' }}>
                            <Button
                                buttonStyle={{ backgroundColor: 'grey' }}
                                title="Go to Event"
                                onPress={this.checkTicket}
                                disabled={this.state.isWaiting}
                            />
                        </View>
                    </View>
                    <View style={{ alignItems: 'center', flexDirection: 'column' }}>
                        <Text>Are you going to stream?</Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')} >
                            <Text style={{ textDecorationLine: 'underline' }}>Sign Up / Login</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    }
})

export default MainScreen;