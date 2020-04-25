
import { createStackNavigator } from 'react-navigation-stack';
import ATicketScreen from '../screens/ATicketScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignInScreen from '../screens/SignInScreen';
import AGuestScreen from '../screens/AGuestScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ACallScreen from '../screens/ACallScreen';
import ACastScreen from '../screens/ACastScreen';
import { colors } from '../constants';

export default MainNavigatior = createStackNavigator(
  {
    Home: WelcomeScreen,
    ATicket: ATicketScreen,
    AGuest: AGuestScreen,
    ACall: ACallScreen,
    ABroadcast: ACastScreen,
    SignIn: SignInScreen,
    Register: RegisterScreen,
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