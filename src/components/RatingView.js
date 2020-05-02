import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button, AirbnbRating } from 'react-native-elements';

import { app } from '../constants';
import { AppText, BoldLabel } from "./Labels";
import { rateEvent } from "../utils/EventHandler";

const { COMPLETED } = app.EVENT_STATUS

class RatingView extends Component {
    state = {
        isRatingComplete: false,
        rating: 3,
        error: undefined
    }

    rateEvent = async () => {
        const { eventId } = this.props.event;
        const { ticket } = this.props;
        const { rating } = this.state;
        this.setState({ isRatingComplete: true })
        rateEvent(eventId, ticket, rating)
    }

    changeRate = (rating) => {
        this.setState({ rating })
    }

    render() {
        const { status } = this.props.event
        const ticketData = this.props.ticket
        return (
            <View>
                {
                    (status === COMPLETED && !this.state.isRatingComplete && !ticketData.rate) && (
                        <View>
                            <BoldLabel label='How was the audio and video quality?' />
                            <AirbnbRating
                                count={5}
                                defaultRating={3}
                                onFinishRating={this.changeRate}
                                size={20}
                            />
                            <Button
                                title="Submit"
                                buttonStyle={{ marginTop: 12, marginBottom: 12, width: 180, height: 40, alignSelf: 'center', borderRadius: 6 }}
                                onPress={this.rateEvent}
                            />
                        </View>
                    )
                }
                {
                    (this.state.isRatingComplete || ticketData.rate) && (
                        <AppText style={{ fontSize: 16, alignSelf: 'center', marginTop: 12 }}>Thanks For Your Feedback</AppText>
                    )
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({})

export default RatingView;