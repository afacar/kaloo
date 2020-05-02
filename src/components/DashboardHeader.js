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
    let totalEarnings = profile.totalEarnings || 0
    return (
        <View style={styles.container}>
            <Avatar
                rounded={true}
                size='large'
                source={imageSource}
                overlayContainerStyle={{ borderWidth: 3, borderColor: 'white' }}
            />
            <Text style={{ color: 'white', fontWeight: 'bold', paddingTop: 5, fontSize: 20 }}>{profile.displayName}</Text>
            <ClickableText
                text='Edit Profile'
                underline
                color='white'
                onPress={() => navigation.navigate('Profile')}
            />
            <ClickableText
                text={`Total Earnings: $${totalEarnings || 0} →`}
                size={17}
                color='white'
                onPress={() => navigation.navigate('Balance')}
            />
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