import { combineEpics } from 'redux-observable';

import { appEpics } from '../../entities/app/index';
import { streamsEpics } from '../../entities/streams/index';

export default combineEpics(
  ...Object.values(appEpics),
  ...Object.values(streamsEpics)
);
