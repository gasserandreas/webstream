import { combineReducers } from 'redux';

const reducers = combineReducers({
  appTime: Date.now,
});

export default reducers;
