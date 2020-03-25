import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import AppText from '../components/AppText';
import { Input, Button, Card, Image, Avatar, CheckBox } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const DEFAULT_EVENT_PIC = 'https://firebasestorage.googleapis.com/v0/b/influenceme-dev.appspot.com/o/assets%2Fbroadcast-media.png?alt=media&token=608c9143-879d-4ff7-a30d-ac61ba319904'

class CreateEventScreen extends Component {
    state = {
        image: DEFAULT_EVENT_PIC,
        title: '',
        description: '',
        duration: 30,
        timestamp: new Date(),
        isBroadcast: true,
        capacity: '50',
        price: '1',
        isDatePickerVisible: false,
        eventDate: new Date().toLocaleString()
    }

    onDateChange = (selectedDate) => {
        const currentDate = selectedDate || date;
        console.log('selectedDate', selectedDate)
        this.setState({ isDatePickerVisible: false, eventDate: currentDate.toLocaleString() })
    };

    render() {
        const { image, title, description, duration, timestamp, isBroadcast, capacity, price } = this.state;
        return (
            <ScrollView>
                <View style={styles.container}>
                    <Card containerStyle={{ flex: 1, alignSelf: 'stretch' }} >
                        <Avatar
                            //onPress={this.onAvatarPressed}
                            renderPlaceholderContent={<ActivityIndicator />}
                            onEditPress={this.onAvatarPressed}
                            size='xlarge'
                            title='Event Pict'
                            rounded={false}
                            showEditButton={true}
                            source={{ uri: image }}
                        />
                        <Input
                            placeholder='Event title'
                            onChangeText={title => this.setState({ title })}
                            value={title}
                        />
                        <Input
                            placeholder='Event description'
                            onChangeText={description => this.setState({ description })}
                            value={description}
                            multiline
                        />
                        <Button
                            title={this.state.eventDate}
                            type='clear'
                            onPress={() => this.setState({ isDatePickerVisible: true })} />
                        <DateTimePickerModal
                            isVisible={this.state.isDatePickerVisible}
                            mode='datetime'
                            onConfirm={this.onDateChange}
                            onCancel={() => this.setState({ isDatePickerVisible: false })}
                            display='default'
                        //onChange={}
                        />
                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                            <CheckBox
                                center
                                title='Broadcast'
                                iconRight
                                checkedIcon='dot-circle-o'
                                uncheckedIcon='circle-o'
                                checked={this.state.isBroadcast}
                                onPress={() => this.setState({ isBroadcast: !isBroadcast })}
                            />
                            <CheckBox
                                center
                                title='Video Call'
                                iconRight
                                checkedIcon='dot-circle-o'
                                uncheckedIcon='circle-o'
                                checked={!this.state.isBroadcast}
                                onPress={() => this.setState({ isBroadcast: !isBroadcast })}
                            />
                        </View>
                        {isBroadcast ? (<Input
                            label='Capacity'
                            onChangeText={(capacity) => this.setState({ capacity })}
                            value={capacity}
                            keyboardType='numeric'
                            maxLength={3}
                        />) : (
                                <Text>It will be 1 to 1 video call</Text>
                            )
                        }
                        <Input
                            label='Ticket Price'
                            onChangeText={(price) => this.setState({ price })}
                            value={price}
                            keyboardType='numeric'
                            maxLength={3}
                        />
                        <Button title='Create Event' type='outline' onPress={() => { }} />
                    </Card>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
                    container: {
                    flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center'
    }
})

export default CreateEventScreen;