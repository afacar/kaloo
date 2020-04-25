import { LISTEN_JOIN_EVENT, UNLISTEN_JOIN_EVENT, LISTEN_TICKET, LISTEN_VIEWER } from "../actions/types";

const INITIAL_STATE = {
    event: null,
    ticket: null,
    viewers: 0,
};

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case UNLISTEN_JOIN_EVENT: {
            return INITIAL_STATE
        }
        case LISTEN_JOIN_EVENT: {
            return { ...state, event: action.payload }
        }
        case LISTEN_TICKET: {
            return { ...state, ticket: action.payload }
        }
        case LISTEN_VIEWER: {
            return { ...state, viewers: action.payload }
        }
        default:
            return state;
    }
}