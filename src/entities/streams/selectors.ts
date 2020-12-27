import { RootState } from 'MyTypes';
import { createSelector } from 'reselect';

import { StreamsState, ActiveFrame } from './index';

import {
  settingsStreamsByIdSelector,
  settingsStreamsOrderedSelector,
} from '../settings/selectors';

export const streamsSelector = (state: RootState): StreamsState =>
  state.streams as StreamsState;

export const indicesSelector = createSelector(
  streamsSelector,
  (streams) => streams.indices
);

export const activeSelector = createSelector(
  streamsSelector,
  (streams) => streams.active
);

export const preloadSelector = createSelector(
  streamsSelector,
  (streams) => streams.preload
);

/**
 * should render based on preload state selectors
 */
const shouldRenderSelector = (type: ActiveFrame) =>
  createSelector(preloadSelector, (preload) => preload === type);

export const shouldRenderEvenSelector = shouldRenderSelector(ActiveFrame.EVEN);

export const shouldRenderOddSelector = shouldRenderSelector(ActiveFrame.ODD);

/**
 * should show based on active state selectors
 */
const shouldShowSelector = (type: ActiveFrame) =>
  createSelector(activeSelector, (active) => active === type);

export const shouldShowEvenSelector = shouldShowSelector(ActiveFrame.EVEN);

export const shouldShowOddSelector = shouldShowSelector(ActiveFrame.ODD);

/**
 *
 */
const orderedStreamsSelector = createSelector(
  settingsStreamsByIdSelector,
  settingsStreamsOrderedSelector,
  (byId, orderedIds) => orderedIds.map((id) => byId[id])
);

export const evenStreamSelector = createSelector(
  orderedStreamsSelector,
  indicesSelector,
  (streams, indices) => streams[indices.even]
);

export const oddStreamSelector = createSelector(
  orderedStreamsSelector,
  indicesSelector,
  (streams, indices) => streams[indices.odd]
);
