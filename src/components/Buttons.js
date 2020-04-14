import React, { Component } from 'react';
import { Icon, Button } from 'react-native-elements';
import { StyleSheet } from 'react-native';

import { colors } from '../constants'

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
        //loading={loading}
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
            title='Continue Call'
            buttonStyle={styles.endButton}
            onPress={onPress}
            loading={loading}
        />
    )
}

const styles = StyleSheet.create({
    startButton: {
        position: 'absolute',
        alignSelf: 'center',
        backgroundColor: colors.GREEN,
        bottom: 24,
        borderRadius: 6,
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    endButton: {
        position: 'absolute',
        alignSelf: 'center',
        backgroundColor: colors.RED,
        bottom: 24,
        borderRadius: 6,
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
})