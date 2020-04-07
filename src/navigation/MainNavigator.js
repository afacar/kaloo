
import { createStackNavigator } from 'react-navigation-stack';
import TicketScreen from '../screens/TicketScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignInScreen from '../screens/SignInScreen';
import JoinEventScreen from '../screens/JoinEventScreen';
import RegisterScreen from '../screens/RegisterScreen';
import LiveScreen from '../screens/LiveScreen';
import VideoChatScreen from '../screens/VideoChatScreen';

export default MainNavigatior = createStackNavigator(
  {
    Home: WelcomeScreen,
    Ticket: TicketScreen,
    JoinEvent: JoinEventScreen,
    SignIn: SignInScreen,
    Register: RegisterScreen,
    Live: {
      screen: LiveScreen,
      navigationOptions: {
        headerShown: false,
      }
    },
    VideoChat: {
      screen: VideoChatScreen,
      navigationOptions: {
        headerShown: false,
      }
    },
  },
  {
    initialRouteName: "Home",
    //headerMode: 'none'
  },

);