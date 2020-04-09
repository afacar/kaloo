import React, { Component } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Button, Text } from 'react-native-elements';

import EventShare from '../components/EventShare';


class EventPublishScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Event ready!',
    headerRight: () => (
      <Button
        type='clear'
        onPress={() => navigation.navigate('UserHome')}
        title={'Done'}
        titleStyle={{ color: '#196BFF' }}
        containerStyle={{ paddingRight: 15 }}
      />
    )
  });

  state = {};

  componentDidMount() { }

  render() {
    const myEvent = this.props.navigation.getParam('event');

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <EventShare
          text='Your event isn’t published yet. Event ticket is going to look like this when you publish.'
          link={myEvent.eventLink}
        />
        <Button
          title='Go to Event'
          onPress={() => this.props.navigation.navigate('MyEvent', { event: myEvent })}
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

export default EventPublishScreen;
