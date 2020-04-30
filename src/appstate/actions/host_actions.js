import { firestore, auth } from "react-native-firebase";

import {
    LISTEN_HOST_EVENTS,
    LISTEN_HOST_EVENT,
    LISTEN_MY_VIEWERS,
    UNLISTEN_HOST_EVENTS,
    UNLISTEN_HOST_EVENT,
    UNLISTEN_MY_VIEWERS
} from "./types"

import { convert2Date, compare } from "../../utils/Utils";
import app from '../../constants/app';

const { SCHEDULED, SUSPENDED, IN_PROGRESS, COMPLETED } = app.EVENT_STATUS

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
            event.eventDate = convert2Date(event.eventDate, event.eventTimestamp);
            return dispatch({
                type: LISTEN_HOST_EVENT,
                payload: event
            });
        });
}

export const setHostEventsListener = () => async (dispatch) => {
    console.log('setHostEventsListener on ...')
    const uid = auth().currentUser.uid
    if (!uid) return
    hostEventsListener = firestore().collection('events').where('uid', '==', uid)
        .onSnapshot((querySnapshot) => {
            let allEvents = {}

            querySnapshot.forEach(function (doc) {
                let event = doc.data()
                event.eventDate = convert2Date(event.eventDate, event.eventTimestamp);
                allEvents[event.eventId] = event;
            });

            let upcomingEvents = [], liveEvents = [], pastEvents = [];
            console.log('allevents actoin', allEvents);
            
            for (var key in allEvents) {
                let event = allEvents[key]
                if (event.status === SUSPENDED || event.status === IN_PROGRESS) liveEvents.push(event)
                if (event.status === SCHEDULED) upcomingEvents.push(event)
                if (event.status === COMPLETED) pastEvents.push(event)
            }

            liveEvents.sort(compare)
            upcomingEvents.sort(compare)
            pastEvents.sort(compare)

            return dispatch({
                type: LISTEN_HOST_EVENTS,
                payload: { liveEvents, upcomingEvents, pastEvents }
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