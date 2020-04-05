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
import HighlightedText from './HighlightedText';

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
                        Create Event
                    </Text>
                    <HighlightedText text='You can preview before publishing.' />
                    <Text style={styles.labelStyle}>Event Image</Text>
                    <Text style={{paddingBottom:10}}>This image is going to be displayed on top of your event card. </Text>
                    <TouchableOpacity
                        onPress={() => this.onImagePressed()}
                        style={{ flexDirection: 'column', alignContent: 'center' }}>
                        <Image  containerStyle={{ alignSelf: 'stretch',borderWidth:1,height: 150}}
                            source={{ uri: image }}
                            style={{ flex:1 }}
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
                        containerStyle={{paddingHorizontal:0}}
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
                            containerStyle={{paddingHorizontal:0}}
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
                        inputContainerStyle={{...styles.inputContainerStyle, height:150}}
                        containerStyle={{paddingHorizontal:0}}
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
                            containerStyle={{paddingHorizontal:0}}/>
                       
                            <TouchableOpacity onPress={() => this.props.setStateValues({ eventType: 'live' })}>
                                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Broadcast</Text>
                                <Text style={{paddingRight:30}}>Stream to large audience. You won’t be hearing your audience, communcation is one way.</Text>
                            </TouchableOpacity>
                    </View>
                    <View></View>
                    <View style={styles.checkBoxStyle}>
                        <CheckBox
                            iconLeft
                            checkedIcon="dot-circle-o"
                            uncheckedIcon="circle-o"
                            checked={eventType === 'call'}
                            onPress={() => this.props.setStateValues({eventType: 'call', capacity: '1',})}
                            checkedColor="#3b3a30"
                            containerStyle={{paddingHorizontal:0}}/>
                        <View>
                            <TouchableOpacity onPress={() => this.props.setStateValues({eventType: 'call', capacity: '1'})}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Privatecast</Text>
                            <Text style={{paddingRight:30}}>Stream to one to up to 5 viewers. Your viewer(s) can stream back to you and you can hear them back. </Text>
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
                        containerStyle={{paddingHorizontal:0}} />

                    <Text style={styles.labelStyle}>Ticket Price ($)</Text>
                    <Input
                        //label="Ticket Price ($)"
                        onChangeText={price => this.props.setStateValues({ price })}
                        value={price}
                        keyboardType="numeric"
                        maxLength={3}
                        inputContainerStyle={styles.inputContainerStyle}
                        containerStyle={{paddingHorizontal:0}}/>
                    <View style={{ paddingTop: 20 }}>
                        <Button
                            title="Preview Event"
                            type="solid"
                            onPress={this.props.previewEvent}
                            buttonStyle={{
                                backgroundColor: '#196BFF',
                                borderRadius: 6,
                                paddingVertical:15
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
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    labelStyle: {
        fontSize: 17,
        fontWeight: '600',
        paddingVertical: 10,
    },
    inputContainerStyle: {
        borderWidth: 1,
        borderColor: '#3b3a30',
        borderRadius: 6,
        paddingHorizontal: 10,
        marginHorizontal:0,
        paddingVertical:5,
        },
    timeTextStyle: {
        fontSize: 17,
        borderWidth: 1,
        borderColor: '#3b3a30',
        borderRadius: 5,
        paddingVertical: 12,
        paddingHorizontal: 5,
    },
    checkBoxStyle: {
        flex: 1,
        flexDirection: 'row',
    }
});

export default EventCreate;
