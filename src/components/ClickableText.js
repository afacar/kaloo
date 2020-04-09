import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

export default function ClickableText(props) {
    const { text, onPress } = props
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onPress} >
                <Text style={{ textDecorationLine: 'underline' }}>{text}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 5
    }
})
