import { firestore } from "react-native-firebase";

import { LISTEN_GUEST_EVENT, UNLISTEN_GUEST_EVENT, LISTEN_TICKET, LISTEN_VIEWERS } from "./types"
import { convert2Date } from "../../utils/Utils";

let guestEventListener = () => { console.log('guestEventListener Cleaned!') };


export const setGuestEventListener = (event) => async (dispatch) => {
    const { eventId } = event
    dispatch({
        type: LISTEN_GUEST_EVENT,
        payload: event
    });
    guestEventListener = firestore().doc(`events/${eventId}`)
        .onSnapshot((eventDoc) => {
            let event = eventDoc.data()
            event.eventDate = convert2Date(event.eventDate, event.eventTimestamp);
            return dispatch({
                type: LISTEN_GUEST_EVENT,
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
    guestEventListener = firestore().doc(`events/${eventId}/tickets/${ticketId}`)
        .onSnapshot((ticketDoc) => {
            let ticket = ticketDoc.data()
            ticket.ticketId = ticketId
            let { reserveDate, soldDate, updateDate } = ticket

            if (reserveDate) {
                ticket.reserveDate = convert2Date(ticket.reserveDate)
            }
            if (soldDate) {
                ticket.soldDate = convert2Date(ticket.soldDate)
            }
            if (updateDate) {
                ticket.updateDate = convert2Date(ticket.updateDate)
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
        type: LISTEN_VIEWERS,
        payload: 0
    });
    guestEventListener = firestore().doc(`events/${eventId}/live/--stats--`)
        .onSnapshot((viewerDoc) => {
            let ticket = viewerDoc.data()
            return dispatch({
                type: LISTEN_VIEWERS,
                payload: ticket.viewerCount || 0
            });
        });
}

export const clearGuestEventListener = () => (dispatch) => {
    if (guestEventListener)
        guestEventListener();
    return dispatch({
        type: UNLISTEN_GUEST_EVENT,
        payload: null
    });
}