import { firestore, functions } from "react-native-firebase"
import { app } from "../constants";
import { getDeviceID } from "./Utils";

let liveEventListener = () => { };
let eventListener = () => { };
var ticketListener = () => { };

/* Host Funcions */
export const startEvent = async (eventId) => {
    try {
        let startEvent = functions().httpsCallable('startEvent')
        let response = await startEvent({ eventId })
        console.log('startEvent response ', response)
        if (response.data && response.data.state === 'SUCCESS') {
            return true;
        }
        return false;
    } catch (error) {
        console.log('startEvent err: ', error)
        return false;
    }
}

export const suspendLive = async (eventId) => {
    try {
        let suspendLive = functions().httpsCallable('suspendEvent')
        let response = await suspendLive({ eventId })
        console.log('suspendLive response ', response)
        if (response.data && response.data.state === 'SUCCESS') {
            return true;
        }
        // TODO: Take action in case of error
        return false;
    } catch (error) {
        console.log('suspendLive err: ', error)
        // TODO: Take action in case of error
        return false;
    }
}

export const continueLive = async (eventId) => {
    try {
        let continueLive = functions().httpsCallable('continueEvent')
        let response = await continueLive({ eventId })
        console.log('continueLive response ', response)
        if (response.data && response.data.state === 'SUCCESS') {
            return true;
        }
        // TODO: Take action in case of error
        return false;
    } catch (error) {
        console.log('continueLive err: ', error)
        // TODO: Take action in case of error
        return false;
    }
}

export const endLive = async (eventId) => {
    console.log('endLive called!')
    try {
        let endLive = functions().httpsCallable('endEvent')
        let response = await endLive({ eventId })
        console.log('endEvent response ', response)
        if (response.data && response.data.state === 'SUCCESS') {
            return true;
        }
        // TODO: Take action in case of error
        return false;
    } catch (error) {
        console.log('endEvent err: ', error)
        // TODO: Take action in case of error
        return false;
    }
}

/* Audience Funcions */
export const joinEvent = async (eventId, ticket) => {
    console.log('joinEvent called!')
    const deviceID = await getDeviceID();
    try {
        let joinEvent = functions().httpsCallable('joinEvent')
        let response = await joinEvent({ eventId, ticket, deviceID })
        console.log('joinEvent response ', response)
        return response.data;
    } catch (error) {
        console.log('joinEvent  err: ', error)
        // TODO: Take action in case of error
        return error;
    }

}

export const leaveEvent = async (eventId, ticket) => {
    console.log('leaveEvent called!', eventId, ticket)
    try {
        let joinEvent = functions().httpsCallable('leaveEvent')
        let response = await joinEvent({ eventId, ticket })
        console.log('leaveEvent response ', response)
        if (response.data && response.data.state === 'SUCCESS') {
            return true;
        }
        // TODO: Take action in case of error
        return false;
    } catch (error) {
        console.log('leaveEvent err: ', error)
        // TODO: Take action in case of error
        return false;
    }

}

export const rateEvent = async (eventId, ticket, rate) => {
    console.log('rateEvent called!')
    try {
        let rateEvent = functions().httpsCallable('rateEvent')
        let response = await rateEvent({ eventId, ticket, rate })
        console.log('rateEvent response ', response)
        if (response.data && response.data.state === 'SUCCESS') {
            return true;
        }
        // TODO: Take action in case of error
        return false;
    } catch (error) {
        console.log('rateEvent err: ', error)
        // TODO: Take action in case of error
        return false;
    }
}

export const setEventListener = (eventId, callback) => {
    console.log('setting event listener', eventId)
    eventListener = firestore().collection('events').doc(eventId).onSnapshot(eventSnapshot => {
        console.log('eventSnapshot ', eventSnapshot.data());
        // Convert Firebase Timestamp to JS Date
        let event = eventSnapshot.data()
        if (event) {
            let date = event.eventDate
            if (date instanceof firestore.Timestamp) {
                date = date.toDate();
            } else if (eventData.eventTimestamp) {
                date = new Date(eventData.eventTimestamp)
            }
            event.eventDate = date

            callback(event)
        }
    })
}

export const setLiveEventListener = (eventID, callback) => {
    console.log('setting live listener', eventID)
    liveEventListener = firestore().collection('events').doc(eventID).collection('live').doc('--stats--').onSnapshot(eventSnapshot => {
        console.log('live Snapshot ', eventSnapshot.data());
        const liveStats = eventSnapshot.data();
        if (liveStats) {
            let startedAt = liveStats.startDate ? liveStats.startDate.toDate() : new Date()
            callback({ status: liveStats.status, viewerCount: liveStats.viewerCount, startedAt });

        } else {
            callback({ status: app.EVENT_STATUS.SCHEDULED, viewerCount: 0, startedAt: undefined })
        }
    })
}

export const setTicketListener = (eventID, ticket, callback) => {
    console.log('setting ticket listener', eventID)
    ticketListener = firestore().collection('events').doc(eventID).collection('tickets').doc(ticket.tid).onSnapshot(ticketSnapshot => {
        const ticketStats = ticketSnapshot.data();
        if (ticketStats && ticketStats.deviceID) {
            callback(ticketStats.deviceID)
        }
    })
}

export const clearEventListener = () => {
    if (eventListener)
        eventListener();
}

export const clearLiveEventListener = () => {
    if (liveEventListener)
        liveEventListener();
}

export const clearTicketListener = () => {
    if (ticketListener)
        ticketListener();
}