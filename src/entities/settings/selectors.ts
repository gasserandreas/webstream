import { RootState } from 'MyTypes';
import { createSelector } from 'reselect';

import { SettingsState } from './index';

export const settingsSelector = (state: RootState): SettingsState =>
  state.settings as SettingsState;

export const settingsIntervalSelector = createSelector(
  settingsSelector,
  (state: SettingsState) => state.timeInterval
);
