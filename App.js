import React, { Component } from 'react';
import { Provider } from 'react-redux';
import AppContainer from './src/navigation/AppNavigator';
import { SafeAreaView } from 'react-native';
import firebase from 'react-native-firebase';

import store from './src/appstate/store';

class App extends Component {
  componentDidMount() {
    var firebaseConfig = {
      apiKey: "AIzaSyDjzyO4Op-liCcDo_0qj5bJb60vHL0g864",
      authDomain: "influenceme-dev.firebaseapp.com",
      databaseURL: "https://influenceme-dev.firebaseio.com",
      projectId: "influenceme-dev",
      storageBucket: "influenceme-dev.appspot.com",
      messagingSenderId: "248240010646",
      appId: "1:248240010646:web:8c57c3b81404d402b519b7",
      measurementId: "G-R7D5SZVYFM"
    };
    // Initialize Firebase
    if (!firebase.apps.length)
      firebase.initializeApp(firebaseConfig);

  }

  render() {
    return (
      <SafeAreaView forceInset={{ top: 'always', bottom:'always' }} style={{ flex: 1,backgroundColor: 'green'}}>
        <Provider store={store}>
          <AppContainer />
        </Provider>
      </SafeAreaView>
    );
  }
}

export default App;
