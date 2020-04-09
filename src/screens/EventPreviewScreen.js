import React, { Component } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Button, Text } from 'react-native-elements';

import HighlightedText from '../components/HighlightedText';
import EventHeader from "../components/EventHeader";
import EventBody from '../components/EventBody';


class EventPreviewScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Preview Event',
    headerRight: () => (
      <Button
        type='clear'
        onPress={() => navigation.getParam('onPublish')()}
        title={'Publish'}
        titleStyle={{ color: '#196BFF' }}
        containerStyle={{ paddingRight: 15 }}
      />
    )
  });

  state = {};

  componentDidMount() { }

  render() {
    const {
      displayName, photoURL, image, title, description, duration, eventType, capacity, price, eventDate, status
    } = this.props.navigation.getParam('event');

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <HighlightedText
          text='Your event isn’t published yet. Event ticket is going to look like this when you publish.'
        />
        <EventHeader
          eventHeader={{ image, photoURL, eventType }}
        />
        <EventBody
          eventBody={{ displayName, title, eventDate, duration, description, capacity, price }}
        />
      </ScrollView>
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
  }
});

export default EventPreviewScreen;
