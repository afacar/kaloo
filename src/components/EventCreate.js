import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Text,
} from 'react-native';
import {
    Input,
    Button,
    Card,
    Image,
    Avatar,
    CheckBox,
    Icon,
} from 'react-native-elements';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ImagePicker from 'react-native-image-picker';
import { color } from 'react-native-reanimated';

class EventCreate extends Component {
    state = { isDatePickerVisible: false };

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
        const {
            image, title, description, duration, eventType, capacity, price, eventDate, titleMessage, dateMessage } = this.props.event;
        return (
            <SafeAreaView>
                <ScrollView contentContainerStyle={styles.container}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>
                        Create New Event
                    </Text>
                    <TouchableOpacity
                        onPress={() => this.onImagePressed()}
                        style={{ flexDirection: 'column', alignContent: 'center' }}>
                        <Image
                            containerStyle={{
                                alignSelf: 'stretch',
                                //borderBottomWidth: 1,
                                height: 100,
                            }}
                            source={{ uri: image }}
                            style={{ height: undefined, width: undefined }}
                            resizeMode="contain"
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
                    <Text
                        style={{
                            fontSize: 15,
                            fontWeight: '500',
                            paddingVertical: 10,
                            paddingHorizontal: 10,
                        }}>
                        Event title
                    </Text>
                    <Input
                        placeholder="Event title"
                        placeholderTextColor="#c4c4c4"
                        onChangeText={title =>
                            this.props.setStateValues({ title, titleMessage: '' })
                        }
                        value={title}
                        errorMessage={titleMessage}
                        inputContainerStyle={{
                            borderWidth: 1,
                            borderColor: '#3b3a30',
                            borderRadius: 5,
                            paddingHorizontal: 5,
                        }}
                    />

                    <View
                        style={{
                            alignSelf: 'stretch',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            borderColor: 'blue',
                            marginTop: 10,
                        }}>
                        <TouchableOpacity
                            onPress={() => this.setState({ isDatePickerVisible: true })}>
                            <Text
                                style={{
                                    fontSize: 15,
                                    fontWeight: '500',
                                    paddingVertical: 10,
                                    paddingHorizontal: 10,
                                }}>
                                Date/Time of Event
                            </Text>
                            <Text
                                style={{
                                    fontSize: 17,
                                    borderWidth: 1,
                                    borderColor: '#3b3a30',
                                    borderRadius: 5,
                                    marginHorizontal: 10,
                                    paddingVertical: 12,
                                    paddingHorizontal: 5,
                                }}>
                                {eventDate.toLocaleString()}
                            </Text>
                        </TouchableOpacity>
                        <Text
                            style={{
                                fontSize: 15,
                                fontWeight: '500',
                                paddingVertical: 10,
                                paddingHorizontal: 10,
                            }}>
                            Duration (min)
                        </Text>
                        <Input
                            //label="Duration (min)"
                            value={duration}
                            onChangeText={duration => this.props.setStateValues({ duration })}
                            //containerStyle={{alignSelf: 'stretch', borderColor: 'brown'}}
                            inputContainerStyle={{
                                borderWidth: 1,
                                borderColor: '#3b3a30',
                                borderRadius: 5,
                                paddingHorizontal: 10,
                            }}
                        />
                        <DateTimePickerModal
                            isVisible={this.state.isDatePickerVisible}
                            mode="datetime"
                            onConfirm={this.onDateChange}
                            onCancel={() => this.setState({ isDatePickerVisible: false })}
                            display="default"
                        />
                    </View>
                    <Text
                        style={{
                            fontSize: 15,
                            fontWeight: '500',
                            paddingVertical: 10,
                            paddingHorizontal: 10,
                        }}>
                        Event description
                    </Text>
                    <Input
                        placeholder="Write about your event"
                        placeholderTextColor='#c4c4c4'
                        onChangeText={description =>
                            this.props.setStateValues({ description })
                        }
                        value={description}
                        multiline
                        inputContainerStyle={{
                            borderWidth: 1,
                            borderColor: '#3b3a30',
                            borderRadius: 5,
                            paddingHorizontal: 5,
                            height: 100,
                            alignContent: "flex-start"
                        }}
                    />
                    <Text
                        style={{
                            fontSize: 15,
                            fontWeight: '500',
                            paddingVertical: 10,
                            paddingHorizontal: 10,
                        }}>
                        Event type
                    </Text>

                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <CheckBox
                            //title="Broadcast"
                            iconRight
                            checkedIcon="dot-circle-o"
                            uncheckedIcon="circle-o"
                            checked={eventType === 'live'}
                            onPress={() => this.props.setStateValues({ eventType: 'live' })}
                            checkedColor="#3b3a30"
                        />
                        <View>
                            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Broadcast</Text>
                            <Text>Stream your show to a large audience</Text>
                        </View>
                    </View>

                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <CheckBox
                            //title="Video Call"
                            containerStyle={{
                                backgroundColor: 'transparent',
                                borderColor: 'transparent',
                            }}
                            checkedColor="#3b3a30"
                            iconLeft
                            checkedIcon="dot-circle-o"
                            uncheckedIcon="circle-o"
                            checked={eventType === 'call'}
                            onPress={() =>
                                this.props.setStateValues({
                                    eventType: 'call',
                                    capacity: '1',
                                })
                            }
                        />
                        <View>
                            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
                                Privatecast
                            </Text>
                            <Text>Stream your show to a large audience</Text>
                        </View>
                    </View>

                    <Text
                        style={{
                            fontSize: 15,
                            fontWeight: '500',
                            paddingVertical: 10,
                            paddingHorizontal: 10,
                        }}>
                        Capacity
                    </Text>
                    <Input
                        //label="Capacity"
                        onChangeText={capacity => this.props.setStateValues({ capacity })}
                        value={capacity}
                        keyboardType="numeric"
                        maxLength={3}
                        disabled={eventType === 'call'}
                        inputContainerStyle={{
                            borderWidth: 1,
                            borderColor: '#3b3a30',
                            borderRadius: 5,
                            paddingHorizontal: 5,
                        }}
                    />

                    <Text
                        style={{
                            fontSize: 15,
                            fontWeight: '500',
                            paddingVertical: 10,
                            paddingHorizontal: 10,
                        }}>
                        Ticket Price ($)
                    </Text>
                    <Input
                        //label="Ticket Price ($)"
                        onChangeText={price => this.props.setStateValues({ price })}
                        value={price}
                        keyboardType="numeric"
                        maxLength={3}
                        inputContainerStyle={{
                            borderWidth: 1,
                            borderColor: '#3b3a30',
                            borderRadius: 5,
                            paddingHorizontal: 10,
                        }}
                    />
                    <View style={{ paddingTop: 20 }}>
                        <Button
                            title="Preview Event"
                            type="solid"
                            onPress={this.props.previewEvent}
                            buttonStyle={{
                                backgroundColor: '#3b3a30',
                                borderRadius: 10,
                                marginHorizontal: 5
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
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingHorizontal: 30,
        paddingVertical: 10,
    },
});

export default EventCreate;
