
import { createStackNavigator } from 'react-navigation-stack';
import MainScreen from '../screens/MainScreen';
import SignUpScreen from '../screens/SignUpScreen';
import SignInScreen from '../screens/SignInScreen';
import JoinEventScreen from '../screens/JoinEventScreen';
import RegisterScreen from '../screens/RegisterScreen';

export default MainNavigatior = createStackNavigator(
  {
    Home: MainScreen,
    JoinEvent: JoinEventScreen,
    Signup: SignUpScreen,
    SignIn: SignInScreen,
    Register: RegisterScreen,
  },
  {
    initialRouteName: "Home",
    //headerMode: 'none'
  },

);