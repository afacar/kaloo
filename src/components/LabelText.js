import React, { Component } from 'react';
import { View, Text } from 'react-native';


export default function LabelText(props) {
    const { label } = props
    return (
    
        <Text style={{fontSize: 17,fontWeight: '600', paddingVertical: 10,}}>{label}</Text>
    )

}
