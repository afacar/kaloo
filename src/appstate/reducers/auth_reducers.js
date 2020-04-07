import { CURRENT_USER } from "../actions/types";

const INITIAL_STATE = {
    profile: {
        displayName: '',
        id: '',
        email: '',
        photoURL: '',
        userNumber: '',
    }
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case CURRENT_USER: {
            return { ...state, profile: action.payload }
        }
        default:
            return state;
    }
}