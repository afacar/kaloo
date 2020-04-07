import { firestore, storage } from "react-native-firebase";
import { LOAD_ASSETS } from "./types"
import { app } from "../../constants";

const db = firestore();

export const loadAssets = () => async (dispatch) => {
    let ticketFormatDoc = await db.doc(`assets/TicketFormat`).get();
    let TICKET_FORMAT = ticketFormatDoc.data().format
    const DEFAULT_EVENT_IMAGE = await storage().ref('assets/default-event.jpg').getDownloadURL()
    const DEFAULT_LOGO_IMAGE = await storage().ref('assets/default-logo.jpg').getDownloadURL()
    const DEFAULT_PROFILE_IMAGE = await storage().ref('assets/default-profile.jpg').getDownloadURL()

    console.log('loadAssets() ->', TICKET_FORMAT, DEFAULT_EVENT_IMAGE, DEFAULT_LOGO_IMAGE, DEFAULT_PROFILE_IMAGE)
    return dispatch({
        type: LOAD_ASSETS,
        payload: { TICKET_FORMAT, DEFAULT_EVENT_IMAGE, DEFAULT_LOGO_IMAGE, DEFAULT_PROFILE_IMAGE }
    })
}
