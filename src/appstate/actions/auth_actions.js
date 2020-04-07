import { firestore, auth } from "react-native-firebase";
import { CURRENT_USER } from "./types"
import { app } from "../../constants";

const db = firestore();

export const setUserProfile = () => async (dispatch) => {
    const currentUser = auth().currentUser;
    let userDoc = await db.doc(`users/${currentUser.uid}`).get()
    let profile = userDoc.data()
    console.log('user profile is fetched', profile)
    return dispatch({
        type: CURRENT_USER,
        payload: profile
    })
}
