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
import HostCallScreen from '../screens/HostCallScreen';
import { colors } from '../constants';
import CallScreen from '../screens/CallScreen';
import HostCastScreen from '../screens/HostCastScreen';
import CastScreen from '../screens/CastScreen';

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
    HostCall: HostCallScreen,
    HostBroadcast: HostCastScreen,
    /** SCREENS FOR JOINING EVENT */
    Guest: GuestScreen,
    Call: CallScreen,
    Broadcast: CastScreen,
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