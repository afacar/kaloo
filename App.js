import React, { Component } from 'react';
import { Provider } from 'react-redux';
import AppContainer from './src/navigation/AppNavigator';
import firebase from 'react-native-firebase';
import { View } from 'react-native';

import store from './src/appstate/store';

class App extends Component {
  componentDidMount() {
    console.log('firebase apps', firebase.apps)
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
          <Provider store={store}>
            <AppContainer />
          </Provider>
      </View>
    );
  }
}

export default App;
