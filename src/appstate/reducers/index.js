import { combineReducers } from 'redux';
import authReducer from './auth_reducers';
import appReducer from './app_reducers';
import eventReducer from './event_reducers';

export default combineReducers({
    auth: authReducer,
    assets: appReducer,
    eventLive: eventReducer,
});