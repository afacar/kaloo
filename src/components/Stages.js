import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Badge } from 'react-native-elements';
import { colors } from '../constants';



export function Stage(props) {
    const { text, value, active } = props;
    const color = active ? colors.BLUE : colors.GREY
    const fontWeight = active ? 'bold' : 'normal'
    const borderWidth = active ? 2 : 1
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Badge
                //status="success"
                containerStyle={{ paddingRight: 2 }}
                value={value}
                badgeStyle={{ backgroundColor: 'white', borderWidth, borderColor: color, height: 25, width: 25, borderRadius: 50 }}
                textStyle={{ color, fontSize: 15, fontWeight }}
                width={10}
            />
            <Text style={{ color, fontSize: 17, fontWeight }}>{text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({ })