import { firestore, auth } from "react-native-firebase";

import { LISTEN_EVENTS, UNLISTEN_EVENTS, SET_EVENT_ID } from "./types"
import { app } from "../../constants";

let liveEventListener = () => { console.log('liveEventListener Cleaned!') };
var ticketListener = () => { console.log('ticketListener Cleaned!') };

export const setEventId = (eventId) => async (dispatch) => {
    console.log('setting setEventId ', eventId)
    return dispatch({
        type: SET_EVENT_ID,
        payload: eventId
    });
}

export const setAllEventsListener = () => async (dispatch) => {
    console.log('setAllEventsListener on ')
    const uid = auth().currentUser.uid
    if (!uid) return
    liveEventListener = firestore().collection('events').where('uid', '==', uid)
        .onSnapshot((querySnapshot) => {
            console.log('some event change...')
            let allEvents = {}
            querySnapshot.forEach(function (doc) {
                let event = doc.data()
                // Convert Firebase Timestamp tp JS Date object
                let date = event.eventDate
                if (date instanceof firestore.Timestamp) {
                    date = date.toDate();
                } else if (eventData.eventTimestamp) {
                    date = new Date(eventData.eventTimestamp)
                }
                event.eventDate = date;
                allEvents[event.eventId] = event;
            });
            return dispatch({
                type: LISTEN_EVENTS,
                payload: allEvents
            });
        });
}

export const clearLiveEventListener = () => (dispatch) => {
    console.log('clearLiveEventListener')
    if (liveEventListener)
        liveEventListener();
    return dispatch({
        type: UNLISTEN_EVENTS,
        payload: null
    });
}

export const clearTicketListener = () => {
    if (ticketListener)
        ticketListener();
}