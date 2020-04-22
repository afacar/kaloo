import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Avatar } from 'react-native-elements';
import { connect } from "react-redux";

import { colors, dimensions } from '../constants';

function UserAvatar(props) {
    const { profile } = props;
    let imageSource = profile.photoURL ? { uri: profile.photoURL } : require('../assets/default-profile.png')
    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <Avatar
                rounded={true}
                size='small'
                source={imageSource}
                overlayContainerStyle={{ borderWidth: 2, borderColor: 'white' }}
            />
        </View>
    );
}

function mapStateToProps({ auth }) {
    return {
        profile: auth.profile
    }
}

export default connect(mapStateToProps, null)(UserAvatar)