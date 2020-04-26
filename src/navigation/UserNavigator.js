import { createStackNavigator } from 'react-navigation-stack';
import EventListScreen from '../screens/EventListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BalanceScreen from '../screens/BalanceScreen';
import GuestScreen from '../screens/GuestScreen';
import TicketScreen from '../screens/TicketScreen';
import HostScreen from '../screens/HostScreen';
import EventCreateScreen from '../screens/EventCreateScreen';
import EventPreviewScreen from '../screens/EventPreviewScreen';
import EventPublishScreen from "../screens/EventPublishScreen";
import HostVideoScreen from '../screens/HostVideoScreen';
import VideoScreen from '../screens/VideoScreen';
import { colors } from '../constants';

export default UserNavigatior = createStackNavigator(
  {
    UserHome: EventListScreen,
    EventCreate: EventCreateScreen,
    EventPreview: EventPreviewScreen,
    EventPublish: EventPublishScreen,
    Ticket: TicketScreen,
    Profile: ProfileScreen,
    Balance: BalanceScreen,
    /** SCREENS FOR HOSTING EVENT */
    Host: HostScreen,
    HostVideo: HostVideoScreen,
    /** SCREENS FOR JOINING EVENT */
    Guest: GuestScreen,
    Video: VideoScreen,
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