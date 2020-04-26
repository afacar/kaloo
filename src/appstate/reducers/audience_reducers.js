import { LISTEN_GUEST_EVENT, UNLISTEN_GUEST_EVENT, LISTEN_TICKET, LISTEN_VIEWERS } from "../actions/types";

const INITIAL_STATE = {
    event: null,
    ticket: null,
    viewers: 0,
};

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case UNLISTEN_GUEST_EVENT: {
            return INITIAL_STATE
        }
        case LISTEN_GUEST_EVENT: {
            return { ...state, event: action.payload }
        }
        case LISTEN_TICKET: {
            return { ...state, ticket: action.payload }
        }
        case LISTEN_VIEWERS: {
            return { ...state, viewers: action.payload }
        }
        default:
            return state;
    }
}