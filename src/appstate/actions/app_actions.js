import { firestore } from "react-native-firebase";
import { LOAD_ASSETS } from "./types"

const db = firestore();

export const loadAssets = () => async (dispatch) => {
    // Fetch static assets from Firestore
    let assetsDoc = await db.doc(`assets/static`).get();

    let assets = assetsDoc.data()

    return dispatch({
        type: LOAD_ASSETS,
        payload: assets
    })
}
