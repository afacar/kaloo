import React, { Component } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { firestore, functions } from 'react-native-firebase';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-navigation';

import { HighlightedText, BoldLabel, H1Label, ErrorLabel } from '../components/Labels';
import PreviewHeader from "../components/PreviewHeader";
import PreviewBody from '../components/PreviewBody';
import { Stage1, Stage2, Stage3 } from '../components/Stages';
import { DefaultButton } from '../components/Buttons';
import { ContactUs } from '../components/ContactUs'
import HeaderLeft from '../components/Headers/HeaderLeft';
import { ConfirmModal } from '../utils/Utils';
import { WaitingModal } from '../components/Modals';
import UserAvatar from '../components/UserAvatar';
import app from '../constants/app';

const { BROADCAST } = app.EVENT_TYPE;

class EventPreviewScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: () => <UserAvatar />,
    headerLeft: () => <HeaderLeft onPress={navigation.goBack} />

  });

  state = { isWaiting: false, ...this.props.navigation.getParam('event') }

  createEvent = async () => {
    let { uid, displayName, userNumber, photoURL, image, title, description, duration, eventType, capacity, price, eventDate } = this.state
    let event = { uid, displayName, userNumber, photoURL, image, title, description, duration, eventType, capacity, price, eventDate }
    let createEvent = functions().httpsCallable('createEvent');
    event.eventTimestamp = eventDate.getTime();

    this.setState({ isWaiting: true })
    try {
      let response = await createEvent(event);
      if (response && response.data && response.data.state === 'SUCCESS') {
        let eventData = response.data.event;
        let date = eventData.eventDate
        if (date instanceof firestore.Timestamp) {
          date = date.toDate();
        } else if (eventData.eventTimestamp) {
          date = new Date(eventData.eventTimestamp);
        }
        eventData.eventDate = date
        this.setState({ isWaiting: false })
        this.props.navigation.navigate('EventPublish', { event: eventData })
      } else {
        this.setState({ isWaiting: false, errorMessage: response.data.message })
      }
    } catch (error) {
      this.setState({ isWaiting: false, errorMessage: error.message })
    }
  }

  _confirmPublish = () => {
    const title = 'You will publish event',
      message = 'You won’t be able to edit your meeting  details after you publish it.',
      confirmText = 'Publish',
      cancelText = 'Back';
    ConfirmModal(title, message, confirmText, cancelText, this.createEvent)
  }

  render() {
    const {
      displayName, photoURL, image, title, description, duration, eventType, capacity, price, eventDate, isWaiting, status
    } = this.state;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <View style={{ flex: 1, backgroundColor: "#3598FE" }}>
          <ScrollView contentContainerStyle={{
            flexGrow: 1,
            alignItems: 'center',
            backgroundColor: "#3598FE"
          }}>
            <View style={styles.componentStyle}>
              {!status && <View style={{ flexDirection: 'row', justifyContent: "space-between", marginVertical: 20 }}>
                <Stage3 value="1" text="Create" />
                <Stage2 value="2" text="Preview" />
                <Stage1 value="3" text="Published" />
              </View>}
              {!status && <H1Label label="Preview & Publish" />}
              {!status && <HighlightedText
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
              {!status &&
                <View>
                  <ErrorLabel label={this.state.errorMessage} />
                  <DefaultButton
                    title={eventType === BROADCAST ? 'Publish your event' : 'Publish your meeting'}
                    disabled={isWaiting}
                    onPress={this._confirmPublish}
                  />
                </View>
              }
              <WaitingModal isWaiting={isWaiting} text='Creating your event...' />
            </View>
          </ScrollView>
          <ContactUs />
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
