import { combineEpics } from 'redux-observable';

import { appEpics } from '../../entities/app/index';

export default combineEpics(...Object.values(appEpics));
