import { SET_EVENT_ID, LISTEN_EVENTS, UNLISTEN_EVENTS } from "../actions/types";

const INITIAL_STATE = {
    myEvents: [],
    eventId: null,
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case UNLISTEN_EVENTS: {
            return INITIAL_STATE
        }
        case LISTEN_EVENTS: {
            return { ...state, myEvents: action.payload }
        }
        case SET_EVENT_ID: {
            return { ...state, eventId: action.payload }
        }
        default:
            return state;
    }
}