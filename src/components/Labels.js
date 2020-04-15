import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { app } from '../constants';

export function AppText(props) {
    return (
        <Text style={[{ fontFamily: app.APP_FONT }, [props.style]]}>{props.children}</Text>
    )
}

export function Label(props) {
    const { label } = props
    return (
        <Text style={{ fontSize: 17, fontWeight: '600', paddingVertical: 10, }}>{label}</Text>
    )
}

export function BoldLabel(props) {
    const { label } = props
    return (
        <Text style={{ fontSize: 17, fontWeight: '600', paddingVertical: 10, }}>{label}</Text>
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