import { createStackNavigator } from 'react-navigation-stack';
import { createSwitchNavigator } from 'react-navigation';

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

const UserMainNavigatior = createStackNavigator(
  {
    UserHome: EventListScreen,
    Profile: ProfileScreen,
    Balance: BalanceScreen,
    /** SCREENS FOR HOSTING EVENT */
    EventCreate: EventCreateScreen,
    EventPreview: EventPreviewScreen,
    //EventPublish: EventPublishScreen,
    Host: HostScreen,
    HostVideo: HostVideoScreen,
    /** SCREENS FOR JOINING EVENT */
    Ticket: TicketScreen,
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

export default UserNavigator = createSwitchNavigator(
  {
    UserMain: { screen: UserMainNavigatior },
    EventPublish: { screen: EventPublishScreen },
  },
  {
    initialRouteName: "UserMain",
    defaultNavigationOptions: {
      headerTitleAlign: 'center',
      headerStyle: { backgroundColor: colors.BLUE, borderBottomWidth: 0, elevation: 0, shadowOpacity: 0 },
      headerTitleStyle: { color: '#fff', fontWeight: 'normal' },
      cardStyle: { backgroundColor: 'white' }
    }
  },
);

