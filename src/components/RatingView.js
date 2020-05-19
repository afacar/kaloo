import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button, AirbnbRating } from 'react-native-elements';

import { app } from '../constants';
import { AppText, BoldLabel, HighlightedText } from "./Labels";
import { rateEvent } from "../utils/EventHandler";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';

const { COMPLETED } = app.EVENT_STATUS

class RatingView extends Component {
    state = {
        isRatingComplete: false,
        rating: null,
        error: undefined
    }

    rateEvent = async (rating) => {
        const { eventId } = this.props.event;
        const { ticket } = this.props;
        this.setState({ rating, isRatingComplete: true })
        rateEvent(eventId, ticket, rating)
    }

    render() {
        const { rating } = this.state;
        const { status } = this.props.event
        const ticketData = this.props.ticket
        const thumbDownStyle = rating === -1 ? styles.thumbContainerActive : styles.thumbContainer
        const thumbUpStyle = rating === 1 ? styles.thumbContainerActive : styles.thumbContainer
        return (
            <View>
                {
                    (status === COMPLETED && rating === null && !ticketData.rate) && (
                        <View style={{ alignItems: 'center' }}>
                            <BoldLabel label='How was the audio and video quality?' />
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity onPress={() => this.rateEvent(-1)} style={thumbDownStyle}>
                                    <Text style={styles.thumb}>👎</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.rateEvent(1)} style={thumbUpStyle}>
                                    <Text style={styles.thumb}>👍</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                }
                {
                    (this.state.isRatingComplete || ticketData.rate) && (
                        <HighlightedText text='Thanks For Your Feedback' />
                    )
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    thumbContainer: {
        justifyContent: 'center',
        borderRadius: 50,
        padding: 15,
        margin: 25,
        backgroundColor: '#C4C4C4',
        width: 55, height: 55
    },
    thumbContainerActive: {
        justifyContent: 'center',
        borderRadius: 50,
        padding: 15,
        margin: 25,
        backgroundColor: '#196BFF',
        width: 55, height: 55
    },
    thumb: { fontSize: 21, textAlign: 'center' }
})

export default RatingView;