import React, { Component } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Button, Avatar } from 'react-native-elements';

import { HighlightedText, BoldLabel } from '../components/Labels';
import PreviewHeader from "../components/PreviewHeader";
import PreviewBody from '../components/PreviewBody';
import { Stage1, Stage2, Stage3 } from '../components/Stages';
import { H1Label } from '../components/Labels';
import { SafeAreaView } from 'react-navigation'
import { DefaultButton } from '../components/Buttons';
import { ContactUs } from '../components/ContactUs'

import { colors, dimensions } from '../constants';
import { auth } from 'react-native-firebase';
import HeaderLeft from '../components/Headers/HeaderLeft';


class EventPreviewScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerStyle: { backgroundColor: colors.BLUE, borderBottomWidth: 0, elevation: 0, shadowOpacity: 0 },
    headerTitle: () => {
      return (
        <View style={{ flex: 1, alignItems: 'center', marginLeft: dimensions.HEADER_LEFT_MARGIN }}>
          <Avatar
            rounded={true}
            size='medium'
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
    headerRight: () => (
      !navigation.getParam('event').isPublished && <Button
        type='clear'
        onPress={() => navigation.getParam('onPublish')()}
        title={'Publish'}
        titleStyle={{ color: 'white' }}
        containerStyle={{ paddingRight: 15 }}
      />
    )
  });

  state = {};

  componentDidMount() { }

  render() {
    const {
      displayName, photoURL, image, title, description, duration, eventType, capacity, price, eventDate, status, isPublished
    } = this.props.navigation.getParam('event');

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',
          backgroundColor: "#3598FE"
        }}>
          <View style={styles.componentStyle}>
            <View style={{ flexDirection: 'row', justifyContent: "space-between", marginVertical: 20 }}>
              <Stage3 value="1" text="Create" />
              <Stage2 value="2" text="Preview" />
              <Stage1 value="3" text="Published" />
            </View>
            <H1Label label="Preview & Publish" />
            {!isPublished && <HighlightedText
              text='Your event isn’t published yet. Event ticket is going to look like this when you publish.'
            />}
            <BoldLabel label="Event Card Preview" />
            <View style={{ borderWidth: 1, borderColor: "#c4c4c4", flex: 1,marginBottom:30 }}>
              <PreviewHeader
                event={{ image, photoURL, eventType }}
              />
              <View style={{paddingHorizontal:10}}>
                <PreviewBody
                  event={{ displayName, title, eventDate, duration, description, capacity, price }}
                />
              </View>
            </View>
           <DefaultButton 
            title="Publish your event"
            onPress={() => this.props.navigation.getParam('onPublish')()}/>
            <ContactUs/>
          </View>
        </ScrollView>
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

export default EventPreviewScreen;
