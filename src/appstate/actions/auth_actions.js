import { CURRENT_USER } from "./types"
import axios from 'axios';
import md5 from 'md5';
import { app } from "../../constants";

export const setCurrentUser = (user) => dispatch => {
    return dispatch({
        type: CURRENT_USER,
        payload: user
    })
}
