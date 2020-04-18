import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Avatar } from 'react-native-elements';
import { auth } from 'react-native-firebase';
import { colors } from '../constants';
import { ClickableText } from './Buttons';

export default class DashboradHeader extends React.Component {
    render() {
        const { navigation } = this.props;

        return (
            <View style={styles.container}>
                <Avatar
                    rounded={true}
                    size='large'
                    source={{ uri: auth().currentUser.photoURL }}
                    overlayContainerStyle={{ borderWidth: 3, borderColor: 'white' }}
                />
                <Text style={{ color: 'white', fontWeight: 'bold', paddingVertical: 10, fontSize: 20 }}>{auth().currentUser.displayName}</Text>
                <ClickableText color='white' text='Edit Profile' onPress={() => navigation.navigate('Profile')} />
                <ClickableText color='white' text='Total Earnings: $0 →' onPress={() => navigation.navigate('Balance')} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 15,
        alignSelf: 'stretch',
        backgroundColor: colors.BLUE,
        alignItems: 'center'
    }
})