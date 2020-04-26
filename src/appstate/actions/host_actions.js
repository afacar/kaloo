import { firestore, auth } from "react-native-firebase";

import {
    LISTEN_HOST_EVENTS,
    LISTEN_HOST_EVENT,
    LISTEN_MY_VIEWERS,
    UNLISTEN_HOST_EVENTS,
    UNLISTEN_HOST_EVENT,
    UNLISTEN_MY_VIEWERS
} from "./types"

let hostEventsListener = () => { console.log('hostEventsListener Cleaned!') };
let hostEventListener = () => { console.log('hostEventListener Cleaned!') };
let myViewersListener = () => { console.log('myViewersListener Cleaned!') }

export const setMyViewersListener = (event) => async (dispatch) => {
    const { eventId } = event
    dispatch({
        type: LISTEN_MY_VIEWERS,
        payload: 0
    });
    myViewersListener = firestore().doc(`events/${eventId}/live/--stats--`)
        .onSnapshot((viewerDoc) => {
            let ticket = viewerDoc.data()
            return dispatch({
                type: LISTEN_MY_VIEWERS,
                payload: ticket.viewerCount || 0
            });
        });
}

export const setHostEventListener = (event) => async (dispatch) => {
    const { eventId } = event
    dispatch({
        type: LISTEN_HOST_EVENT,
        payload: event
    });
    hostEventListener = firestore().doc(`events/${eventId}`)
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
                type: LISTEN_HOST_EVENT,
                payload: event
            });
        });
}

export const setHostEventsListener = () => async (dispatch) => {
    console.log('setHostEventsListener on ')
    const uid = auth().currentUser.uid
    if (!uid) return
    hostEventsListener = firestore().collection('events').where('uid', '==', uid)
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
                type: LISTEN_HOST_EVENTS,
                payload: allEvents
            });
        });
}

export const clearHostEventsListener = () => (dispatch) => {
    if (hostEventsListener) {
        hostEventsListener();
        hostEventListener();
        myViewersListener()
    }
    return dispatch({
        type: UNLISTEN_HOST_EVENTS,
        payload: null
    });
}

export const clearHostEventListener = () => {
    if (hostEventListener) {
        hostEventListener();
        myViewersListener();
    }
    return dispatch({
        type: UNLISTEN_HOST_EVENT,
        payload: null
    });
}

export const clearMyViewersListener = () => {
    if (myViewersListener)
        myViewersListener();
    return dispatch({
        type: UNLISTEN_MY_VIEWERS,
        payload: null
    });
}