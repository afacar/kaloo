import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  ImageBackground
} from 'react-native';
import { Input, Button, Text, Card, Slider } from 'react-native-elements';
import HighlightedText from './HighlightedText';
import firebase from "react-native-firebase";

const currentUser = firebase.auth().currentUser;

const LabeledText = (props) => {
  const { label, text } = props;
  console.log('labeledtxt props', props)
  return (
    <View style={{ flexDirection: 'row', paddingVertical: 3 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{label} </Text>
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
    console.log('currentUser', currentUser)
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
      totalTicket,
      soldTicket,
    } = this.props.event;
    console.log('event preview render', this.props);
    return (
        <View style={styles.container}>
          <HighlightedText text='Your event isn’t published yet.Event ticket is going to look like this when you publish.' />

          <View style={{}}>
            <View style={{ flex: 1, marginBottom: 20 }}>
              <ImageBackground source={{ uri: image }} style={{ flex: 1, resizeMode: "cover", width: '100%', height: '75%', borderTopRadius:6 }} imageStyle={{ borderTopRightRadius:6, borderTopLeftRadius:6 }}>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Image source={{ uri: currentUser.photoURL }} style={styles.imageStyle} />
                  <Text style={styles.eventTypeStyle}>{eventType}</Text>
                </View>
              </ImageBackground>
            </View>

            <View style={{ marginLeft: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>{displayName}</Text>
              <Text style={{ fontSize: 30, fontWeight: "normal" }}>{title}</Text>
              <Text style={{ fontSize: 17, color: 'gray'}}>{eventDate.toLocaleString()}</Text>
              <Text style={{ fontSize: 20, fontWeight: '500', marginVertical: 20 }}>{description || 'No description'}</Text>
              <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 10 }}>Available Tickets</Text>

              <View style={{}}>
                <Text style={{ left: 85 }}>{soldTicket || 15} left</Text>
                <Slider
                  trackStyle={{height:10, backgroundColor:'#196BFF', borderBottomRightRadius: 20,borderTopRightRadius: 20, borderBottomLeftRadius:20, borderTopLeftRadius:20}}
                  value={soldTicket || 242}
                  maximumValue={totalTicket || 600}
                  disabled
                  thumbTintColor="transperant"
                  maximumTrackTintColor="#E7E7E7"
                  minimumTrackTintColor="#196BFF"
                //onValueChange={value => this.setState({ value })}
                />
              </View>
              <View style={{ paddingTop: 20 }}>
                        <Button
                            title="Buy a ticket for $40"
                            type="solid"
                           // onPress={this.props.previewEvent}
                            buttonStyle={{
                                backgroundColor: '#196BFF',
                                borderRadius: 6,
                                paddingVertical:15
                            }}
                        />
                        </View>

            </View>

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
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 15,
    alignSelf: 'center'
  },
  imageStyle: {
    height: 84,
    width: 84,
    borderColor: 'white',
    borderRadius: 6,
    borderWidth: 4,
    overflow: 'hidden',
    marginLeft: 20,
    position: 'absolute',
    top: 75
  },
  eventTypeStyle: {
    alignSelf: 'flex-end',
    left: 250,
    backgroundColor: '#FF3131',
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: 'white',
    borderRadius: 6,
    overflow: 'hidden',
    fontSize: 15,
    marginVertical: 5
  }
});

export default EventPreview;
