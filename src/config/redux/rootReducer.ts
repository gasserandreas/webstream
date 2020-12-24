import { combineReducers } from 'redux';

import appReducer from '../../entities/app';

const reducers = combineReducers({
  appTime: Date.now,
  app: appReducer,
});

export default reducers;
