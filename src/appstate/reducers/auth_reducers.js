import { CURRENT_USER } from "../actions/types";

const INITIAL_STATE = {
    user: {
        name: '',
        surname: '',
        username: '',
        id: '',
        email: '',
        phone: '',
        image: '',
        address: '',
        zipcode: '',
    }
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case CURRENT_USER: {
            return{...state, user: action.payload}
        }
        default:
            return state;
    }
}