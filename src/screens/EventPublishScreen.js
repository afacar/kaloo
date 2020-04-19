import React, { Component, Fragment } from 'react';
import { StyleSheet, ScrollView, BackHandler, View } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation'
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../utils/BackHandler'
import EventShare from '../components/EventShare';
import { Stage1, Stage2, Stage3 } from '../components/Stages';
import { H3Label, H1Label } from '../components/Labels';
import { DefaultButton } from '../components/Buttons';

import { app, colors, dimensions } from '../constants';


class EventPublishScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerStyle: { backgroundColor: colors.BLUE, borderBottomWidth: 0, elevation: 0, shadowOpacity: 0 },
    title: 'Event ready!',
    headerTitleStyle: { color: '#fff' },
    headerLeft: () => (
      <Button
        type='clear'
        onPress={() => navigation.navigate('UserHome')}
        containerStyle={{ marginLeft: 15 }}
        icon={<Icon type="ionicon"
          name={Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back'}
          color="#fff"
        />}
      />
    ),
    headerRight: () => (
      <Button
        type='clear'
        onPress={() => navigation.navigate('UserHome')}
        title={'Done'}
        titleStyle={{ color: '#fff' }}
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
      <SafeAreaView style={{ flex: 1, backgroundColor: "#3598FE" }} forceInset={{ bottom: 'never' }}>
        <View style={styles.componentStyle}>
          <View style={{ flexDirection: 'row', justifyContent: "space-between", marginVertical: 20 }}>
            <Stage3 value="1" text="Create" />
            <Stage3 value="2" text="Preview" />
            <Stage2 value="3" text="Published" />
          </View>
          <H1Label label="Your meeting is set!" />
          <EventShare
            link={myEvent.eventLink}
          />
          <View style={{ marginVertical: 15 }}>
            <DefaultButton
              title='Go to Event'
              onPress={() => this.props.navigation.navigate('MyEvent', { event: myEvent })}
            />
          </View>
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
    paddingHorizontal: 40,
    paddingVertical: 10,
    alignSelf: 'stretch',
    paddingVertical: 20,
    backgroundColor: "white",
    borderTopRightRadius: 26,
    borderTopLeftRadius: 26,
  },
});

export default EventPublishScreen;
