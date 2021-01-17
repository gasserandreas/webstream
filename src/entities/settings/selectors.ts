import { RootState } from 'MyTypes';
import { createSelector } from 'reselect';

import { SettingsState } from './index';

export const settingsSelector = (state: RootState): SettingsState =>
  state.settings as SettingsState;

export const settingsIntervalSelector = createSelector(
  settingsSelector,
  (state: SettingsState) => state.timeInterval
);

export const settingsIsRandomOrderSelector = createSelector(
  settingsSelector,
  (state: SettingsState) => state.isRandomOrder
);

export const settingsStreamsSelector = createSelector(
  settingsSelector,
  (state: SettingsState) => state.streams
);

export const settingsStreamsByIdSelector = createSelector(
  settingsStreamsSelector,
  ({ byId }) => byId
);

export const settingsStreamsIdsSelector = createSelector(
  settingsStreamsSelector,
  ({ ids }) => ids
);

export const settingsStreamsOrderedSelector = createSelector(
  settingsStreamsSelector,
  ({ ordered }) => ordered
);

export const settingsStreamsRandomOrderedSelector = createSelector(
  settingsStreamsSelector,
  ({ randomOrdered }) => randomOrdered
);

export const settingsStreamsOrderedListSelector = createSelector(
  settingsStreamsByIdSelector,
  settingsStreamsOrderedSelector,
  (byId, orderedIds) => orderedIds.map((id) => byId[id])
);

export const settingsMetaSelector = createSelector(
  settingsSelector,
  ({ meta }) => meta
);

export const settingsMetaLastSavedSelector = createSelector(
  settingsMetaSelector,
  ({ lastSaved }) => lastSaved
);
