import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { Input, Button, Text, Card } from 'react-native-elements';

const LabeledText = (props) => {
  const { label, text } = props;
  console.log('labeledtxt props', props)
  return (
    <View style={{ flexDirection: 'row', paddingVertical: 3 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{label}: </Text>
      <Text style={{ fontSize: 20 }}>{text}</Text>
    </View>
  )
}

class EventPreview extends Component {
  state = {
    isPublishing: false,
  };

  componentDidMount() { }

  componentWillUnmount() { }

  _confirmPublish() {
    console.log('confirm this.props', this.props);
    Alert.alert('You will publish event', 'This can not be undone!', [
      {
        text: 'Cancel',
        onPress: () => {
          this.props.cancel();
        },
        style: 'cancel',
      },
      {
        text: 'Yes, Publish',
        onPress: () => {
          this.setState({ isPublishing: true });
          this.props.publish();
        },
      },
    ]);
  }

  render() {
    const { isPublishing } = this.state;
    const {
      displayName,
      image,
      title,
      description,
      duration,
      eventType,
      capacity,
      price,
      eventDate,
      eventLink,
      status,
      isWaiting,
    } = this.props.event;
    console.log('event preview render', this.props);
    return (
      <View style={styles.container}>
        <View
          style={{
            alignContent: 'center',
            backgroundColor: '#b2c2bf',
            borderRadius: 10,
            paddingHorizontal: 10,
            paddingVertical: 10,
            marginBottom: 20,
          }}>
          <Text style={{ textAlign: 'center' }}>
            This is how your event is going to look when you publish.
          </Text>
        </View>
        <View>
          <View style={{ alignSelf: 'center' }}>
            <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />
          </View>
          <LabeledText label={'Host'} text={displayName} />
          <LabeledText label={'Title'} text={title || 'No title'} />
          <LabeledText label={'Description'} text={description || 'No description'} />
          <LabeledText label={'Duration'} text={duration} />
          <LabeledText label={'Capacity'} text={capacity} />
          <LabeledText label={'Event Type'} text={eventType} />
          <LabeledText label={'Price'} text={price} />
          <LabeledText label={'Event Date'} text={eventDate.toLocaleString()} />

          <View style={{ justifyContent: 'space-around', flexDirection: 'row' }}>
            <Button
              disabled={isWaiting}
              title="Edit"
              onPress={() => this.props.cancel()}
            />
            <Button
              disabled={isWaiting}
              title="Publish"
              onPress={() => this._confirmPublish()}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 2,
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 15,
    alignSelf: 'center'
  },
});

export default EventPreview;
