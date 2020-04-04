import React, { Component } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import firebase from 'react-native-firebase';
import { app } from '../constants';
import EventPreview from './EventPreview';
import EventCreate from "./EventCreate";

const storage = firebase.storage()
const auth = firebase.auth()
const functions = firebase.functions()

const DEFAULT_EVENT_PIC = 'https://firebasestorage.googleapis.com/v0/b/influenceme-dev.appspot.com/o/assets%2Fevent-default-image_200x200.jpeg?alt=media&token=fd8979c0-d617-408d-b387-02fdb48f6c83'

const INITIAL_STATE = {
    uid: auth.currentUser ? auth.currentUser.uid: '',
    displayName: auth.currentUser ? auth.currentUser.displayName: '',
    photoURL: auth.currentUser ? auth.currentUser.photoURL: '',
    image: DEFAULT_EVENT_PIC,
    title: '',
    description: '',
    duration: '30',
    eventType: 'live',
    capacity: '5',
    price: '1',
    isDatePickerVisible: false,
    eventDate: new Date(),
    eventLink: '',
    titleMessage: '',
    dateMessage: '',
    isAvatarChanged: false, // TODO: Currently they can't change event image
    isPreview: false,
    isWaiting: false,
    status: app.EVENT_STATUS.SCHEDULED,
}

class PreviewAndCreateEvent extends Component {
    state = INITIAL_STATE

    createEvent = async () => {
        let { uid, displayName, photoURL, image, title, description, duration, eventType, capacity, price, eventDate } = this.state

        let event = { uid, displayName, photoURL, image, title, description, duration, eventType, capacity, price, eventDate }
        let createEvent = functions.httpsCallable('createEvent')
        event.eventTimestamp = eventDate.getTime();

        this.setState({ isWaiting: true })

        // Check if new event image is set
        if (image !== DEFAULT_EVENT_PIC) {
            let imagePath = `events/${event.uid}/${event.eventTimestamp}.jpg`
            console.log(`Uploading event image to: ${imagePath}`)
            const imageRef = storage.ref(imagePath)
            await imageRef.getDownloadURL().then((url) => {
                // Another event created at the same timestamp
                this.setState({ isWaiting: false, isPreview: false, dateMessage: 'There is already an event on this date!' })
            }).catch(async (error) => {
                if (error.code === 'storage/object-not-found') {
                    await imageRef.putFile(this.state.pickerResponse.path)
                    let newImage = await imageRef.getDownloadURL()
                    console.log('New Image uploaded')
                    event.image = newImage
                    event.isResizedImage = false
                    console.log('calling create event...', event);
                    let { data: { eventNumber, eventLink } } = await createEvent(JSON.stringify(event));
                    event.eventNumber = eventNumber
                    event.eventLink = eventLink
                    console.log('Recieved created event:=>', event)
                    this.setState({ isWaiting: false })
                    this.props.onPublish(event)
                }
            })
        } else {
            event.isResizedImage = true
            console.log('calling create event...', event);
            let { data: { eventNumber, eventLink } } = await createEvent(JSON.stringify(event));
            event.eventNumber = eventNumber
            event.eventLink = eventLink
            console.log('Recieved created event:=>', event)
            this.props.onPublish(event)
            //this.setState({ eventNumber, eventLink, isWaiting: false })
        }
    }

    _eventPreview = () => {
        if (this.state.title.length < 1)
            return this.setState({ titleMessage: 'Title is a must!' })
        this.setState({ isPreview: true })
    }

    _onPreviewClose = () => {
        const { eventLink, isWaiting } = this.state
        if (isWaiting) return;
        if (eventLink) return this.setState({ ...INITIAL_STATE })
        this.setState({ isPreview: false })
    }

    setStateValues = (newState) => {
        console.log('setstatevalues', newState)
        for (var key in newState) {
            if (newState.hasOwnProperty(key)) {
                this.setState({ [key]: newState[key] })
            }
        }
    }

    render() {
        console.log('Preview&Create state', this.state)
        return (
            <ScrollView style={styles.container}>
                {
                    this.state.isPreview ? (
                        <EventPreview
                            event={this.state}
                            cancel={() => this.setState({ isPreview: false })}
                            publish={this.createEvent}
                        />
                    ) : (
                            <EventCreate
                                event={this.state}
                                setStateValues={this.setStateValues}
                                previewEvent={this._eventPreview}
                                cancel={() => this.props.onCancel()}
                            />
                        )
                }
            </ScrollView>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

export default PreviewAndCreateEvent;