import {combineReducers} from 'redux';
import authReducer from './auth_reducers';
import appReducer from './app_reducers';
export default combineReducers({
    auth: authReducer,
    assets: appReducer,
});