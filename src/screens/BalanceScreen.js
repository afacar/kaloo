import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import AppText from '../components/AppText';
import { Input, Button } from 'react-native-elements';

class BalanceScreen extends Component {
    state = { iban: '', totalBalance: '', currentBalance: '' }

    render() {
        return (
            <View style={styles.container}>
                <AppText>Balance</AppText>
                <View style={{ alignSelf: 'stretch', borderWidth: 4 }}>
                    <Input
                        placeholder='Enter IBAN'
                        leftIcon={{ type: 'font-awesome', name: 'chevron-right' }}
                        onChangeText={iban => this.setState({ iban })}
                        value={this.state.email}
                    />
                    <Text>Total Balance: {this.state.totalBalance}</Text>
                    <Text>Current Balance: {this.state.currentBalance}</Text>
                    <Button title='Request Payment' />
                </View>
                <View style={{ alignSelf: 'stretch', flexDirection: 'row', borderWidth: 2, justifyContent: 'space-evenly' }}>
                    <Button
                        title="Submit"
                        onPress={this.handleProfileUpdate}
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

export default BalanceScreen;