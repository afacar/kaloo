import { CURRENT_USER, CLEAR_USER } from "../actions/types";

const INITIAL_STATE = {
    displayName: null,
    uid: null,
    email: null,
    photoURL: null,
    userNumber: null,

}

export default function (state = INITIAL_STATE, action) {
    console.log('Auth reducer action', action)
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