import { UNLISTEN_LIVE, LISTEN_LIVE } from "../actions/types";

const INITIAL_STATE = {
    status: 'Not Connected',
    startDate: null,
    disconnectTimes: [],
    reconnectTimes: [],
    viewerCount: null,
    endDate: null,
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case LISTEN_LIVE: {
            return { ...state, ...action.payload }
        }
        case UNLISTEN_LIVE: {
            return INITIAL_STATE
        }
        default:
            return state;
    }
}