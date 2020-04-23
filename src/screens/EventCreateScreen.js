import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { storage } from 'react-native-firebase';
import { Input, Image, CheckBox, Icon } from 'react-native-elements';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ImagePicker from 'react-native-image-crop-picker';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-navigation'

import { H1Label, BoldLabel, Label } from '../components/Labels';
import { Stage1, Stage2 } from '../components/Stages';
import { ContactUs } from '../components/ContactUs'
import { splitDate } from '../utils/Utils';
import { DefaultButton } from '../components/Buttons';
import HeaderLeft from '../components/Headers/HeaderLeft';
import UserAvatar from '../components/UserAvatar';
import app from '../constants/app';

const { MEETING, BROADCAST } = app.EVENT_TYPE;

const INITIAL_STATE = {
  image: null,
  title: '',
  description: '',
  duration: 30,
  eventType: BROADCAST,
  capacity: 5,
  price: 1,
  isDatePickerVisible: false,
  eventDate: new Date(),
  eventLink: '',
  titleMessage: '',
  dateMessage: '',
  isPreview: false,
}


class EventCreateScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: () => <UserAvatar />,
    headerLeft: () => <HeaderLeft onPress={navigation.goBack} />
  });

  state = { ...INITIAL_STATE, ...this.props.profile, image: this.props.assets.DEFAULT_EVENT_IMAGE }

  onImagePressed = () => {
    const { uid } = this.state;
    const eventTimestamp = new Date().getTime()

    ImagePicker.openPicker({
      path: 'my-event-image.jpg',
      width: 600,
      height: 300,
      cropping: true,
    }).then(image => {
      if (Platform.OS === 'ios')
        image.path = image.path.replace('file://', '');
      console.log('picked image', image);
      // TODO: Upload image to ...
      this.setState({ uploading: true })
      let imagePath = `events/${uid}/${eventTimestamp}.jpg`
      const imageRef = storage().ref(imagePath)
      imageRef.putFile(image.path).then(() => {
        imageRef.getDownloadURL()
          .then((newImageURL) => {
            this.setState({ uploading: false, image: newImageURL, imagePickerResponse: image });
          })
      })
    }).catch(error => {
      console.log('image-picker err:', error)
      this.setState({ uploading: false, uploadError: error.message })
    })
  }

  onDateChange = (selectedDate) => {
    this.setState({ isDatePickerVisible: false, eventDate: selectedDate, dateMessage: '' });
  }

  render() {
    const { image, title, description, duration, eventType, capacity, price, eventDate, titleMessage, dateMessage } = this.state;
    const { date, time, gmt } = splitDate(eventDate)
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : ''} style={styles.container}>
          <View style={{ flex: 1, backgroundColor: "#3598FE" }}>
            <ScrollView contentContainerStyle={{
              flexGrow: 1,
              alignItems: 'center',
              backgroundColor: "#3598FE",
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
                    {this.state.uploading ? <ActivityIndicator size='small' style={{
                      position: 'absolute',
                      right: 5,
                      bottom: 5,
                    }} /> : <Icon
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

                    }
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
                    checked={eventType === BROADCAST}
                    onPress={() => this.setState({ eventType: BROADCAST })}
                    checkedColor="#FF3E6C"
                    uncheckedColor="#FF3E6C"
                    containerStyle={{ paddingHorizontal: 0 }} />
                  <View style={{ paddingRight: 25 }}>
                    <TouchableOpacity onPress={() => this.setState({ eventType: BROADCAST })}>
                      <BoldLabel label="Broadcasting Event" />
                      <Label label="Stream to large audience. You won’t be hearing your audience, communcation is one way." />
                    </TouchableOpacity>
                    {eventType === BROADCAST && <View>
                      <BoldLabel label="How many viewers do you want?" />
                      <Input
                        onChangeText={capacity => this.setState({ capacity: parseInt(capacity) || 0 })}
                        value={capacity + ''}
                        keyboardType="numeric"
                        maxLength={3}
                        disabled={eventType === MEETING}
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
                    checked={eventType === MEETING}
                    onPress={() => this.setState({ eventType: MEETING, capacity: 1, })}
                    checkedColor="#FF3E6C"
                    uncheckedColor="#FF3E6C"
                    containerStyle={{ paddingHorizontal: 0 }} />
                  <View>
                    <TouchableOpacity onPress={() => this.setState({ eventType: MEETING, capacity: 1 })}>
                      <BoldLabel label="1-1 Meeting" />
                      <Label label="Create a private video call with just one person." />
                    </TouchableOpacity>
                  </View>
                </View>

                <BoldLabel label="Ticket Price (USD)" />
                <Input
                  placeholder="Price"
                  placeholderTextColor='#c4c4c4'
                  onChangeText={price => this.setState({ price: parseInt(price) || 0 })}
                  value={price + ''}
                  keyboardType="numeric"
                  maxLength={3}
                  inputContainerStyle={styles.inputContainerStyle}
                  containerStyle={{ paddingHorizontal: 0 }}
                />
                <View style={{ paddingTop: 20 }}>
                  <DefaultButton
                    title="Preview"
                    onPress={() => this.props.navigation.navigate('EventPreview', { event: this.state })}
                    disabled={this.state.uploading}
                  />
                </View>
              </View>
            </ScrollView>
            <ContactUs />
          </View>
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