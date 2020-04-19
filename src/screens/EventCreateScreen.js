import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { storage, firestore, functions, auth } from 'react-native-firebase';
import { Input, Button, Image, CheckBox, Icon, Badge, Avatar } from 'react-native-elements';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ImagePicker from 'react-native-image-crop-picker';
import { HighlightedText, H1Label, BoldLabel, Label } from '../components/Labels';
import { Stage1, Stage2, Stage3 } from '../components/Stages';
import { ContactUs } from '../components/ContactUs'

import { app, colors, dimensions } from '../constants';
import { connect } from 'react-redux';
import { splitDate, ConfirmModal } from '../utils/Utils';
import { SafeAreaView } from 'react-navigation';
import { DefaultButton } from '../components/Buttons';


import HeaderLeft from '../components/Headers/HeaderLeft';

const INITIAL_STATE = {
    image: null,
    title: '',
    description: '',
    duration: 30,
    eventType: 'live',
    capacity: 5,
    price: 1,
    isDatePickerVisible: false,
    eventDate: new Date(),
    eventLink: '',
    titleMessage: '',
    dateMessage: '',
    isPreview: false,
    isWaiting: false,
    status: app.EVENT_STATUS.SCHEDULED,
}

class EventCreateScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerStyle: { backgroundColor: colors.BLUE, borderBottomWidth: 0, elevation: 0, shadowOpacity: 0 },
        headerTitle: () => {
            return (
                <View style={{ flex: 1, alignItems: 'center', marginLeft: dimensions.HEADER_LEFT_MARGIN }}>
                    <Avatar
                        rounded={true}
                        size='medium'
                        source={{ uri: auth().currentUser.photoURL } || require('../assets/default-profile.png')}
                    />
                </View>
            )
        },
        headerLeft: () => {
            return (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <HeaderLeft onPress={navigation.goBack} />
                </View>
            )
        }
    });

    state = { ...INITIAL_STATE, ...this.props.profile, image: this.props.assets.DEFAULT_EVENT_IMAGE }

    componentDidMount() {
        console.log('EventCreateDidMiunt state', this.state)
    }

    createEvent = async () => {
        let { uid, displayName, userNumber, photoURL, image, title, description, duration, eventType, capacity, price, eventDate, status } = this.state
        const { DEFAULT_EVENT_IMAGE } = this.props.assets;

        let event = { uid, displayName, userNumber, photoURL, image, title, description, duration, eventType, capacity, price, eventDate, status }
        let createEvent = functions().httpsCallable('createEvent');
        event.eventTimestamp = eventDate.getTime();

        this.setState({ isWaiting: true })

        // Check if new event image is set
        if (image !== DEFAULT_EVENT_IMAGE) {
            let imagePath = `events/${event.uid}/${event.eventTimestamp}.jpg`
            console.log(`Uploading event image to: ${imagePath}`)
            const imageRef = storage().ref(imagePath)
            await imageRef.getDownloadURL().then((url) => {
                // Another event created at the same timestamp
                this.setState({ isWaiting: false, isPreview: false, dateMessage: 'There is already an event on this date!' })
            }).catch(async (error) => {
                if (error.code === 'storage/object-not-found') {
                    await imageRef.putFile(image)
                    let newImage = await imageRef.getDownloadURL()
                    console.log('New Image uploaded')
                    event.image = newImage
                    console.log('calling create event...', event);
                    let response = await createEvent(event);
                    console.log('Recieved created event:=>', response);
                    if (response && response.data && response.data.state === 'SUCCESS') {
                        let eventData = response.data.event;
                        let date = eventData.eventDate
                        if (date instanceof firestore.Timestamp) {
                            console.log('finally Timestamp')
                            date = date.toDate();
                        } else if (eventData.eventTimestamp) {
                            date = new Date(eventData.eventTimestamp);
                        }
                        eventData.eventDate = date
                        this.setState({ isWaiting: false })
                        console.log('Sending event to EventPublish1:=>', eventData);
                        this.props.navigation.navigate('EventPublish', { event: eventData })
                    }
                }
            })
        } else {
            console.log('calling create event...', event);
            let response = await createEvent(event);
            console.log('Recieved created event:=>', response);
            if (response && response.data && response.data.state === 'SUCCESS') {
                let eventData = response.data.event;
                let date = eventData.eventDate
                if (date instanceof firestore.Timestamp) {
                    console.log('finally Timestamp')
                    date = date.toDate();
                } else if (eventData.eventTimestamp) {
                    date = new Date(eventData.eventTimestamp);
                }
                eventData.eventDate = date
                this.setState({ isWaiting: false })
                console.log('Sending event to EventPublish2:=>', eventData);
                this.props.navigation.navigate('EventPublish', { event: eventData })
            }
        }
    }

    onImagePressed = () => {
        ImagePicker.openPicker({
            path: 'my-profile-image.jpg',
            width: 600,
            height: 300,
            cropping: true,
        }).then(image => {
            console.log(image);
            if (Platform.OS === 'ios')
                image.path = image.path.replace('file://', '');
            console.log('picked image', image);
            this.setState({ image: image.path, imagePickerResponse: image });
        }).catch(err => console.log('image-picker err:', err))
    }

    onDateChange = (selectedDate) => {
        this.setState({ isDatePickerVisible: false, eventDate: selectedDate, dateMessage: '' });
    };

    onConfirmPublish = () => {
        this.setState({ isPublishing: true });
        this.createEvent();
    }

    _confirmPublish = () => {
        const title = 'You will publish event',
            message = 'This can not be undone!',
            confirmText = 'Yes, Publish',
            cancelText = 'Cancel';
        ConfirmModal(title, message, confirmText, cancelText, this.onConfirmPublish)
    }

    render() {
        const { image, title, description, duration, eventType, capacity, price, eventDate, titleMessage, dateMessage } = this.state;
        const { date, time, gmt } = splitDate(eventDate)
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : ''} style={styles.container}>
                    <ScrollView contentContainerStyle={{
                        flexGrow: 1,
                        alignItems: 'center',
                        backgroundColor: "#3598FE"
                    }}>
                        <View style={styles.componentStyle}>
                                <View style={{ flexDirection: 'row', justifyContent: "space-between", marginVertical: 10 }}>
                                    <Stage2 value="1" text="Create" />
                                    <Stage1 value="2" text="Preview" />
                                    <Stage1 value="3" text="Published" />
                                </View>
                                <H1Label label="Create an event" />
                                <BoldLabel label="Meeting Image" />
                                <Label label="This image is going to be displayed on top of your event card." />
                                <View style={{ paddingVertical: 10 }}>
                                    <TouchableOpacity
                                        onPress={() => this.onImagePressed()}
                                        style={{ flexDirection: 'column', alignContent: 'center' }}>
                                        <Image containerStyle={{ alignSelf: 'stretch', borderRadius: 8, height: 150, overflow: 'hidden' }}
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
                                </View>

                                <BoldLabel label="Meeting Title" />
                                <Input
                                    placeholder="Meeting name"
                                    placeholderTextColor="#c4c4c4"
                                    onChangeText={title => this.setState({ title, titleMessage: '' })}
                                    value={title}
                                    errorMessage={titleMessage}
                                    inputContainerStyle={styles.inputContainerStyle}
                                    containerStyle={{ paddingHorizontal: 0 }}
                                />
                                <BoldLabel label="Time*" />
                                <View
                                    style={{
                                        alignSelf: 'stretch',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        borderColor: 'blue',
                                    }}>
                                    <TouchableOpacity
                                        onPress={() => this.setState({ isDatePickerVisible: true })}>
                                        <Text style={styles.timeTextStyle}>
                                            {`${date}, ${time} (${gmt} GMT)`}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={{ color: "#c4c4c4" }}>*based on current time zone of your device</Text>
                                <BoldLabel label="Duration (min)" />
                                <Input
                                    value={duration + ''}
                                    onChangeText={duration => this.setState({ duration: parseInt(duration) || 0 })}
                                    inputContainerStyle={styles.inputContainerStyle}
                                    containerStyle={{ paddingHorizontal: 0 }}
                                    keyboardType='numeric'
                                    maxLength={3}
                                />
                                <DateTimePickerModal
                                    isVisible={this.state.isDatePickerVisible}
                                    mode="datetime"
                                    onConfirm={this.onDateChange}
                                    onCancel={() => this.setState({ isDatePickerVisible: false })}
                                    display='spinner'
                                />
                                <BoldLabel label="Event description" />
                                <Input
                                    placeholder="Write about your meeting"
                                    placeholderTextColor='#c4c4c4'
                                    onChangeText={description => this.setState({ description })}
                                    value={description}
                                    multiline={true}
                                    inputContainerStyle={{ ...styles.inputContainerStyle, height: 100 }}
                                    inputStyle={{ alignSelf: 'flex-start', paddingVertical: 5 }}
                                    containerStyle={{ paddingHorizontal: 0 }}
                                />
                                <BoldLabel label="Meeting Type" />
                                <View style={styles.checkBoxStyle}>
                                    <CheckBox
                                        iconRight
                                        checkedIcon="dot-circle-o"
                                        uncheckedIcon="circle-o"
                                        checked={eventType === 'live'}
                                        onPress={() => this.setState({ eventType: 'live' })}
                                        checkedColor="#FF3E6C"
                                        uncheckedColor="#FF3E6C"
                                        containerStyle={{ paddingHorizontal: 0 }} />
                                    <View style={{paddingRight:25}}>
                                        <TouchableOpacity onPress={() => this.setState({ eventType: 'live' })}>
                                            <BoldLabel label="Broadcasting Event" />
                                            <Label label="Stream to large audience. You won’t be hearing your audience, communcation is one way." />
                                        </TouchableOpacity>
                                        {eventType === 'live' && <View>
                                            <BoldLabel label="How many viewers do you want?" />
                                            <Input
                                                onChangeText={capacity => this.setState({ capacity: parseInt(capacity) || 0 })}
                                                value={capacity + ''}
                                                keyboardType="numeric"
                                                maxLength={3}
                                                disabled={eventType === 'call'}
                                                inputContainerStyle={styles.inputContainerStyle}
                                                containerStyle={{ paddingHorizontal: 0 }}
                                            />
                                        </View>}
                                    </View>
                                </View>
                                <View style={styles.checkBoxStyle}>
                                    <CheckBox
                                        iconLeft
                                        checkedIcon="dot-circle-o"
                                        uncheckedIcon="circle-o"
                                        checked={eventType === 'call'}
                                        onPress={() => this.setState({ eventType: 'call', capacity: 1, })}
                                        checkedColor="#FF3E6C"
                                        uncheckedColor="#FF3E6C"
                                        containerStyle={{ paddingHorizontal: 0 }} />
                                    <View>
                                        <TouchableOpacity onPress={() => this.setState({ eventType: 'call', capacity: 1 })}>
                                            <BoldLabel label="1-1 Meeting"/>
                                            <Label label="Create a private video call with just one person."/>
                                        </TouchableOpacity>
                                    </View>
                                </View>


                                <BoldLabel label="Ticket Price (USD)"/>
                                <Input
                                    placeholder="Price"
                                    placeholderTextColor='#c4c4c4'
                                    onChangeText={price => this.setState({ price: parseInt(price) || 0 })}
                                    value={price + ''}
                                    keyboardType="numeric"
                                    maxLength={3}
                                    inputContainerStyle={styles.inputContainerStyle}
                                    containerStyle={{ paddingHorizontal: 0 }} />
                                <View style={{ paddingTop: 20 }}>
                                <DefaultButton 
                                    title="Preview"
                                    onPress={() => this.props.navigation.navigate('EventPreview', { event: this.state, onPublish: this._confirmPublish })}
                                    />
                                <ContactUs />
                                </View>
                            </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>

        );
    }

}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1
    },
    inputContainerStyle: {
        borderWidth: 0.7,
        borderColor: '#3b3a30',
        borderRadius: 6,
        paddingHorizontal: 10,
        marginHorizontal: 0,
    },
    timeTextStyle: {
        fontSize: 17,
        borderWidth: 0.7,
        borderColor: '#3b3a30',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    checkBoxStyle: {
        flex: 1,
        flexDirection: 'row',
        paddingRight: 25

    },
    componentStyle: {
        flex: 1,
        paddingHorizontal: 40,
        paddingVertical: 10,
        alignSelf: 'stretch',
        paddingVertical: 20,
        backgroundColor: "white",
        borderTopRightRadius: 26,
        borderTopLeftRadius: 26,
    },
})

const mapStateToProps = ({ auth, assets }) => {
    return { profile: auth.profile, assets: assets.assets }
}


export default connect(mapStateToProps, null)(EventCreateScreen);