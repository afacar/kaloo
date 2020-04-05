import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import firebase from 'react-native-firebase';
import { app } from '../constants';
import EventPreview from './EventPreviewScreen';
import EventCreate from "../components/EventCreate";

const storage = firebase.storage()
const auth = firebase.auth()
const functions = firebase.functions()

const DEFAULT_EVENT_PIC = 'https://firebasestorage.googleapis.com/v0/b/influenceme-dev.appspot.com/o/assets%2Fevent-default-image_200x200.jpeg?alt=media&token=fd8979c0-d617-408d-b387-02fdb48f6c83'

const INITIAL_STATE = {
    uid: auth.currentUser ? auth.currentUser.uid : '',
    displayName: auth.currentUser ? auth.currentUser.displayName : '',
    photoURL: auth.currentUser ? auth.currentUser.photoURL : '',
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
    isPreview: false,
    isWaiting: false,
    status: app.EVENT_STATUS.SCHEDULED,
}

class CreateEventScreen extends Component {
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
            this.props.navigation.navigate('MyEvent', { event })
            //this.setState({ eventNumber, eventLink, isWaiting: false })
        }
    }

    setStateValues = (newState) => {
        console.log('setstatevalues', newState)
        for (var key in newState) {
            if (newState.hasOwnProperty(key)) {
                this.setState({ [key]: newState[key] })
            }
        }
    }

    onImagePressed = () => {
        var customButtons = [];
        /* if (this.state.profile.photoURL !== strings.DEFAULT_PROFILE_PIC) {
              customButtons = [{
                name: 'DeleteButton',
                title: 'Fotoğrafı Sil'
              }]
            } */
        const options = {
            title: 'Upload Foto',
            chooseFromLibraryButtonTitle: 'From Lib',
            takePhotoButtonTitle: 'Open Cam',
            cancelButtonTitle: 'Close',

            customButtons: customButtons,
            mediaType: 'photo',
            storageOptions: {
                skipBackup: true,
                path: 'images',
                allowsEditing: true,
                cameraRoll: true,
                path:
                    Platform.OS == 'ios'
                        ? 'Documents/ConsultMe Images/ProfilePictures'
                        : 'Pictures/ ConsultMe Images/ProfilePictures',
            },
        };

        ImagePicker.showImagePicker(options, async response => {
            console.log('response', response);
            if (response.didCancel) {
            } else if (response.error) {
            } else if (response.customButton) {
                /*  const { user } = this.props;
                         user.photoURL = strings.DEFAULT_PROFILE_PIC;
                         this.setState({
                             disabled: false,
                             saveButtonTitle: saveButtonEnabledTitle
                         }) */
            } else {
                if (Platform.OS === 'ios')
                    response.path = response.uri.replace('file://', '');
                console.log('event imagePicker response', response);
                //this.setState({ image: response.uri, pickerResponse: response })
                this.props.setStateValues({
                    image: response.uri,
                    pickerResponse: response,
                });
            }
        });
    };

    onDateChange = selectedDate => {
        this.setState({ isDatePickerVisible: false });
        this.props.setStateValues({ eventDate: selectedDate, dateMessage: '' });
    };

    render() {
        const { image, title, description, duration, eventType, capacity, price, eventDate, titleMessage, dateMessage } = this.state;
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>
                    Create Event
                    </Text>
                <HighlightedText text='You can preview before publishing.' />
                <Text style={styles.labelStyle}>Event Image</Text>
                <Text style={{ paddingBottom: 10 }}>This image is going to be displayed on top of your event card. </Text>
                <TouchableOpacity
                    onPress={() => this.onImagePressed()}
                    style={{ flexDirection: 'column', alignContent: 'center' }}>
                    <Image containerStyle={{ alignSelf: 'stretch', borderWidth: 1, height: 150 }}
                        source={{ uri: image }}
                        style={{ flex: 1 }}
                    //resizeMode="contain"
                    />
                    <Icon
                        reverse
                        name="camera"
                        type="material-community"
                        size={10}
                        containerStyle={{
                            position: 'absolute',
                            right: 5,
                            bottom: 5,
                        }}
                    />
                </TouchableOpacity>
                <Text style={styles.labelStyle}>Event title </Text>
                <Input
                    placeholder="Event title"
                    placeholderTextColor="#c4c4c4"
                    onChangeText={title => this.props.setStateValues({ title, titleMessage: '' })}
                    value={title}
                    errorMessage={titleMessage}
                    inputContainerStyle={styles.inputContainerStyle}
                    containerStyle={{ paddingHorizontal: 0 }}
                />
                <Text style={styles.labelStyle}>Date/Time of Event</Text>
                <View
                    style={{
                        alignSelf: 'stretch',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        borderColor: 'blue',
                    }}>
                    <TouchableOpacity
                        onPress={() => this.setState({ isDatePickerVisible: true })}>
                        <Text style={styles.timeTextStyle}>{eventDate.toLocaleString()}
                        </Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.labelStyle}>Duration (min)</Text>
                <Input
                    value={duration}
                    onChangeText={duration => this.props.setStateValues({ duration })}
                    inputContainerStyle={styles.inputContainerStyle}
                    containerStyle={{ paddingHorizontal: 0 }}
                />
                <DateTimePickerModal
                    isVisible={this.state.isDatePickerVisible}
                    mode="datetime"
                    onConfirm={this.onDateChange}
                    onCancel={() => this.setState({ isDatePickerVisible: false })}
                    display="default"
                />

                <Text style={styles.labelStyle}>Event description</Text>
                <Input
                    placeholder="Write about your event"
                    placeholderTextColor='#c4c4c4'
                    onChangeText={description => this.props.setStateValues({ description })}
                    value={description}
                    multiline={true}
                    inputContainerStyle={{ ...styles.inputContainerStyle, height: 150 }}
                    containerStyle={{ paddingHorizontal: 0 }}
                />

                <Text style={styles.labelStyle}>Event type  </Text>

                <View style={styles.checkBoxStyle}>
                    <CheckBox
                        iconRight
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        checked={eventType === 'live'}
                        onPress={() => this.props.setStateValues({ eventType: 'live' })}
                        checkedColor="#3b3a30"
                        containerStyle={{ paddingHorizontal: 0 }} />

                    <TouchableOpacity onPress={() => this.props.setStateValues({ eventType: 'live' })}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Broadcast</Text>
                        <Text style={{ paddingRight: 30 }}>Stream to large audience. You won’t be hearing your audience, communcation is one way.</Text>
                    </TouchableOpacity>
                </View>
                <View></View>
                <View style={styles.checkBoxStyle}>
                    <CheckBox
                        iconLeft
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        checked={eventType === 'call'}
                        onPress={() => this.props.setStateValues({ eventType: 'call', capacity: '1', })}
                        checkedColor="#3b3a30"
                        containerStyle={{ paddingHorizontal: 0 }} />
                    <View>
                        <TouchableOpacity onPress={() => this.props.setStateValues({ eventType: 'call', capacity: '1' })}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Privatecast</Text>
                            <Text style={{ paddingRight: 30 }}>Stream to one to up to 5 viewers. Your viewer(s) can stream back to you and you can hear them back. </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={styles.labelStyle}> Capacity</Text>
                <Input
                    onChangeText={capacity => this.props.setStateValues({ capacity })}
                    value={capacity}
                    keyboardType="numeric"
                    maxLength={3}
                    disabled={eventType === 'call'}
                    inputContainerStyle={styles.inputContainerStyle}
                    containerStyle={{ paddingHorizontal: 0 }} />

                <Text style={styles.labelStyle}>Ticket Price ($)</Text>
                <Input
                    //label="Ticket Price ($)"
                    onChangeText={price => this.props.setStateValues({ price })}
                    value={price}
                    keyboardType="numeric"
                    maxLength={3}
                    inputContainerStyle={styles.inputContainerStyle}
                    containerStyle={{ paddingHorizontal: 0 }} />
                <View style={{ paddingTop: 20 }}>
                    <Button
                        title="Preview Event"
                        type="solid"
                        onPress={this.props.previewEvent}
                        buttonStyle={{
                            backgroundColor: '#196BFF',
                            borderRadius: 6,
                            paddingVertical: 15
                        }}
                    />
                    <Button
                        title="Cancel"
                        type="solid"
                        onPress={this.props.cancel}
                        buttonStyle={{
                            marginTop: 10,
                            backgroundColor: '#eca1a6',
                            borderRadius: 10,
                            marginHorizontal: 5
                        }}
                    />
                </View>
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderWidth: 4,
        borderColor: 'orange'
    }
})

export default CreateEventScreen;