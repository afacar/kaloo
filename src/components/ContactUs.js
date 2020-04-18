import React, { Component } from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { functions, auth } from "react-native-firebase";
import { ClickableText, DefaultButton, RedButton } from './Buttons';

const INITIAL_STATE = { message: '', visible: false, infoMessage: '', chars: 0, loading: false, sent: false }

export class ContactUs extends Component {
    state = INITIAL_STATE

    onSubmit = async () => {
        const { message } = this.state;
        const { screen } = this.props
        let user = { uid: '', email: '' }

        if (message.length < 3) {
            return this.setState({ infoMessage: 'We need more than this :)' })
        }

        if (auth().currentUser) {
            user.uid = auth().currentUser.uid
            user.email = auth().currentUser.email
        }

        this.setState({ loading: true })
        try {
            let contactUs = functions().httpsCallable('contactUs')
            let contactData = { message, screen, user }
            console.log('contactData', contactData)
            let result = await contactUs(contactData)
            console.log('contactUs result', result)
            if (result.data.state === 'SUCCESS') {
                this.setState({ infoMessage: 'Thanks for inquiry!', sent: true })
            } else {
                this.setState({ infoMessage: result.data.message })
            }
        } catch (error) {
            this.setState({ infoMessage: error.message })
        }
        this.setState({ loading: false })
    };

    openContactUs = () => {
        this.setState({ ...INITIAL_STATE, visible: true })
    }

    closeContactUs = () => {
        this.setState({ visible: false })
    }

    render() {
        const { title } = this.props
        const { message, visible, infoMessage, chars, loading, sent } = this.state;
        return (
            <View style={{ alignSelf: 'center' }}>
                <ClickableText text={title || 'Contact Us'} onPress={this.openContactUs} />
                <Modal
                    animationType="slide"
                    visible={visible}
                    transparent={true}
                    onRequestClose={this.closeContactUs}
                    presentationStyle='overFullScreen'
                >
                    <View style={styles.container}>
                        <View style={styles.modalView}>
                            <Text style={{ color: 'red' }}>{infoMessage}</Text>
                            {!sent && <Input
                                value={message}
                                onChangeText={message => this.setState({ message, chars: message.length })}
                                placeholder='Text goes here'
                                multiline
                                maxLength={250}
                            />}
                            <Text style={{ alignSelf: 'flex-end', color: 'grey' }}>{chars}/250</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                <RedButton
                                    title='Close'
                                    onPress={this.closeContactUs}
                                />
                                <DefaultButton
                                    title='Submit'
                                    onPress={this.onSubmit}
                                    loading={loading}
                                    disabled={sent}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0, 0.5)',
        flex: 1
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        opacity: 1,
        borderRadius: 20,
        padding: 35,
        alignItems: 'stretch',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
})