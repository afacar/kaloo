
import { createStackNavigator } from 'react-navigation-stack';
import EventListScreen from '../screens/EventListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BalanceScreen from '../screens/BalanceScreen';
import JoinMyEventScreen from '../screens/JoinMyEventScreen';
import MyTicketScreen from '../screens/MyTicketScreen';
import MyEventScreen from '../screens/MyEventScreen';
import EventCreateScreen from '../screens/EventCreateScreen';
import EventPreviewScreen from '../screens/EventPreviewScreen';
import LiveScreen from '../screens/LiveScreen';
import VideoChatScreen from '../screens/VideoChatScreen';

export default UserNavigatior = createStackNavigator(
  {
    UserHome: EventListScreen,
    CreateEvent: EventCreateScreen,
    PreviewEvent: EventPreviewScreen,
    MyTicket: MyTicketScreen,
    JoinMyEvent: JoinMyEventScreen,
    Profile: ProfileScreen,
    Balance: BalanceScreen,
    MyEvent: MyEventScreen,
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
    initialRouteName: "UserHome",
  },

);