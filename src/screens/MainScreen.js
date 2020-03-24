import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '../components/AppText';
import { Input, Button } from 'react-native-elements';
class MainScreen extends Component {

    render() {
        return (
            <View style={styles.container}>
                <Input
                    placeholder='Enter Your Ticket'
                    leftIcon={{ type: 'font-awesome', name: 'chevron-right' }}
                />
                <View>
                    <AppText>Or SignUp as Influencer</AppText>
                    <Button
                        title="SignUp"
                        onPress={()=> this.props.navigation.navigate('Signup')}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center'
    }
})

export default MainScreen;