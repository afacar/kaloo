import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import SplashScreen from '../screens/SplashScreen';
import MainNavigator from './MainNavigator';
import DummyMainNavigator from './DummyMainNavigator';
import UserNavigator from "./UserNavigator";

const AppNavigator = createSwitchNavigator(
    {
        Splash: { screen: SplashScreen },
        DummyMain: {screen: DummyMainNavigator},
        Main: { screen: MainNavigator },
        User: { screen: UserNavigator },
    },
    {
        initialRouteName: "Splash",
        headerMode: 'none'
    }
);

const AppContainer = createAppContainer(AppNavigator);
export default AppContainer;