import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Dimensions } from 'react-native';
import { Button, Card, Avatar } from 'react-native-elements';

import { HighlightedText } from '../components/Labels';
import PreviewHeader from "../components/PreviewHeader";
import PreviewBody from '../components/PreviewBody';
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
            source={{ uri: auth().currentUser.photoURL } || require('../assets/profile.png')}
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
      <ScrollView contentContainerStyle={styles.container}>
        {!isPublished && <HighlightedText
          text='Your event isn’t published yet. Event ticket is going to look like this when you publish.'
        />}
        <Card containerStyle={{ marginHorizontal: 0, margin: 5 }}>
          <PreviewHeader
            event={{ image, photoURL, eventType }}
          />
          <PreviewBody
            event={{ displayName, title, eventDate, duration, description, capacity, price }}
          />
        </Card>
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
