import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements';


export default function HighlightedText(props) {
    const { text } = props
    return (
    
            <View style={{
                flexDirection: 'row', 
                alignItems: 'center',
                justifyContent:"center",
                backgroundColor: '#196BFF',
                borderRadius: 6,
                marginTop: 41,
                marginBottom: 21
            }}>
                <Icon
                    name='lightbulb-on-outline'
                    type='material-community'
                    color='#fff'
                    containerStyle={{paddingHorizontal:5}}
                />
                <Text style={{ textAlign: 'center', color: 'white', paddingVertical:15, fontSize:15 }}>
                    {text}
                </Text>
            </View>
    )

}
