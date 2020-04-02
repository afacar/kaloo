import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Input, Button, Card, Image, Avatar, CheckBox, Icon } from 'react-native-elements';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ImagePicker from "react-native-image-picker";

class EventCreate extends Component {
    state = { isDatePickerVisible: false }

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
                //this.setState({ image: response.uri, pickerResponse: response })
                this.props.setStateValues({ image: response.uri, pickerResponse: response })
            }
        });
    }

    onDateChange = (selectedDate) => {
        this.setState({ isDatePickerVisible: false })
        this.props.setStateValues({ eventDate: selectedDate, dateMessage: '' })
    };

    render() {
        const { image, title, description, duration, eventType, capacity, price, eventDate, titleMessage, dateMessage } = this.props.event;
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <View style={{ paddingVertical: 10, paddingHorizontal: 20 }}>
                    <TouchableOpacity onPress={() => this.onImagePressed()} style={{ flexDirection: 'column', alignContent: 'center' }} >
                        <Image
                            containerStyle={{ alignSelf: 'stretch', height: 100 }}
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
                        onChangeText={(title) => this.props.setStateValues({ title, titleMessage: '' })}
                        value={title}
                        errorMessage={titleMessage}
                    />
                    <Input
                        placeholder='Event description'
                        onChangeText={(description) => this.props.setStateValues({ description })}
                        value={description}
                        multiline
                    />
                    <View style={{ alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'space-between', borderColor: 'blue', marginTop: 10 }}>
                        <TouchableOpacity onPress={() => this.setState({ isDatePickerVisible: true })}>
                            <Input
                                label='Date/Time of Event'
                                value={eventDate.toLocaleString()}
                                disabled
                                errorMessage={dateMessage}
                            />
                        </TouchableOpacity>
                        <Input
                            label='Duration (min)'
                            value={duration}
                            onChangeText={(duration) => this.props.setStateValues({ duration })}
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
                            checked={eventType === 'live'}
                            onPress={() => this.props.setStateValues({ eventType: 'live' })}
                        />
                        <CheckBox
                            center
                            title='Video Call'
                            iconRight
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            checked={eventType === 'call'}
                            onPress={() => this.props.setStateValues({ eventType: 'call', capacity: '1' })}
                        />
                    </View>
                    <View style={{ flexDirection: 'column', justifyContent: 'center', borderColor: 'orange', borderWidth: 2 }}>
                        <Input
                            label='Capacity'
                            onChangeText={(capacity) => this.props.setStateValues({ capacity })}
                            value={capacity}
                            keyboardType='numeric'
                            maxLength={3}
                            disabled={eventType === 'call'}
                        />
                        <Input
                            label='Ticket Price ($)'
                            onChangeText={(price) => this.props.setStateValues({ price })}
                            value={price}
                            keyboardType='numeric'
                            maxLength={3}
                        />
                    </View>
                    <Button title='Preview Event' type='outline' onPress={this.props.previewEvent} />
                </View>
            </ScrollView>
        )
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})

export default EventCreate;