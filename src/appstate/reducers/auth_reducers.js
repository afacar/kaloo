import { CURRENT_USER, CLEAR_USER } from "../actions/types";

const INITIAL_STATE = {
    displayName: null,
    uid: null,
    email: null,
    photoURL: null,
    userNumber: null,
    totalEarnings: 0, 
    paidAmount: 0,
    blockedEarnings: 0,
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case CURRENT_USER: {
            return { ...state, ...action.payload }
        }
        case CLEAR_USER: {
            return INITIAL_STATE
        }
        default:
            return state;
    }
}