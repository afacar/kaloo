import React, { Component } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableOpacity } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import firebase from 'react-native-firebase';
const db = firebase.firestore()

class TicketScreen extends Component {
    state = { ticket: '', isWaiting: false, ticketError: ' ', isFormatOk: false }

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
            this.props.navigation.navigate('JoinMyEvent', { event: eventData })
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
                    <View></View>
                    <View style={{ alignSelf: 'stretch', alignItems: 'center' }}>
                        <View style={{ alignContent: 'center', backgroundColor: '#9fa9a3', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 }}>
                            <Text style={{ textAlign: 'center' }}>Please enter your ticket number given after your purchase.</Text>
                        </View>
                        <Input
                            placeholder='Ticket Number'
                            leftIcon={{ type: 'material-community', name: 'ticket', color: '#3b3a30' }}
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
                        <Text>Having Trouble?</Text>
                        <TouchableOpacity onPress={() => {/*TODO: Contact us*/ }} >
                            <Text style={{ textDecorationLine: 'underline' }}>Contact Us</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

export default TicketScreen;