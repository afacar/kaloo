import { firestore, auth } from "react-native-firebase";

import { LISTEN_JOIN_EVENT, UNLISTEN_JOIN_EVENT, LISTEN_TICKET } from "./types"

let joinEventListener = () => { console.log('joinEventListener Cleaned!') };


export const setJoinEventListener = (eventId) => async (dispatch) => {
    console.log('setJoinEventListener On ')
    joinEventListener = firestore().doc(`events/${eventId}`)
        .onSnapshot((eventDoc) => {
            console.log('joinEvent changed...', eventDoc.data())
            let event = eventDoc.data()
            let date = event.eventDate
            if (date instanceof firestore.Timestamp) {
                date = date.toDate();
            } else if (eventData.eventTimestamp) {
                date = new Date(eventData.eventTimestamp)
            }
            event.eventDate = date;
            return dispatch({
                type: LISTEN_JOIN_EVENT,
                payload: event
            });
        });
}

export const setTicketListener = (eventId, ticketId) => async (dispatch) => {
    console.log('setTicketListener on ', eventId, ticketId)
    joinEventListener = firestore().doc(`events/${eventId}/tickets/${ticketId}`)
        .onSnapshot((ticketDoc) => {
            let ticket = ticketDoc.data()
            ticket.ticketId = ticketId
            console.log('Ticket changed...', ticket)
            let { reserveDate, soldDate, updateDate } = ticket

            if (reserveDate && reserveDate instanceof firestore.Timestamp) {
                ticket.reserveDate = reserveDate.toDate();
            }
            if (soldDate && soldDate instanceof firestore.Timestamp) {
                ticket.soldDate = soldDate.toDate();
            }
            if (updateDate && updateDate instanceof firestore.Timestamp) {
                ticket.updateDate = updateDate.toDate();
            }

            return dispatch({
                type: LISTEN_TICKET,
                payload: ticket
            });
        });
}

export const clearJoinEventListener = () => (dispatch) => {
    console.log('clearJoinEventListener')
    if (joinEventListener)
        joinEventListener();
    return dispatch({
        type: UNLISTEN_JOIN_EVENT,
        payload: null
    });
}