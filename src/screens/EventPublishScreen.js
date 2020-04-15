import React, { Component } from 'react';
import { StyleSheet, ScrollView, BackHandler } from 'react-native';
import { Button, Icon } from 'react-native-elements';

import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../utils/BackHandler'
import EventShare from '../components/EventShare';


class EventPublishScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Event ready!',
    headerLeft: () => (
      <Button
        type='clear'
        onPress={() => navigation.navigate('UserHome')}
        containerStyle={{ marginLeft: 15 }}
        icon={<Icon type="ionicon"
          name={Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back'}
          color="black"
        />}
      />
    ),
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

  componentDidMount() {
    handleAndroidBackButton(this.handleBackButton)
  }

  handleBackButton = () => {
    this.props.navigation.popToTop()
    return true
  }

  componentWillUnmount() {
    removeAndroidBackButtonHandler(this.handleBackButton)
  }

  render() {
    const myEvent = this.props.navigation.getParam('event');

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <EventShare
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
