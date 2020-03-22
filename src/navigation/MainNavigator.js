
import { createStackNavigator } from 'react-navigation-stack';
import MainScreen from '../screens/MainScreen';

export default MainNavigatior = createStackNavigator(
  {
    Main: MainScreen
  },
  {
    initialRouteName: "Main",
    headerMode: 'none'
  },

);