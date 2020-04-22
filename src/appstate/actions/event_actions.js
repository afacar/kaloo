import { firestore, auth } from "react-native-firebase";

import { UNLISTEN_LIVE, LISTEN_LIVE } from "./types"
import { app } from "../../constants";

let liveEventListener = () => { };
var ticketListener = () => { };

export const setLiveEventListener = (eid, updateState) => async (dispatch) => {
    console.log('setting live listener on ', eid)
    liveEventListener = firestore().doc(`events/${eid}/live/--stats--`).onSnapshot(liveSnapshot => {
        console.log('liveSnapshot ', liveSnapshot.data());
        const liveStats = liveSnapshot.data();
        let payload = { status: app.EVENT_STATUS.SCHEDULED, viewerCount: 0, startedAt: undefined }
        if (liveStats) {
            const { status, startDate, viewerCount, endDate } = liveStats
            let startedAt = startDate ? startDate.toDate() : new Date()
            payload = { status, startedAt, viewerCount, endDate }
            updateState(payload)
        }

        return dispatch({
            type: LISTEN_LIVE,
            payload: payload
        });
    })
}

export const clearLiveEventListener = () => (dispatch) => {
    console.log('clearLiveEventListener')
    if (liveEventListener)
        liveEventListener();
    return dispatch({
        type: UNLISTEN_LIVE,
        payload: { status: app.EVENT_STATUS.SCHEDULED, viewerCount: 0, startedAt: undefined }
    });
}

export const clearTicketListener = () => {
    if (ticketListener)
        ticketListener();
}