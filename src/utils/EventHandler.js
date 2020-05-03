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
    try {
        let endLive = functions().httpsCallable('endEvent')
        let response = await endLive({ eventId })
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
    const deviceID = await getDeviceID();
    try {
        let joinEvent = functions().httpsCallable('joinEvent')
        let response = await joinEvent({ eventId, ticket, deviceID })
        return response.data;
    } catch (error) {
        console.log('joinEvent  err: ', error)
        // TODO: Take action in case of error
        return error;
    }

}

export const leaveEvent = async (eventId, ticket) => {
    try {
        let joinEvent = functions().httpsCallable('leaveEvent')
        let response = await joinEvent({ eventId, ticket })
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
    try {
        let rateEvent = functions().httpsCallable('rateEvent')
        let response = await rateEvent({ eventId, ticket, rate })
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
