import { combineReducers } from 'redux';

import appReducer from '../../entities/app';
import settingsReducer from '../../entities/settings';

const reducers = combineReducers({
  appTime: Date.now,
  app: appReducer,
  settings: settingsReducer,
});

export default reducers;
