import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { storage, auth, functions } from 'react-native-firebase';
import { Input, Button, Image, CheckBox, Icon } from 'react-native-elements';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ImagePicker from 'react-native-image-crop-picker';
import HighlightedText from '../components/HighlightedText';
import { app } from '../constants';
import { connect } from 'react-redux';
import { splitDate } from '../utils/Utils';

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
        headerTitle: () => <Text>Create Event</Text>
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
                    event.isResizedImage = false
                    console.log('calling create event...', event);
                    let response = await createEvent(event);
                    console.log('Recieved created event:=>', response);
                    if (response && response.data && response.data.state === 'SUCCESS') {
                        let eventData = response.data.event;
                        eventData.eventDate = new Date(eventData.eventTimestamp)
                        this.setState({ isWaiting: false })
                        console.log('Sending event to EventPublish1:=>', eventData);
                        this.props.navigation.navigate('EventPublish', { event: eventData })
                    }
                }
            })
        } else {
            event.isResizedImage = true
            console.log('calling create event...', event);
            let response = await createEvent(event);
            console.log('Recieved created event:=>', response);
            if (response && response.data && response.data.state === 'SUCCESS') {
                let eventData = response.data.event;
                eventData.eventDate = new Date(eventData.eventTimestamp)
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

    _confirmPublish = () => {
        console.log('confirm this.props', this.props);
        Alert.alert('You will publish event', 'This can not be undone!', [
            {
                text: 'Cancel',
                onPress: () => { },
                style: 'cancel',
            },
            {
                text: 'Yes, Publish',
                onPress: () => {
                    this.setState({ isPublishing: true });
                    this.createEvent();
                },
            },
        ]);
    }

    render() {
        const { image, title, description, duration, eventType, capacity, price, eventDate, titleMessage, dateMessage } = this.state;
        const { date, time, gmt } = splitDate(eventDate)
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
                    <HighlightedText text='You can preview before publishing.' />

                    <View style={{ paddingVertical: 10 }}>
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
                    </View>

                    <Text style={styles.labelStyle}>Event title </Text>
                    <Input
                        placeholder="Event title"
                        placeholderTextColor="#c4c4c4"
                        onChangeText={title => this.setState({ title, titleMessage: '' })}
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
                            <Text style={styles.timeTextStyle}>
                                {`${date}, ${time} (${gmt} GMT)`}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.labelStyle}>Duration (min)</Text>
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
                        display="default"
                    />

                    <Text style={styles.labelStyle}>Event description</Text>
                    <Input
                        placeholder="Write about your event"
                        placeholderTextColor='#c4c4c4'
                        onChangeText={description => this.setState({ description })}
                        value={description}
                        multiline={true}
                        inputContainerStyle={{ ...styles.inputContainerStyle, height: 70 }}
                        containerStyle={{ paddingHorizontal: 0 }}
                    />

                    <Text style={styles.labelStyle}>Event type  </Text>

                    <View style={styles.checkBoxStyle}>
                        <CheckBox
                            iconRight
                            checkedIcon="dot-circle-o"
                            uncheckedIcon="circle-o"
                            checked={eventType === 'live'}
                            onPress={() => this.setState({ eventType: 'live' })}
                            checkedColor="#3b3a30"
                            containerStyle={{ paddingHorizontal: 0 }} />

                        <TouchableOpacity onPress={() => this.setState({ eventType: 'live' })}>
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
                            onPress={() => this.setState({ eventType: 'call', capacity: 1, })}
                            checkedColor="#3b3a30"
                            containerStyle={{ paddingHorizontal: 0 }} />
                        <View>
                            <TouchableOpacity onPress={() => this.setState({ eventType: 'call', capacity: 1 })}>
                                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Privatecast</Text>
                                <Text style={{ paddingRight: 30 }}>Stream to one to up to 5 viewers. Your viewer(s) can stream back to you and you can hear them back. </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Text style={styles.labelStyle}> Capacity</Text>
                    <Input
                        onChangeText={capacity => this.setState({ capacity: parseInt(capacity) || 0 })}
                        value={capacity + ''}
                        keyboardType="numeric"
                        maxLength={3}
                        disabled={eventType === 'call'}
                        inputContainerStyle={styles.inputContainerStyle}
                        containerStyle={{ paddingHorizontal: 0 }}
                    />

                    <Text style={styles.labelStyle}>Ticket Price ($)</Text>
                    <Input
                        //label="Ticket Price ($)"
                        onChangeText={price => this.setState({ price: parseInt(price) || 0 })}
                        value={price + ''}
                        keyboardType="numeric"
                        maxLength={3}
                        inputContainerStyle={styles.inputContainerStyle}
                        containerStyle={{ paddingHorizontal: 0 }} />
                    <View style={{ paddingTop: 20 }}>
                        <Button
                            title="Preview Event"
                            type="solid"
                            onPress={() => this.props.navigation.navigate('EventPreview', { event: this.state, onPublish: this._confirmPublish })}
                            buttonStyle={{
                                backgroundColor: '#196BFF',
                                borderRadius: 6,
                                paddingVertical: 15
                            }}
                        />
                    </View>
                </View>
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1
    },
    labelStyle: {
        fontSize: 17,
        fontWeight: '600',
        paddingVertical: 10,
    },
    inputContainerStyle: {
        borderWidth: 0.7,
        borderColor: '#3b3a30',
        borderRadius: 6,
        paddingHorizontal: 10,
        marginHorizontal: 0,
        paddingVertical: 5,
    },
    timeTextStyle: {
        fontSize: 17,
        borderWidth: 0.7,
        borderColor: '#3b3a30',
        borderRadius: 5,
        paddingVertical: 12,
        paddingHorizontal: 5,
    },
    checkBoxStyle: {
        flex: 1,
        flexDirection: 'row',
    }
})

const mapStateToProps = ({ auth, assets }) => {
    console.log('EventCreate mapstatatoprops', auth, assets)
    return { profile: auth.profile, assets: assets.assets }
}


export default connect(mapStateToProps, null)(EventCreateScreen);