
import { createStackNavigator } from 'react-navigation-stack';
import DummyMainScreen from '../screens/DummyMainScreen';
import LiveScreen from '../screens/LiveScreen';
import VideoChatScreen from '../screens/VideoChatScreen';

export default DummyMainNavigator = createStackNavigator(
  {
    Home: DummyMainScreen,
    Live: LiveScreen,
    VideoChat: VideoChatScreen 
  },
  {
    initialRouteName: "Home",
    //headerMode: 'none'
  },

);