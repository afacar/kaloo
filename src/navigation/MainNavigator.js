
import { createStackNavigator } from 'react-navigation-stack';
import TicketScreen from '../screens/TicketScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignInScreen from '../screens/SignInScreen';
import JoinEventScreen from '../screens/JoinEventScreen';
import RegisterScreen from '../screens/RegisterScreen';
import LiveScreen from '../screens/LiveScreen';
import MeetingScreen from '../screens/MeetingScreen';
import VideoChatScreen from '../screens/VideoChatScreen';
import BroadcastScreen from '../screens/BroadcastScreen';
import { colors } from '../constants';

export default MainNavigatior = createStackNavigator(
  {
    Home: WelcomeScreen,
    Ticket: TicketScreen,
    JoinEvent: JoinEventScreen,
    SignIn: SignInScreen,
    Register: RegisterScreen,
    Meeting: MeetingScreen,
    Broadcast: BroadcastScreen,
    Live: {
      screen: LiveScreen,
    },
    VideoChat: {
      screen: VideoChatScreen,
    },
  },
  {
    initialRouteName: "Home",
    defaultNavigationOptions: {
      headerTitleAlign: 'center',
      headerStyle: { backgroundColor: colors.BLUE, borderBottomWidth: 0, elevation: 0, shadowOpacity: 0 },
      headerTitleStyle: { color: '#fff', fontWeight: 'normal' },
      cardStyle: { backgroundColor: 'white' }
    }
  },

);