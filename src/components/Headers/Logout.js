import React from 'react';
import { Button } from 'react-native-elements';
import { auth } from 'react-native-firebase';
import { connect } from 'react-redux';

import { clearLiveEventListener } from '../../appstate/actions/host_actions';

class Logout extends React.Component {

    logout = () => {
        // TODO: Remove firebase cache and listeners
        this.props.clearLiveEventListener()
        auth().signOut()
    }

    render() {
        return (
            <Button
                type='clear'
                onPress={this.logout}
                title='Logout'
                titleStyle={{ color: 'white' }}
                containerStyle={{ paddingRight: 10 }}
            />
        )

    }
}

export default connect(null, { clearLiveEventListener })(Logout);