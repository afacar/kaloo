import { firestore, auth } from "react-native-firebase";
import { CURRENT_USER, CLEAR_USER } from "./types"

const db = firestore();

let listenUserProfile = () => { console.log('User profile is unlistening!') }

export const setUserProfile = (data) => async (dispatch) => {
    console.log('setUserProfile data', data)
    if (data) {
        dispatch({
            type: CURRENT_USER,
            payload: data
        })
    }

    const { uid } = auth().currentUser;
    listenUserProfile = db.doc(`users/${uid}`).onSnapshot((userDoc) => {
        let profile = userDoc.data()
        console.log('user profile fetched', profile)
        dispatch({
            type: CURRENT_USER,
            payload: profile
        })
    })

}

export const clearUserProfile = () => async (dispatch) => {
    listenUserProfile()
    dispatch({
        type: CLEAR_USER,
    })
}
