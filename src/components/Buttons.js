import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Linking } from 'react-native';
import { Icon, Button } from 'react-native-elements';

import app from '../constants/app';
import { colors } from '../constants'

const { SCHEDULED, IN_PROGRESS, SUSPENDED, COMPLETED } = app.EVENT_STATUS;
const { BROADCAST } = app.EVENT_TYPE;

export function HyperLink(props) {
    const { text, link } = props

    return (
        <TouchableOpacity onPress={() => Linking.openURL(link)} >
            <Text style={{ color: '#3598FE', textDecorationLine: 'underline', }}>{text}</Text>
        </TouchableOpacity>
    )
}

export function ClickableText(props) {
    const { text, onPress, color, underline, size, opacity } = props
    return (
        <View style={{ padding: 5, opacity: opacity || 1 }}>
            <TouchableOpacity onPress={onPress} >
                <Text style={{ textDecorationLine: underline && 'underline', fontSize: size || 14, color: color || '#3598FE' }}>{text}</Text>
            </TouchableOpacity>
        </View>
    )
}

export function AppButton(props) {
    return (
        <TouchableOpacity style={props.style} onPress={() => props.onPress()}>
            {props.children}
        </TouchableOpacity>
    )
}

export function BackButton(props) {
    return (
        <AppButton onPress={props.onPress}>
            <Icon
                type="MaterialIcons"
                name="arrow-back"
                color="black"
                size={16}
            />
        </AppButton>
    )
}


export function StartCallButon(props) {
    const { onPress, loading } = props
    return (
        <Button
            icon={
                <Icon
                    type='font-awesome'
                    name="video-camera"
                    size={16}
                    iconStyle={{ marginRight: 4 }}
                    color="white"
                />
            }
            title='Start Call'
            buttonStyle={styles.startButton}
            onPress={onPress}
            loading={loading}
        />
    )
}

export function ContinueCallButon(props) {
    const { onPress, loading } = props
    return (
        <Button
            icon={
                <Icon
                    type='font-awesome'
                    name="video-camera"
                    size={16}
                    iconStyle={{ marginRight: 4 }}
                    color="white"
                />
            }
            title='Continue Call'
            buttonStyle={styles.startButton}
            onPress={onPress}
            loading={loading}
        />
    )
}

export function EndCallButon(props) {
    const { onPress, loading } = props
    return (
        <Button
            icon={
                <Icon
                    type='font-awesome'
                    name="video-camera"
                    size={16}
                    iconStyle={{ marginRight: 4 }}
                    color="white"
                />
            }
            title='End Call'
            buttonStyle={styles.endButton}
            onPress={onPress}
            loading={loading}
        />
    )
}

export function DefaultButton(props) {
    const { onPress, title, disabled, loading } = props
    return (
        <Button
            title={title}
            onPress={onPress}
            buttonStyle={styles.defaultButtonColor}
            disabled={disabled}
            loading={loading}
        />
    )
}

export function RedButton(props) {
    const { onPress, title, disabled } = props
    return (
        <Button
            title={title}
            onPress={onPress}
            buttonStyle={styles.redButton}
            disabled={disabled}
        />
    )
}

export function ClearButton(props) {
    const { onPress, title, disabled } = props
    return (
        <Button
            type='clear'
            title={title}
            titleStyle={{ color: '#3BCDE2' }}
            onPress={onPress}
            buttonStyle={styles.clearButton}
            disabled={disabled}
        />
    )
}


export function BroadcastButton(props) {
    const { status, loading, eventType } = props.event;
    let buttonTitle = status === SCHEDULED ? 'Start' : status === IN_PROGRESS ? 'End' : 'Continue';
    buttonTitle += eventType === BROADCAST ? ' Broadcast' : ' Meeting'
    const buttonStyle = status === SCHEDULED ? styles.startButton : status === IN_PROGRESS ? styles.endButton : styles.startButton;
    return (
        <TouchableOpacity
            style={buttonStyle}
            onPress={props.onPress}
        >
            <Text style={{ color: 'white', fontSize: 19, fontWeight: 'bold' }}>{buttonTitle}</Text>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    startButton: {
        position: 'absolute',
        alignSelf: 'center',
        backgroundColor: colors.GREEN,
        bottom: 30,
        borderRadius: 6,
        zIndex: 1000,
        padding: 12,
        opacity: 0.7,
        justifyContent: 'center',
        alignItems: 'center'
    },
    endButton: {
        position: 'absolute',
        alignSelf: 'center',
        backgroundColor: colors.RED,
        bottom: 30,
        zIndex: 1000,
        borderRadius: 6,
        opacity: 0.7,
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    redButton: {
        alignSelf: 'center',
        backgroundColor: colors.RED,
        borderRadius: 16,
        height: 50,
    },
    defaultButtonColor: {
        backgroundColor: "#3BCDE2",
        borderRadius: 16,
        height: 50,
        marginTop: 10,
    },
    clearButton: {
        marginTop: 10,
        borderRadius: 16,
        height: 50,
        borderColor: '#3598FE',
        borderWidth: 1,
    },
})