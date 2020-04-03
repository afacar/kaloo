import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {Input, Button, Text, Card} from 'react-native-elements';

class EventPreview extends Component {
  state = {
    isPublishing: false,
  };

  componentDidMount() {}

  componentWillUnmount() {}

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
          this.setState({isPublishing: true});
          this.props.publish();
        },
      },
    ]);
  }

  render() {
    const {isPublishing} = this.state;
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
      <SafeAreaView>
        <View
          style={{
            alignContent: 'center',
            backgroundColor: '#b2c2bf',
            borderRadius: 10,
            paddingHorizontal: 10,
            paddingVertical: 10,
            marginBottom: 20,
          }}>
          <Text style={{textAlign: 'center'}}>
            This is how your event is going to look when you publish.
          </Text>
        </View>
        <View style={styles.container}>
            <View>
              <Image source={{uri: image}} style={{height: '100%', width: '100%'}}  resizeMode="contain"/>
            </View>
           
            <View style={{flexDirection:'row', paddingVertical:3}}><Text style={{fontSize:20, fontWeight:'bold'}}>Host: </Text><Text style={{fontSize:20}}>{displayName || 'No displayName'}</Text></View>
            <View style={{flexDirection:'row', paddingVertical:3}}><Text style={{fontSize:20, fontWeight:'bold'}}>Title: </Text><Text style={{fontSize:20}}>{title || 'No title'}</Text></View>
            <View style={{flexDirection:'row', paddingVertical:3}}><Text style={{fontSize:20, fontWeight:'bold'}}>Description: </Text><Text style={{fontSize:20}}>{description || 'No description'}</Text></View>
            <View style={{flexDirection:'row', paddingVertical:3}}><Text style={{fontSize:20, fontWeight:'bold'}}>Duration: </Text><Text style={{fontSize:20}}>{duration}</Text></View>
            <View style={{flexDirection:'row', paddingVertical:3}}><Text style={{fontSize:20, fontWeight:'bold'}}>Capacity: </Text><Text style={{fontSize:20}}>{capacity}</Text></View>
            <View style={{flexDirection:'row', paddingVertical:3}}><Text style={{fontSize:20, fontWeight:'bold'}}>Event Type: </Text><Text style={{fontSize:20}}>{eventType}</Text></View>
            <View style={{flexDirection:'row', paddingVertical:3}}><Text style={{fontSize:20, fontWeight:'bold'}}>Price:  </Text><Text style={{fontSize:20}}>${price}</Text></View>
            <View style={{flexDirection:'row', paddingVertical:3}}><Text style={{fontSize:20, fontWeight:'bold'}}>Event Date::  </Text><Text style={{fontSize:20}}>${eventDate.toLocaleString()}</Text></View>

          <View style={{justifyContent: 'space-around', flexDirection: 'row'}}>
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
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
});

export default EventPreview;
