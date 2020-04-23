import { createStackNavigator } from 'react-navigation-stack';
import EventListScreen from '../screens/EventListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BalanceScreen from '../screens/BalanceScreen';
import MyJoinEventScreen from '../screens/MyJoinEventScreen';
import MyTicketScreen from '../screens/MyTicketScreen';
import MyEventScreen from '../screens/MyEventScreen';
import EventCreateScreen from '../screens/EventCreateScreen';
import EventPreviewScreen from '../screens/EventPreviewScreen';
import EventPublishScreen from "../screens/EventPublishScreen";
import LiveScreen from '../screens/LiveScreen';
//import VideoChatScreen from '../screens/VideoChatScreen';
import HostMeetingScreen from '../screens/HostMeetingScreen';
import { colors } from '../constants';
import MyMeetingScreen from '../screens/MyMeetingScreen';
import HostBroadcastScreen from '../screens/HostBroadcastScreen';
import MyBroadcastScreen from '../screens/MyBroadcastScreen';

export default UserNavigatior = createStackNavigator(
  {
    UserHome: EventListScreen,
    EventCreate: EventCreateScreen,
    EventPreview: EventPreviewScreen,
    EventPublish: EventPublishScreen,
    MyTicket: MyTicketScreen,
    MyJoinEvent: MyJoinEventScreen,
    Profile: ProfileScreen,
    Balance: BalanceScreen,
    MyEvent: MyEventScreen,
    HostMeeting: HostMeetingScreen,
    HostBroadcast: HostBroadcastScreen,
    MyMeeting: MyMeetingScreen,
    MyBroadcast: MyBroadcastScreen,
  },
  {
    initialRouteName: "UserHome",
    defaultNavigationOptions: {
      headerTitleAlign: 'center',
      headerStyle: { backgroundColor: colors.BLUE, borderBottomWidth: 0, elevation: 0, shadowOpacity: 0 },
      headerTitleStyle: { color: '#fff', fontWeight: 'normal' },
      cardStyle: { backgroundColor: 'white' }
    }
  }
);