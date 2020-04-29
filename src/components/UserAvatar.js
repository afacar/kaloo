import React from 'react';
import { View } from 'react-native';
import { auth } from "react-native-firebase";
import { Avatar } from 'react-native-elements';
import { connect } from "react-redux";

function UserAvatar(props) {
    let { profile } = props;
    profile = profile ? profile : auth().currentUser
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

function mapStateToProps({ profile }) {
    return { profile }
}

export default connect(mapStateToProps, null)(UserAvatar)