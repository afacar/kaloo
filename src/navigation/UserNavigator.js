
import { createStackNavigator } from 'react-navigation-stack';
import EventListScreen from '../screens/EventListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BalanceScreen from '../screens/BalanceScreen';
import MyJoinEventScreen from '../screens/MyJoinEventScreen';
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
    MyJoinEvent: MyJoinEventScreen,
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
    defaultNavigationOptions: {
      cardStyle: { backgroundColor: 'white' }
    }
  }
);