import { firestore, auth } from "react-native-firebase";
import { CURRENT_USER, CLEAR_USER } from "./types"

const db = firestore();

let listenUserProfile = () => { console.log('User profile is unlistening!') }

export const setUserProfile = () => async (dispatch) => {
    const { uid, displayName, email, photoURL } = auth().currentUser;
    console.log('setUserProfile', uid, displayName, email, photoURL)
    dispatch({
        type: CURRENT_USER,
        payload: { uid, displayName, email, photoURL }
    })
    listenUserProfile = db.doc(`users/${uid}`).onSnapshot((userDoc) => {
        let profile = userDoc.data()
        console.log('user profile changed', profile)
        return dispatch({
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
