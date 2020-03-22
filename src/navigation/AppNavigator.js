import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import SplashScreen from '../screens/SplashScreen';
import MainNavigator from './MainNavigator';


const AppNavigator = createSwitchNavigator(
    {
        Splash: { screen: SplashScreen },
        Main: { screen: MainNavigator},
    },
    {
        initialRouteName: "Splash",
        headerMode: 'none'
    }
);

const App = createAppContainer(AppNavigator);
export default App;