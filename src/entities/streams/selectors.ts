import { RootState } from 'MyTypes';
import { createSelector } from 'reselect';

import { StreamsState } from './index';

export const streamsSelector = (state: RootState): StreamsState =>
  state.streams as StreamsState;

export const indicesSelector = createSelector(
  streamsSelector,
  (streams) => streams.indices
);

