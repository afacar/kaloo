import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-navigation'
import { connect } from 'react-redux';

import * as actions from '../appstate/actions/host_actions';
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../utils/BackHandler'
import EventShare from '../components/EventShare';
import { Stage } from '../components/Stages';
import { H1Label } from '../components/Labels';
import { DefaultButton } from '../components/Buttons';

import HeaderLeft from '../components/Headers/HeaderLeft';
import HeaderRight from '../components/Headers/HeaderRight';
import { ContactUs } from '../components/ContactUs';


class EventPublishScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Event ready!',
    headerLeft: () => <HeaderLeft onPress={() => navigation.navigate('UserHome')} />,
    headerRight: () => <HeaderRight title='Done' onPress={() => navigation.navigate('UserHome')} />
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
      <SafeAreaView style={styles.container} forceInset={{ bottom: 'never' }}>
        <View style={styles.componentStyle}>
          <View style={{ flexDirection: 'row', justifyContent: "space-between", marginVertical: 20 }}>
            <Stage value="1" text="Create" />
            <Stage value="2" text="Preview" />
            <Stage value="3" text="Published" active={true} />
          </View>
          <H1Label label="Your meeting is set!" />
          <EventShare
            link={myEvent.eventLink}
          />
          <View style={{ marginVertical: 15 }}>
            <DefaultButton
              title='Go to Event'
              onPress={() => {
                this.props.setHostEventListener(myEvent)
                this.props.setMyViewersListener(myEvent)
                this.props.navigation.navigate('Host', { event: myEvent })
              }}
            />
            <View style={{ marginVertical: 15 }}>
              <DefaultButton
                title='Go to Event'
                onPress={() => this.props.navigation.navigate('MyEvent', { event: myEvent })}
              />
            </View>
          </View>
        </View>
        <ContactUs />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: "#3598FE",
    justifyContent: 'flex-start',
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

export default connect(null, actions)(EventPublishScreen);
