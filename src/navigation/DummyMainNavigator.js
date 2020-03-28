
import { createStackNavigator } from 'react-navigation-stack';
import DummyMainScreen from '../screens/DummyMainScreen';
import LiveScreen from '../screens/LiveScreen';
import VideoChatScreen from '../screens/VideoChatScreen';

export default DummyMainNavigator = createStackNavigator(
  {
    Home: DummyMainScreen,
    Live: {
      screen: LiveScreen,
      navigationOptions: {
        headerShown: false
      },
    },
    VideoChat: {
      screen: VideoChatScreen,
      navigationOptions: {
        headerShown: false
      },
    },
  },
  {
    initialRouteName: "Home",
    //headerMode: 'none'
  },

);