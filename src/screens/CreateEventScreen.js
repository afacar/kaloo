import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import AppText from '../components/AppText';
import { Input, Button, Card, Image, Avatar, CheckBox } from 'react-native-elements';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import firebase from 'react-native-firebase';

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
        titleMessage: ' ',
        isAvatarChanged: false // TODO: Currently they can't change event image
    }

    onDateChange = (selectedDate) => {
        this.setState({ isDatePickerVisible: false, eventDate: selectedDate })
    };

    createEvent = async () => {
        let event = this.state
        if (event.title.trim().length < 1) {
            return this.setState({ titleMessage: 'Proper title please' })
        }
        let createEvent = firebase.functions().httpsCallable('createEvent')

        delete event.isDatePickerVisible
        delete event.titleMessage
        delete event.isAvatarChanged
        event.uid = firebase.auth().currentUser.uid;
        event.displayName = firebase.auth().currentUser.displayName;
        event.photoURL = firebase.auth().currentUser.photoURL;
        console.log('calling create event...', event);
        let { data: { eventNumber, eventLink } } = await createEvent(JSON.stringify(event));
        event.eventNumber = eventNumber
        event.eventLink = eventLink
        event.status = 'SCHEDULED'
        console.log('Recieved created event:=>', event)
        // TODO: GOTO EVENT SCREEN
        this.props.navigation.navigate('MyEvent', { event });
    }

    onAvatarPressed = () => {
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
                console.log('response', response);
                this.setState({ image: response.uri, pickerResponse: response, isAvatarChanged: true })
            }
        });
    }

    render() {
        const { image, title, description, duration, eventType, capacity, price, eventDate } = this.state;
        return (
            <ScrollView>
                <View style={styles.container}>
                    <Card containerStyle={{ flex: 1, alignSelf: 'stretch' }} >
                        <View style={{ flexDirection: 'row', borderWidth: 2, borderColor: 'red' }} >
                            <Avatar
                                //onPress={this.onAvatarPressed}
                                renderPlaceholderContent={<ActivityIndicator />}
                                //onEditPress={this.onAvatarPressed}
                                size='medium'
                                title='Event Pict'
                                rounded={false}
                                avatarStyle={{ width: 60, height: 60, alignSelf: 'center' }}
                                showEditButton={true}
                                source={{ uri: image }}
                                containerStyle={{ borderColor: 'red', alignSelf: 'center', flex: 1, flexDirection: 'column', justifyContent: 'space-around', borderWidth: 2 }}
                            />
                            <View style={{ flex: 3, flexDirection: 'column', alignContent: 'center' }} >
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
                            </View>
                        </View>
                        <View style={{ alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'space-between', borderWidth: 2, borderColor: 'blue', marginTop: 10 }}>
                            <TouchableOpacity style={{ borderWidth: 1 }} onPress={() => this.setState({ isDatePickerVisible: true })}>
                                <Input
                                    label='Date/Time of Event'
                                    value={eventDate.toLocaleString()}
                                    disabled
                                />
                            </TouchableOpacity>
                            <Input
                                label='Duration'
                                value={duration}
                                onChangeText={(duration) => this.setState({ duration })}
                                containerStyle={{ alignSelf: 'stretch', borderWidth: 5, borderColor: 'brown' }}
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
                                label='Ticket Price'
                                onChangeText={(price) => this.setState({ price })}
                                value={price}
                                keyboardType='numeric'
                                maxLength={3}
                            />
                        </View>

                        <Button title='Create Event' type='outline' onPress={this.createEvent} />
                    </Card>
                </View>
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