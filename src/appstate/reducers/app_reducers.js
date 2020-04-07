import { LOAD_ASSETS } from "../actions/types";

const INITIAL_STATE = {
    assets: {
        TICKET_FORMAT: '',
        DEFAULT_EVENT_IMAGE: '',
        DEFAULT_LOGO_IMAGE: '',
        DEFAULT_PROFILE_IMAGE: '',
    }
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case LOAD_ASSETS: {
            return { ...state, assets: action.payload }
        }
        default:
            return state;
    }
}