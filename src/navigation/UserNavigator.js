
import { createStackNavigator } from 'react-navigation-stack';
import EventListScreen from '../screens/EventListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BalanceScreen from '../screens/BalanceScreen';
import MyEventScreen from '../screens/MyEventScreen';
import CreateEventScreen from '../screens/CreateEventScreen';

export default UserNavigatior = createStackNavigator(
  {
    EventList: EventListScreen,
    Profile: ProfileScreen,
    Balance: BalanceScreen,
    MyEvent: MyEventScreen,
    CreateEvent: CreateEventScreen
  },
  {
    initialRouteName: "EventList",
  },

);