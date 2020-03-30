import firebase from "react-native-firebase"
import { app } from "../constants";


var liveEventListener = () => { };
var eventListener = () => { };

export const startLive = (eventID) => {
    const eventRef = firebase.firestore().collection('events').doc(eventID);
    const liveStatsRef = firebase.firestore().collection('events').doc(eventID).collection('live').doc('--stats--');
    //TODO: change milliseconds to timestamp
    eventRef.set({ status: app.EVENT_STATUS.IN_PROGRESS, startedAt: firebase.firestore.Timestamp.now().seconds.toString() }, { merge: true });
    liveStatsRef.set({ status: app.EVENT_STATUS.IN_PROGRESS, startedAt: firebase.firestore.Timestamp.now().seconds.toString(), viewerCount: 0 }, { merge: true });
}

export const suspendLive = (eventID) => {
    const eventRef = firebase.firestore().collection('events').doc(eventID);
    const liveStatsRef = firebase.firestore().collection('events').doc(eventID).collection('live').doc('--stats--');
    eventRef.set({ status: app.EVENT_STATUS.SUSPENDED }, { merge: true });
    liveStatsRef.set({ status: app.EVENT_STATUS.SUSPENDED }, { merge: true });
    return 1;
}

export const continueLive = (eventID) => {
    const eventRef = firebase.firestore().collection('events').doc(eventID);
    const liveStatsRef = firebase.firestore().collection('events').doc(eventID).collection('live').doc('--stats--');
    eventRef.set({ status: app.EVENT_STATUS.IN_PROGRESS }, { merge: true });
    liveStatsRef.set({ status: app.EVENT_STATUS.IN_PROGRESS }, { merge: true });
    return 1;
}

export const endLive = (eventID) => {
    const eventRef = firebase.firestore().collection('events').doc(eventID);
    const liveStatsRef = firebase.firestore().collection('events').doc(eventID).collection('live').doc('--stats--');
    eventRef.set({ status: app.EVENT_STATUS.COMPLETED, endAt: firebase.firestore.Timestamp.now().seconds.toString() }, { merge: true });
    liveStatsRef.set({ status: app.EVENT_STATUS.COMPLETED, endAt: firebase.firestore.Timestamp.now().seconds.toString() }, { merge: true });
    return 1;
}

export const incrementViewer = (eventID) => {
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
            callback({ status: liveStats.status, viewerCount: liveStats.viewerCount, startedAt: liveStats.startedAt });
        } else {
            callback({ status: undefined, viewerCount: 0, startedAt: undefined })
        }
    })
}

export const clearLiveEventListener = () => {
    if (liveEventListener)
        liveEventListener();
}

export const setEventListener = (eventID, callback) => {
    eventListener = firebase.firestore().collection('events').doc(eventID + '').onSnapshot(eventSnapshot => {
        console.log('eventSnapshot ', eventSnapshot.data());
        callback(eventSnapshot.data())
    })
}

export const clearEventListener = () => {
    if (eventListener)
        eventListener();
}

// export const setViewerCountListener = (eventID, callback) => {
//     viewerCountListener = firebase.firestore().collection('events').doc(eventID).collection('viewers').doc('--stats--');
//     ref.onSnapshot(viewerCountSnapshot => {
//         callback(viewerCountSnapshot.data().viewerCount);
//     })
// }

// export const clearViewerCountListener = (eventID, callback) => {
//     if (viewerCountListener)
//         viewerCountListener();
// }

// export const setViewerCountListener = (eventID, callback) => {
//     eventStatusListener = firebase.firestore().collection('events').doc(eventID);
//     ref.onSnapshot(viewerCountSnapshot => {
//         callback(viewerCountSnapshot.data().viewerCount);
//     })
// }

// export const clearViewerCountListener = (eventID, callback) => {
//     if (viewerCountListener)
//         viewerCountListener();
// }