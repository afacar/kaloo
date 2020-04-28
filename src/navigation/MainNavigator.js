import { createStackNavigator } from 'react-navigation-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignInScreen from '../screens/SignInScreen';
import RegisterScreen from '../screens/RegisterScreen';
import TicketScreen from '../screens/TicketScreen';
import GuestScreen from '../screens/GuestScreen';
import VideoScreen from '../screens/VideoScreen';

import { colors } from '../constants';

export default MainNavigatior = createStackNavigator(
  {
    Home: WelcomeScreen,
    SignIn: SignInScreen,
    Register: RegisterScreen,
    ATicket: TicketScreen,
    AGuest: GuestScreen,
    AVideo: VideoScreen,
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