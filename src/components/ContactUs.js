import React, { Component } from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import { Input } from 'react-native-elements';
import { functions, auth } from "react-native-firebase";

import { ClickableText, DefaultButton, ClearButton } from './Buttons';
import { HighlightedText } from '../components/Labels';
import { validateEmail } from '../utils/Utils';

const INITIAL_STATE = { message: '', visible: false, emailError: '', messageError: '', infoMessage: '', chars: 0, loading: false, sent: false }

export class ContactUs extends Component {
    user = auth().currentUser ? {
        uid: auth().currentUser.uid, email: auth().currentUser.email
    } : { uid: '', email: '' }
    state = { ...INITIAL_STATE, ...this.user }

    onSubmit = async () => {
        const { uid, email, message } = this.state;
        const { screen } = this.props

        // Check email
        if (!validateEmail(email))
            return this.setState({ emailError: 'Check email format!' });

        if (message.length < 3) {
            return this.setState({ messageError: 'We need more explanation :)' })
        }

        this.setState({ loading: true })
        try {
            let contactUs = functions().httpsCallable('contactUs')
            let contactData = { message, screen, email, uid }
            let result = await contactUs(contactData)
            if (result.data.state === 'SUCCESS') {
                this.setState({ infoMessage: 'Thanks for inquiry!', sent: true })
            } else {
                this.setState({ messageError: result.data.message })
            }
        } catch (error) {
            this.setState({ messageError: error.message })
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
        const { uid, email, message, visible, infoMessage, chars, loading, sent, emailError, messageError } = this.state;
        return (
            <View style={{ alignSelf: 'stretch', alignItems: 'center', backgroundColor: 'white' }}>
                <ClickableText opacity={0.5} text={title || 'Contact Us'} onPress={this.openContactUs} />
                <Modal
                    animationType="slide"
                    visible={visible}
                    transparent={true}
                    onRequestClose={this.closeContactUs}
                    presentationStyle='overFullScreen'
                >
                    <View style={styles.container}>
                        <View style={styles.modalView}>
                            {sent ? (
                                <HighlightedText text={infoMessage} />
                            ) : (
                                    <View>
                                        {!uid && <Input
                                            value={email}
                                            onChangeText={email => this.setState({ email, emailError: '' })}
                                            placeholder='your@email.com'
                                            maxLength={100}
                                            inputContainerStyle={{ ...styles.inputContainerStyle }}
                                            containerStyle={{ paddingHorizontal: 0, marginTop: 10 }}
                                            errorMessage={emailError}
                                            keyboardType='email-address'
                                            disabled={loading}
                                        />}
                                        <Input
                                            value={message}
                                            onChangeText={message => this.setState({ message, chars: message.length, messageError: '' })}
                                            placeholder='Your inquiry...'
                                            multiline
                                            maxLength={250}
                                            inputContainerStyle={{ ...styles.inputContainerStyle, height: 100 }}
                                            containerStyle={{ paddingHorizontal: 0, marginTop: 10 }}
                                            errorMessage={messageError}
                                            disabled={loading}
                                        />
                                        <Text style={{ alignSelf: 'flex-end', color: 'grey' }}>{chars}/250</Text>

                                    </View>
                                )
                            }
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
                                <ClearButton
                                    title='Close'
                                    onPress={this.closeContactUs}
                                    disabled={loading}
                                />
                                <DefaultButton
                                    title='Submit'
                                    onPress={this.onSubmit}
                                    loading={loading}
                                    disabled={sent || loading}
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
        opacity: 1,
        borderRadius: 5,
        padding: 35,
        backgroundColor: '#fff',
        shadowColor: "#fff",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    inputContainerStyle: {
        borderWidth: 0.7,
        borderColor: '#3b3a30',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginHorizontal: 0,
    },
})