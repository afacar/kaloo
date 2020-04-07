import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  ImageBackground
} from 'react-native';
import { Button, Text, Slider } from 'react-native-elements';
import HighlightedText from '../components/HighlightedText';

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

function EventHeader(props) {
  const { image, photoURL, eventType } = props

  return (
    <View style={eventHeaderStyle.container}>
      <ImageBackground
        source={{ uri: image }}
        style={{ width: '100%', height: '100%' }}
        imageStyle={{ borderTopLeftRadius: 6, height: '75%', borderTopRightRadius: 6 }}
      >
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Image source={{ uri: photoURL }} style={eventHeaderStyle.userPhotoStyle} />
          <Text style={eventHeaderStyle.eventTypeStyle}>{eventType}</Text>
        </View>
      </ImageBackground>
    </View>
  )
}

const eventHeaderStyle = StyleSheet.create({
  container: {
    height: 190,
    paddingVertical: 10,
  },
  userPhotoStyle: {
    height: 84,
    width: 84,
    borderColor: 'white',
    borderRadius: 6,
    borderWidth: 4,
    marginLeft: 10,
    alignSelf: 'flex-end',
    bottom: 0
  },
  eventTypeStyle: {
    alignSelf: 'flex-end',
    backgroundColor: '#FF3131',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 5,
    color: 'white',
    borderRadius: 6,
    fontSize: 15,
    marginVertical: 5
  }
})

class EventPreviewScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: () => <Text>Preview Event</Text>,
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

  state = {
    isPublishing: false,
  };

  componentDidMount() { }

  componentWillUnmount() { }

  render() {
    const {
      displayName,
      photoURL,
      image,
      title,
      description,
      duration,
      eventType,
      capacity,
      price,
      eventDate,
      isWaiting,
      totalTicket,
      soldTicket,
    } = this.props.navigation.getParam('event');
    console.log('event preview render', this.props.navigation.getParam('event'));
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <HighlightedText text='Your event isn’t published yet. Event ticket is going to look like this when you publish.' />

        <EventHeader image={image} photoURL={photoURL} eventType={eventType} />

        <View style={{ marginLeft: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>{displayName}</Text>
          <Text style={{ fontSize: 30, fontWeight: "normal" }}>{title}</Text>
          <Text style={{ fontSize: 17, color: 'gray' }}>{eventDate.toLocaleString()}</Text>
          <Text style={{ fontSize: 17, color: 'gray' }}>Duration: {duration} minutes</Text>
          <Text style={{ fontSize: 20, fontWeight: '500', marginVertical: 20 }}>{description || 'No description'}</Text>
          
          <View style={{}}>
            <Text style={{ alignSelf: 'center',  color: 'gray' }}>{capacity} ticket(s) left</Text>
            <Slider
              trackStyle={{ height: 10, backgroundColor: '#196BFF', borderBottomRightRadius: 20, borderTopRightRadius: 20, borderBottomLeftRadius: 20, borderTopLeftRadius: 20 }}
              value={capacity}
              maximumValue={capacity}
              disabled
              thumbTintColor="transperant"
              maximumTrackTintColor="#E7E7E7"
              minimumTrackTintColor="#196BFF"
            //onValueChange={value => this.setState({ value })}
            />
          </View>
          <View style={{ paddingTop: 20 }}>
            <Button
              title={`Buy a ticket for $${price}`}
              type="solid"
              onPress={() => console.log('This is preview!')}
              buttonStyle={{
                backgroundColor: '#196BFF',
                borderRadius: 6,
                paddingVertical: 15
              }}
            />
          </View>
        </View>
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
