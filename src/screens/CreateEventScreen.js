import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import AppText from '../components/AppText';
import { Input, Button, Card, Image, Avatar, CheckBox, Overlay, Icon } from 'react-native-elements';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import firebase from 'react-native-firebase';
import ImagePicker from "react-native-image-picker";
import { app } from '../constants';

import EventPreview from '../components/EventPreview';

const storage = firebase.storage()
const auth = firebase.auth()
const functions = firebase.functions()

const DEFAULT_EVENT_PIC = 'https://firebasestorage.googleapis.com/v0/b/influenceme-dev.appspot.com/o/assets%2Fbroadcast-media.png?alt=media&token=608c9143-879d-4ff7-a30d-ac61ba319904'

class CreateEventScreen extends Component {
    state = {
        image: DEFAULT_EVENT_PIC,
        title: '',
        description: '',
        duration: '30',
        eventType: 'live',
        capacity: '5',
        price: '1',
        isDatePickerVisible: false,
        eventDate: new Date(),
        titleMessage: '',
        isAvatarChanged: false, // TODO: Currently they can't change event image
        isPreview: false,
        isWaiting: false,
    }

    onDateChange = (selectedDate) => {
        this.setState({ isDatePickerVisible: false, eventDate: selectedDate })
    };

    createEvent = async () => {
        let { image, title, description, duration, eventType, capacity, price, eventDate } = this.state

        let event = { image, title, description, duration, eventType, capacity, price, eventDate }
        let createEvent = functions.httpsCallable('createEvent')
        event.uid = auth.currentUser.uid;
        event.displayName = auth.currentUser.displayName;
        event.photoURL = auth.currentUser.photoURL;
        event.status = app.EVENT_STATUS.SCHEDULED
        console.log(`Uploading event image to: users/${event.uid}/events/${eventDate.toLocaleString()}.jpg`)
        const imageRef = storage.ref(`users/${auth.currentUser.uid}/events/${eventDate.toLocaleString()}.jpg`)
        imageRef.putFile(this.state.pickerResponse.path)
        console.log('New Image uploaded')
        console.log('calling create event...', event);
        this.setState({ isWaiting: true })
        let { data: { eventNumber, eventLink } } = await createEvent(JSON.stringify(event));
        this.setState({ isWaiting: false })
        event.eventNumber = eventNumber
        event.eventLink = eventLink
        console.log('Recieved created event:=>', event)
        this.setState({ eventNumber, eventLink })
        // TODO: GOTO EVENT SCREEN
        //this.props.navigation.navigate('MyEvent', { event });
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
                path: Platform.OS == 'ios' ? 'Documents/ConsultMe Images/ProfilePictures' : 'Pictures/ ConsultMe Images/ProfilePictures'
            },
        };

        ImagePicker.showImagePicker(options, async (response) => {
            console.log('response', response);
            if (response.didCancel) {
            }
            else if (response.error) {
            }
            else if (response.customButton) {
                /*  const { user } = this.props;
                 user.photoURL = strings.DEFAULT_PROFILE_PIC;
                 this.setState({
                     disabled: false,
                     saveButtonTitle: saveButtonEnabledTitle
                 }) */
            }
            else {
                if (Platform.OS === 'ios')
                    response.path = response.uri.replace("file://", '');
                console.log('event imagePicker response', response);
                this.setState({ image: response.uri, pickerResponse: response, isAvatarChanged: true })
            }
        });
    }

    _eventPreview = () => {
        if (this.state.title.length < 1)
            return this.setState({ titleMessage: 'Title is a must!' })
        this.setState({ isPreview: true })
    }

    render() {
        const { image, title, description, duration, eventType, capacity, price, eventDate } = this.state;
        return (
            <ScrollView>
                <View style={styles.container}>
                    <Card containerStyle={{ borderWidth: 1 }} >
                        <TouchableOpacity onPress={this.onImagePressed} style={{ flexDirection: 'column', alignContent: 'center' }} >
                            <Image
                                containerStyle={{ alignSelf: 'stretch', borderBottomWidth: 1, height: 100 }}
                                source={{ uri: image }}
                                style={{ height: undefined, width: undefined }}
                                resizeMode='contain'
                            />
                            <Icon
                                reverse
                                name='camera'
                                type='material-community'
                                size={10}
                                containerStyle={{
                                    position: 'absolute',
                                    right: 5, bottom: 5
                                }}
                            />
                        </TouchableOpacity>
                        <Input
                            placeholder='Event title'
                            onChangeText={title => this.setState({ title, titleMessage: ' ' })}
                            value={title}
                            errorMessage={this.state.titleMessage}
                        />
                        <Input
                            placeholder='Event description'
                            onChangeText={description => this.setState({ description })}
                            value={description}
                            multiline
                        />
                        <View style={{ alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'space-between', borderColor: 'blue', marginTop: 10 }}>
                            <TouchableOpacity onPress={() => this.setState({ isDatePickerVisible: true })}>
                                <Input
                                    label='Date/Time of Event'
                                    value={eventDate.toLocaleString()}
                                    disabled
                                />
                            </TouchableOpacity>
                            <Input
                                label='Duration (min)'
                                value={duration}
                                onChangeText={(duration) => this.setState({ duration })}
                                containerStyle={{ alignSelf: 'stretch', borderColor: 'brown' }}
                            />
                            <DateTimePickerModal
                                isVisible={this.state.isDatePickerVisible}
                                mode='datetime'
                                onConfirm={this.onDateChange}
                                onCancel={() => this.setState({ isDatePickerVisible: false })}
                                display='default'
                            />
                        </View>
                        <View style={{ flexDirection: 'row', alignSelf: 'stretch' }}>
                            <CheckBox
                                center
                                title='Broadcast'
                                iconRight
                                checkedIcon='dot-circle-o'
                                uncheckedIcon='circle-o'
                                checked={this.state.eventType === 'live'}
                                onPress={() => this.setState({ eventType: 'live' })}
                            />
                            <CheckBox
                                center
                                title='Video Call'
                                iconRight
                                checkedIcon='dot-circle-o'
                                uncheckedIcon='circle-o'
                                checked={this.state.eventType === 'call'}
                                onPress={() => this.setState({ eventType: 'call', capacity: '1' })}
                            />
                        </View>
                        <View style={{ flexDirection: 'column', justifyContent: 'center', borderColor: 'orange', borderWidth: 2 }}>
                            <Input
                                label='Capacity'
                                onChangeText={(capacity) => this.setState({ capacity })}
                                value={capacity}
                                keyboardType='numeric'
                                maxLength={3}
                                disabled={eventType === 'call'}
                            />
                            <Input
                                label='Ticket Price ($)'
                                onChangeText={(price) => this.setState({ price })}
                                value={price}
                                keyboardType='numeric'
                                maxLength={3}
                            />
                        </View>

                        <Button title='Preview Event' type='outline' onPress={this._eventPreview} />
                    </Card>
                </View>
                <Overlay
                    isVisible={this.state.isPreview}
                    windowBackgroundColor="rgba(255, 255, 255, .5)"
                    onBackdropPress={() => this.setState({ isPreview: false })}
                    fullScreen
                >
                    <EventPreview
                        event={this.state}
                        cancel={() => this.setState({ isPreview: false })}
                        publish={() => this.createEvent()}
                    />
                </Overlay>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center'
    }
})

export default CreateEventScreen;