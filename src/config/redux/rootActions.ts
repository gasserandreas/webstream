import { AnyAction } from 'redux';
import { action } from 'typesafe-actions';

import { appActions } from '../../entities/app';
import { settingsActions } from '../../entities/settings';

export const APP_IDLE = 'APP_IDLE';

export const appIdle = (): AnyAction => action(APP_IDLE);

export default {
  appIdle,
  app: appActions,
  settings: settingsActions,
};
