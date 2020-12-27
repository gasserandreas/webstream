import { combineReducers } from 'redux';

import appReducer from '../../entities/app';
import settingsReducer from '../../entities/settings';
import streamsReducer from '../../entities/streams';

const reducers = combineReducers({
  appTime: Date.now,
  app: appReducer,
  settings: settingsReducer,
  streams: streamsReducer,
});

export default reducers;
