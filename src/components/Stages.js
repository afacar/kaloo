import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Button, Badge } from 'react-native-elements';
import { colors } from '../constants';



export function Stage1(props) {
    const { text, value } = props
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Badge
                //status="success"
                containerStyle={{ paddingRight: 2 }}
                value={value}
                badgeStyle={{ backgroundColor: 'white', borderWidth: 1, borderColor: "#CFCFDC", height: 25, width: 25, borderRadius: 50 }}
                textStyle={{ color: "#CFCFDC", fontSize: 15, fontWeight: "600" }}
                width={10}

            />
            <Text style={{ color: "#CFCFDC", fontSize: 17 }}>{text}</Text>
        </View>
    )
}

export function Stage2(props) {
    const { text, value } = props

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Badge
                //status="success"
                containerStyle={{ paddingRight: 2 }}
                value={value}
                badgeStyle={{ backgroundColor: 'white', borderWidth: 2, borderColor: "#3598FE", height: 25, width: 25, borderRadius: 50 }}
                textStyle={{ color: "#3598FE", fontSize: 15, fontWeight: "600" }}
                width={10}
            />
            <Text style={{ color: "#3598FE", fontWeight: "600", fontSize: 17 }}>{text}</Text>
        </View>
    )
}

export function Stage3(props) {
    const { text, value } = props
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Badge
                //status="success"
                containerStyle={{ paddingRight: 2 }}
                value={value}
                badgeStyle={{ backgroundColor: "#CFCFDC", borderWidth: 2, borderColor: "#CFCFDC", height: 25, width: 25, borderRadius: 50 }}
                textStyle={{ color: "#fff", fontSize: 15, fontWeight: "600" }}
                width={10}
            />
            <Text style={{ color: "#CFCFDC", fontWeight: "600", fontSize: 17 }}>{text}</Text>
        </View>
    )
}