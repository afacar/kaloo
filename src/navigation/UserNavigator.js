
import { createStackNavigator } from 'react-navigation-stack';
import EventListScreen from '../screens/EventListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BalanceScreen from '../screens/BalanceScreen';
import EventScreen from '../screens/EventScreen';
import CreateEventScreen from '../screens/CreateEventScreen';

export default UserNavigatior = createStackNavigator(
  {
    EventList: EventListScreen,
    Profile: ProfileScreen,
    Balance: BalanceScreen,
    Event: EventScreen,
    CreateEvent: CreateEventScreen
  },
  {
    initialRouteName: "EventList",
  },

);