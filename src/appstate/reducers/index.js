import {combineReducers} from 'redux';
import authReducer from './auth_reducers';
export default combineReducers({
    auth: authReducer
});