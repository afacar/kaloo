import { 
    LISTEN_HOST_EVENTS, 
    LISTEN_HOST_EVENT, 
    LISTEN_MY_VIEWERS, 
    UNLISTEN_HOST_EVENTS, 
    UNLISTEN_HOST_EVENT,
    UNLISTEN_MY_VIEWERS} from "../actions/types";

const INITIAL_STATE = {
    allEvents: [],
    hostEvent: null,
    myViewers: 0
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case LISTEN_HOST_EVENTS: {
            return { ...state, allEvents: action.payload }
        }
        case LISTEN_HOST_EVENT: {
            return { ...state, hostEvent: action.payload }
        }
        case LISTEN_MY_VIEWERS: {
            return { ...state, myViewers: action.payload }
        }
        case UNLISTEN_MY_VIEWERS: {
            return { ...state, myViewers: null }
        }
        case UNLISTEN_HOST_EVENT: {
            return { ...state, hostEvent: null, myViewers: null }
        }
        case UNLISTEN_HOST_EVENTS: {
            return INITIAL_STATE
        }
        default:
            return state;
    }
}