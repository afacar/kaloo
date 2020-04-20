import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { auth } from 'react-native-firebase'
import { Avatar } from 'react-native-elements';
import { colors } from '../constants';
import { ClickableText } from './Buttons';

export default function DashboradHeader(props) {
    let { navigation, profile } = props;
    profile = profile ? profile : auth().currentUser
    let imageSource = profile.photoURL ? { uri: profile.photoURL } : require('../assets/default-profile.png')
    return (
        <View style={styles.container}>
            <Avatar
                rounded={true}
                size='large'
                source={imageSource}
                overlayContainerStyle={{ borderWidth: 3, borderColor: 'white' }}
            />
            <Text style={{ color: 'white', fontWeight: 'bold', paddingVertical: 10, fontSize: 20 }}>{profile.displayName}</Text>
            <ClickableText color='white' text='Edit Profile' onPress={() => navigation.navigate('Profile')} />
            <ClickableText color='white' text='Total Earnings: $0 →' onPress={() => navigation.navigate('Balance')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 15,
        alignSelf: 'stretch',
        backgroundColor: colors.BLUE,
        alignItems: 'center'
    }
})