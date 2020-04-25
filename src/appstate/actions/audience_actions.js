import { firestore } from "react-native-firebase";

import { LISTEN_JOIN_EVENT, UNLISTEN_JOIN_EVENT, LISTEN_TICKET, LISTEN_VIEWER } from "./types"

let joinEventListener = () => { console.log('joinEventListener Cleaned!') };


export const setJoinEventListener = (event) => async (dispatch) => {
    const { eventId } = event
    dispatch({
        type: LISTEN_JOIN_EVENT,
        payload: event
    });
    joinEventListener = firestore().doc(`events/${eventId}`)
        .onSnapshot((eventDoc) => {
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

export const setTicketListener = (event) => async (dispatch) => {
    const { eventId, ticket } = event
    const { ticketId } = ticket
    dispatch({
        type: LISTEN_TICKET,
        payload: ticket
    });
    joinEventListener = firestore().doc(`events/${eventId}/tickets/${ticketId}`)
        .onSnapshot((ticketDoc) => {
            let ticket = ticketDoc.data()
            ticket.ticketId = ticketId
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

export const setViewerListener = (event) => async (dispatch) => {
    const { eventId } = event
    dispatch({
        type: LISTEN_VIEWER,
        payload: 0
    });
    joinEventListener = firestore().doc(`events/${eventId}/live/--stats--`)
        .onSnapshot((viewerDoc) => {
            let ticket = viewerDoc.data()
            return dispatch({
                type: LISTEN_VIEWER,
                payload: ticket.viewerCount
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