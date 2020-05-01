import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { storage } from 'react-native-firebase';
import { Input, Image, CheckBox, Icon } from 'react-native-elements';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ImagePicker from 'react-native-image-crop-picker';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-navigation'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { H1Label, BoldLabel, Label, ErrorLabel, RedLabel } from '../components/Labels';
import { Stage } from '../components/Stages';
import { ContactUs } from '../components/ContactUs'
import { splitDate } from '../utils/Utils';
import { DefaultButton } from '../components/Buttons';
import HeaderLeft from '../components/Headers/HeaderLeft';
import UserAvatar from '../components/UserAvatar';
import EventImagePicker from '../components/EventImagePicker';
import app from '../constants/app';
import { colors } from '../constants';

const { CALL, BROADCAST } = app.EVENT_TYPE;

const INITIAL_STATE = {
  image: null,
  title: '',
  description: '',
  duration: '',
  eventType: BROADCAST,
  capacity: '',
  capacityMessage: '',
  price: '',
  priceMessage: '',
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
    if (selectedDate < Date.now())
      return this.setState({ isDatePickerVisible: false, dateMessage: 'We need a future date' })
    this.setState({ isDatePickerVisible: false, eventDate: selectedDate, dateMessage: '' });
  }

  _preview = () => {
    const { title, price, capacity, eventDate, duration } = this.state;
    this.setState({ titleMessage: '' })
    if (!title) {
      return this.setState({ titleMessage: 'We need a title' })
    }
    if (eventDate < new Date()) {
      return this.setState({ dateMessage: 'You need to select a future date' })
    }
    if (duration < 1) {
      return this.setState({ durationMessage: 'We need a duration for the event' })
    }
    if (capacity < 1) {
      return this.setState({ capacityMessage: 'Viewers should be at least 1' })
    }
    if (price < 1) {
      return this.setState({ priceMessage: 'Price should be at least $1' })
    }
    this.props.navigation.navigate('EventPreview', { event: this.state })
  }

  render() {
    const {
      image, title, description,
      duration, eventType, capacity,
      price, eventDate, titleMessage,
      dateMessage, priceMessage, uploading,
      capacityMessage, durationMessage } = this.state;
    const { date, time, gmt } = splitDate(eventDate)
    const warning = titleMessage || dateMessage || durationMessage || capacityMessage || priceMessage;
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, backgroundColor: colors.BLUE }}>
          <View style={styles.cardStyle}>
            <View style={{ flexDirection: 'row', justifyContent: "space-between", marginVertical: 10 }}>
              <Stage value="1" text="Create" active={true} />
              <Stage value="2" text="Preview" />
              <Stage value="3" text="Published" />
            </View>
            <KeyboardAwareScrollView
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            >
              <H1Label label="Create an event" />
              <BoldLabel label="Meeting Image" />
              <Label label='This image is going to be displayed on top of your invitation card.' />
              <EventImagePicker
                image={image}
                onPress={this.onImagePressed}
                uploading={uploading}
              />

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
              <ErrorLabel label={dateMessage} />
              <DateTimePickerModal
                isVisible={this.state.isDatePickerVisible}
                mode="datetime"
                onConfirm={this.onDateChange}
                onCancel={() => this.setState({ isDatePickerVisible: false })}
                display='spinner'
              />
              <Text style={{ color: "#c4c4c4" }}>*based on current time zone of your device</Text>
              <BoldLabel label='Duration (minutes)' />
              <Input
                value={duration + ''}
                placeholder={'Set a duration'}
                placeholderTextColor='#c4c4c4'
                onChangeText={duration => this.setState({ durationMessage: '', duration: duration && parseInt(duration) })}
                inputContainerStyle={styles.inputContainerStyle}
                containerStyle={{ paddingHorizontal: 0 }}
                keyboardType='numeric'
                errorMessage={durationMessage}
                maxLength={3}
              />
              <BoldLabel label="Description" />
              <Input
                placeholder="Write about your meeting"
                placeholderTextColor='#c4c4c4'
                onChangeText={description => this.setState({ description })}
                value={description}
                multiline={true}
                inputContainerStyle={{ ...styles.inputContainerStyle, height: 100 }}
                inputStyle={{ alignSelf: 'flex-start' }}
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
                      onChangeText={capacity => this.setState({ capacityMessage: '', capacity: capacity && parseInt(capacity) })}
                      value={capacity + ''}
                      placeholder='max. 999'
                      placeholderTextColor='#c4c4c4'
                      keyboardType="numeric"
                      maxLength={3}
                      disabled={eventType === CALL}
                      inputContainerStyle={styles.inputContainerStyle}
                      containerStyle={{ paddingHorizontal: 0 }}
                      errorMessage={capacityMessage}
                    />
                  </View>}
                </View>
              </View>
              <View style={styles.checkBoxStyle}>
                <CheckBox
                  iconLeft
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checked={eventType === CALL}
                  onPress={() => this.setState({ eventType: CALL, capacity: 1, })}
                  checkedColor="#FF3E6C"
                  uncheckedColor="#FF3E6C"
                  containerStyle={{ paddingHorizontal: 0 }} />
                <View>
                  <TouchableOpacity onPress={() => this.setState({ eventType: CALL, capacity: 1 })}>
                    <BoldLabel label="1-1 Meeting" />
                    <Label label="Create a private video call with just one person." />
                  </TouchableOpacity>
                </View>
              </View>

              <BoldLabel label="Ticket Price (USD)" />
              <Input
                placeholder='Price'
                placeholderTextColor='#c4c4c4'
                onChangeText={price => this.setState({ price: price && parseInt(price), priceMessage: '' })}
                value={price + ''}
                keyboardType="numeric"
                maxLength={3}
                inputContainerStyle={styles.inputContainerStyle}
                containerStyle={{ paddingHorizontal: 0 }}
                errorMessage={priceMessage}
              />
              <View style={{ paddingTop: 10 }}>
                <ErrorLabel label={warning && 'Check for required fields↑'}/>
                <DefaultButton
                  title="Preview"
                  onPress={this._preview}
                  disabled={this.state.uploading}
                />
              </View>
            </KeyboardAwareScrollView>
          </View>
          <ContactUs />
        </View>
      </SafeAreaView>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
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
  cardStyle: {
    flex: 1,
    paddingHorizontal: 30,
    alignSelf: 'stretch',
    backgroundColor: "white",
    borderTopRightRadius: 26,
    borderTopLeftRadius: 26,
  },
})

const mapStateToProps = ({ profile, assets }) => {
  return { profile, assets }
}


export default connect(mapStateToProps, null)(EventCreateScreen);