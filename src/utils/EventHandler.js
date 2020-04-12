import firebase, { firestore, functions } from "react-native-firebase"
import { app } from "../constants";

var liveEventListener = () => { };
var eventListener = () => { };

export const startLive = async (eid) => {
    console.log('startLive called!', eid)
    try {
        let startLive = functions().httpsCallable('startEvent')
        let response = await startLive({ eid })
        console.log('startLive response ', response)
        if (response.data && response.data.state === 'SUCCESS') {
            return true;
        }
        return false;
    } catch (error) {
        console.log('startLive err: ', error)
        return false;
    }
}

export const suspendLive = async (eid) => {
    console.log('suspendLive called!')
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
    console.log('continueLive called!')
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

export const joinEvent = async (eid, ticket) => {
    console.log('joinEvent called!')
    try {
        let joinEvent = functions().httpsCallable('joinEvent')
        let response = await joinEvent({ eid, ticket })
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

    const ref = firebase.firestore().collection('events').doc(eventID).collection('live').doc('--stats--');

    firebase.firestore().runTransaction(async transaction => {
        const doc = await transaction.get(ref);

        // create if doesn't exist
        if (!doc.exists) {
            transaction.set(ref, { viewerCount: 1 })
            return 1;
        }

        // increment number of viewers
        const newCount = doc.data().viewerCount + 1;

        transaction.update(ref, {
            viewerCount: newCount
        });
    })
        .then(newCount => {
            return newCount;
        })
        .catch(error => {
            console.warn('Error on incrementing watcher count ', error);
            return -1;
        })
}

export const decrementViewer = (eventID, ticketID) => {
    const ref = firebase.firestore().collection('events').doc(eventID).collection('live').doc('--stats--');

    firebase.firestore().runTransaction(async transaction => {
        const doc = await transaction.get(ref);

        // create if doesn't exist
        if (!doc.exists) {
            transaction.set(ref, { viewerCount: 1 })
            return 1;
        }

        // increment number of viewers
        const newCount = doc.data().viewerCount - 1;

        transaction.update(ref, {
            viewerCount: newCount
        });
    })
        .then(newCount => {
            return newCount;
        })
        .catch(error => {
            console.warn('Error on decrementing watcher count ', error);
            return -1;
        })
}

export const setLiveEventListener = (eventID, callback) => {
    liveEventListener = firebase.firestore().collection('events').doc(eventID).collection('live').doc('--stats--').onSnapshot(eventSnapshot => {
        console.log('eventSnapshot ', eventSnapshot.data());
        const liveStats = eventSnapshot.data();
        if (liveStats) {
            callback({ status: liveStats.status, viewerCount: liveStats.viewerCount, startedAt: liveStats.startDate.toDate() });
        } else {
            callback({ status: app.EVENT_STATUS.SCHEDULED, viewerCount: 0, startedAt: undefined })
        }
    })
}

export const clearLiveEventListener = () => {
    if (liveEventListener)
        liveEventListener();
}

export const setEventListener = (eventID, callback) => {
    eventListener = firebase.firestore().collection('events').doc(eventID).onSnapshot(eventSnapshot => {
        console.log('eventSnapshot 1', eventSnapshot.data());
        // Convert Firebase Timestamp to JS Date
        let event = eventSnapshot.data()
        let date = event.eventDate
        if (date instanceof firestore.Timestamp) {
            date = date.toDate();
        } else if (eventData.eventTimestamp) {
            date = new Date(eventData.eventTimestamp)
        }
        event.eventDate = date

        callback(event)
    })
}

export const clearEventListener = () => {
    if (eventListener)
        eventListener();
}