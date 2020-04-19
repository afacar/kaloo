import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Modal } from 'react-native';
import { Avatar } from 'react-native-elements';
import { storage, firestore, functions, auth } from 'react-native-firebase';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-navigation';

import { HighlightedText, BoldLabel, H1Label } from '../components/Labels';
import PreviewHeader from "../components/PreviewHeader";
import PreviewBody from '../components/PreviewBody';
import { Stage1, Stage2, Stage3 } from '../components/Stages';
import { DefaultButton } from '../components/Buttons';
import { ContactUs } from '../components/ContactUs'

import { colors, dimensions } from '../constants';
import HeaderLeft from '../components/Headers/HeaderLeft';
import { ConfirmModal } from '../utils/Utils';
import { WaitingModal } from '../components/Modals';


class EventPreviewScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerStyle: { backgroundColor: colors.BLUE, borderBottomWidth: 0, elevation: 0, shadowOpacity: 0 },
    headerTitle: () => {
      return (
        <View style={{ flex: 1, alignItems: 'center', marginLeft: Platform.OS === "ios" ? 0 : dimensions.HEADER_LEFT_MARGIN }}>
          <Avatar
            rounded={true}
            size='small'
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
    },

  });

  state = { isWaiting: false, ...this.props.navigation.getParam('event') }

  createEvent = async () => {
    let { uid, displayName, userNumber, photoURL, image, title, description, duration, eventType, capacity, price, eventDate, status } = this.state
    const { DEFAULT_EVENT_IMAGE } = this.props.assets;

    let event = { uid, displayName, userNumber, photoURL, image, title, description, duration, eventType, capacity, price, eventDate, status }
    let createEvent = functions().httpsCallable('createEvent');
    event.eventTimestamp = eventDate.getTime();

    this.setState({ isWaiting: true })

    // Check if new event image is set
    if (image !== DEFAULT_EVENT_IMAGE) {
      // TODO: Upload image to ...
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

  _confirmPublish = () => {
    const title = 'You will publish event',
      message = 'This can not be undone!',
      confirmText = 'Yes, Publish',
      cancelText = 'Cancel';
    ConfirmModal(title, message, confirmText, cancelText, this.createEvent)
  }

  render() {
    const {
      displayName, photoURL, image, title, description, duration, eventType, capacity, price, eventDate, status, isPublished, isWaiting
    } = this.state;
    console.log('Preview render state', this.state)

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <View style={{ flex: 1, backgroundColor: "#3598FE" }}>
          <ScrollView contentContainerStyle={{
            flexGrow: 1,
            alignItems: 'center',
            backgroundColor: "#3598FE"
          }}>
            <View style={styles.componentStyle}>
              {!isPublished && <View style={{ flexDirection: 'row', justifyContent: "space-between", marginVertical: 20 }}>
                <Stage3 value="1" text="Create" />
                <Stage2 value="2" text="Preview" />
                <Stage1 value="3" text="Published" />
              </View>}
              {!isPublished && <H1Label label="Preview & Publish" />}
              {!isPublished && <HighlightedText
                text='This is how your event is going to look like when it’s shared to your audience.'
              />}
              <BoldLabel label="Event Card Preview" />
              <View style={{ borderWidth: 1, borderColor: "#c4c4c4", flex: 1, marginBottom: 30 }}>
                <PreviewHeader
                  event={{ image, photoURL, eventType }}
                />
                <View style={{ paddingHorizontal: 10 }}>
                  <PreviewBody
                    event={{ displayName, title, eventDate, duration, description, capacity, price }}
                  />
                </View>
              </View>
              {!isPublished && <DefaultButton
                title="Publish your event"
                disabled={isWaiting}
                onPress={this._confirmPublish}
              />}
              <ContactUs />
              <WaitingModal isWaiting={isWaiting} text='Creating your event...' />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 15
  },
  componentStyle: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 10,
    alignSelf: 'stretch',
    paddingVertical: 20,
    backgroundColor: "white",
    borderTopRightRadius: 26,
    borderTopLeftRadius: 26,
  },
});

const mapStateToProps = ({ assets }) => {
  return { assets: assets.assets }
}

export default connect(mapStateToProps, null)(EventPreviewScreen);
