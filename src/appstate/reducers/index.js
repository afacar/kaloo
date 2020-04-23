import { combineReducers } from 'redux';
import authReducer from './auth_reducers';
import appReducer from './app_reducers';
import hostReducer from './host_reducers';
import audienceReducer from './audience_reducers';

export default combineReducers({
    auth: authReducer,
    assets: appReducer,
    events: hostReducer,
    joinEvent: audienceReducer,
});