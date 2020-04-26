import { firestore, auth } from "react-native-firebase";
import { CURRENT_USER } from "./types"

const db = firestore();

export const setUserProfile = () => async (dispatch) => {
    const currentUser = auth().currentUser;
    let userDoc = await db.doc(`users/${currentUser.uid}`).get()
    let profile = userDoc.data()
    return dispatch({
        type: CURRENT_USER,
        payload: profile
    })
}
