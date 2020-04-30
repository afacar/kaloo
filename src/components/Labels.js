import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { app, colors } from '../constants';

export function AppText(props) {
    return (
        <Text style={[{ fontFamily: app.APP_FONT }, [props.style]]}>{props.children}</Text>
    )
}

export function HighlightedText(props) {
    const { text } = props
    return (
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: "center",
            backgroundColor: '#655FFF',
            borderRadius: 6,
            paddingHorizontal: 15,
            marginVertical: 10
        }}>
            <Text style={{ color: 'white', paddingVertical: 15, fontSize: 15 }}>
                {text}
            </Text>
        </View>
    )
}

export function Label(props) {
    const { label } = props
    return (
        <Text style={{ fontSize: 15, marginVertical: 15 }}>{label}</Text>
    )
}

export function ErrorLabel(props) {
    const { label } = props
    return (
        <Text style={{ fontSize: 15, color: 'red' }}>{label}</Text>
    )
}

export function BottomText(props) {
    const { label } = props
    return (
        <Text style={{ fontSize: 14, color: '#333333' }}>{label}</Text>
    )
}

export function BoldLabel(props) {
    const { label } = props
    return (
        <Text style={{ fontSize: 17, fontWeight: 'bold', paddingVertical: 10, }}>{label}</Text>
    )
}

export function H1Label(props) {
    const { label } = props
    return (
        <Text style={{ fontSize: 28, fontWeight: '700', paddingVertical: 10, }}>{label}</Text>
    )
}

export function H2Label(props) {
    const { label } = props
    return (
        <Text style={{ fontSize: 25, fontWeight: '600', paddingVertical: 10, }}>{label}</Text>
    )
}

export function H3Label(props) {
    const { label } = props
    return (
        <Text style={{ fontSize: 23, fontWeight: '600', paddingVertical: 10, }}>{label}</Text>
    )
}

export function RedLabel(props) {
    const { label } = props
    return (
        <Text style={styles.redLabel}>{label}</Text>
    )
}

const styles = StyleSheet.create({
    redLabel: {
        fontSize: 12,
        color: 'white',
        backgroundColor: colors.PINK,
        borderRadius: 6,
        textAlign: 'center',
        padding: 8,
    }
})
