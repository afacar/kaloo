import { firestore, functions } from "react-native-firebase"
import { app } from "../constants";
import { getDeviceID } from "./Utils";

let liveEventListener = () => { };
let eventListener = () => { };
var ticketListener = () => { };

/* Host Funcions */
export const startEvent = async (eid) => {
    try {
        let startEvent = functions().httpsCallable('startEvent')
        let response = await startEvent({ eid })
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

export const suspendLive = async (eid) => {
    try {
        let suspendLive = functions().httpsCallable('suspendEvent')
        let response = await suspendLive({ eid })
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

export const continueLive = async (eid) => {
    try {
        let continueLive = functions().httpsCallable('continueEvent')
        let response = await continueLive({ eid })
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

export const endLive = async (eid) => {
    console.log('endLive called!')
    try {
        let endLive = functions().httpsCallable('endEvent')
        let response = await endLive({ eid })
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
export const joinEvent = async (eid, ticket) => {
    console.log('joinEvent called!')
    const deviceID = await getDeviceID();
    try {
        let joinEvent = functions().httpsCallable('joinEvent')
        let response = await joinEvent({ eid, ticket, deviceID })
        console.log('joinEvent response ', response)
        if (response.data && response.data.state === 'SUCCESS') {
            return response.data;
        }
        // TODO: Take action in case of error
        return response.data;
    } catch (error) {
        console.log('joinEvent  err: ', error)
        // TODO: Take action in case of error
        return error;
    }

}

export const leaveEvent = async (eid, ticket) => {
    console.log('leaveEvent called!')
    try {
        let joinEvent = functions().httpsCallable('leaveEvent')
        let response = await joinEvent({ eid, ticket })
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

export const rateEvent = async (eid, ticket, rate) => {
    console.log('rateEvent called!')
    try {
        let rateEvent = functions().httpsCallable('rateEvent')
        let response = await rateEvent({ eid, ticket, rate })
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

export const setEventListener = (eventID, callback) => {
    console.log('setting event listener', eventID)
    eventListener = firestore().collection('events').doc(eventID).onSnapshot(eventSnapshot => {
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