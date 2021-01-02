import { combineEpics } from 'redux-observable';

import { appEpics } from '../../entities/app/index';
import { streamsEpics } from '../../entities/streams/index';
import { settingsEpics } from '../../entities/settings/index';

export default combineEpics(
  ...Object.values(appEpics),
  ...Object.values(streamsEpics),
  ...Object.values(settingsEpics)
);
