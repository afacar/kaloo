import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Icon } from "react-native-elements";
import { app } from '../constants';

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
        <Text style={{ fontSize: 17, paddingVertical: 5 }}>{label}</Text>
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
        <Text style={{ fontSize: 28, fontWeight: '600', paddingVertical: 10, }}>{label}</Text>
    )
}

export function H1Label(props) {
    const { label } = props
    return (
        <Text style={{ fontSize: 17, fontWeight: '600', paddingVertical: 10, }}>{label}</Text>
    )
}

export function H2Label(props) {
    const { label } = props
    return (
        <Text style={{ fontSize: 17, fontWeight: '600', paddingVertical: 10, }}>{label}</Text>
    )
}

export function H3Label(props) {
    const { label } = props
    return (
        <Text style={{ fontSize: 17, fontWeight: '600', paddingVertical: 10, }}>{label}</Text>
    )
}