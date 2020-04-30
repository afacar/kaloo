import React, { Component } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { firestore, functions } from 'react-native-firebase';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-navigation';

import { HighlightedText, BoldLabel, H1Label, ErrorLabel } from '../components/Labels';
import PreviewHeader from "../components/PreviewHeader";
import PreviewBody from '../components/PreviewBody';
import { Stage } from '../components/Stages';
import { DefaultButton } from '../components/Buttons';
import { ContactUs } from '../components/ContactUs'
import HeaderLeft from '../components/Headers/HeaderLeft';
import { ConfirmModal, convert2Date } from '../utils/Utils';
import { WaitingModal } from '../components/Modals';
import UserAvatar from '../components/UserAvatar';
import app from '../constants/app';
import { colors } from '../constants';

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
        eventData.eventDate = convert2Date(eventData.eventDate, eventData.eventTimestamp);
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
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, backgroundColor: colors.BLUE }}>
          <View style={styles.cardStyle}>
            {!status && <View style={{ flexDirection: 'row', justifyContent: "space-between", marginVertical: 20 }}>
              <Stage value="1" text="Create" />
              <Stage value="2" text="Preview" active={true} />
              <Stage value="3" text="Published" />
            </View>}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                flexGrow: 1,
                alignItems: 'stretch',
              }}>
              <View>

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
            <ContactUs screen='EventPreviewScreen' />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: "#fff"
  },
  cardStyle: {
    flex: 1,
    paddingHorizontal: 30,
    alignSelf: 'stretch',
    alignItems: 'stretch',
    backgroundColor: "white",
    borderTopRightRadius: 26,
    borderTopLeftRadius: 26,
  },
});

const mapStateToProps = ({ assets }) => {
  return { assets }
}

export default connect(mapStateToProps, null)(EventPreviewScreen);
