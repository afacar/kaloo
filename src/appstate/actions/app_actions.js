import { firestore, storage } from "react-native-firebase";
import { LOAD_ASSETS } from "./types"
import { app } from "../../constants";

const db = firestore();

export const loadAssets = () => async (dispatch) => {
    // Fetch static assets from Firestore
    let assetsDoc = await db.doc(`assets/static`).get();

    let staticAssets = assetsDoc.data()
    console.log('Assets from db:', staticAssets)
    let TICKET_FORMAT = staticAssets.TICKET_PLACEHOLDER
    let DEFAULT_LOGO_IMAGE = staticAssets.DEFAULT_LOGO
    let DEFAULT_EVENT_IMAGE = staticAssets.DEFAULT_EVENT
    let DEFAULT_PROFILE_IMAGE = staticAssets.DEFAULT_PROFILE
    let HOST_CONNECTING_IMAGE = staticAssets.HOST_CONNECTING
    let NO_EVENT_IMAGE = staticAssets.NO_EVENT

    return dispatch({
        type: LOAD_ASSETS,
        payload: { TICKET_FORMAT, DEFAULT_EVENT_IMAGE, DEFAULT_LOGO_IMAGE, DEFAULT_PROFILE_IMAGE, HOST_CONNECTING_IMAGE, NO_EVENT_IMAGE }
    })
}
