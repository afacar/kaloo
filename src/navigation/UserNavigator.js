
import { createStackNavigator } from 'react-navigation-stack';
import EventListScreen from '../screens/EventListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BalanceScreen from '../screens/BalanceScreen';
import JoinMyEventScreen from '../screens/JoinMyEventScreen';
import TicketScreen from '../screens/TicketScreen';
import MyEventScreen from '../screens/MyEventScreen';
import CreateEventScreen from '../screens/CreateEventScreen';
import LiveScreen from '../screens/LiveScreen';
import VideoChatScreen from '../screens/VideoChatScreen';

export default UserNavigatior = createStackNavigator(
  {
    EventList: EventListScreen,
    Ticket: TicketScreen,
    JoinMyEvent: JoinMyEventScreen,
    Profile: ProfileScreen,
    Balance: BalanceScreen,
    MyEvent: MyEventScreen,
    CreateEvent: CreateEventScreen,
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
    initialRouteName: "EventList",
  },

);