import React from 'react';
import { View, Modal, StyleSheet, Image, Text } from 'react-native';

export function WaitingModal(props) {
    let { isWaiting, text } = props
    text = text || 'Working on it...'
    return (
        <Modal
            animationType='fade'
            visible={isWaiting}
            transparent={true}
            onRequestClose={() => { }}
            presentationStyle='overFullScreen'
        >
            <View style={styles.container}>
                <View style={styles.modalView}>
                    <Image
                        source={require('../assets/illustration1.png')}
                        style={styles.imageStyle}
                    />
                    <Text style={{ alignSelf: 'center' }}>{text}</Text>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0, 0.5)',
        flex: 1
    },
    modalView: {
        margin: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "white",
        opacity: 1,
        borderRadius: 20,
        padding: 35,
        alignItems: 'stretch',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    imageStyle: {
        height: 150,
        width: 150,
        resizeMode: 'contain',
        borderRadius: 8,
        marginVertical: 10,
        alignSelf: 'center'
    }
})