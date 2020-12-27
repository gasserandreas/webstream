import { RootAction, RootState, Services } from 'MyTypes';
import { combineReducers } from 'redux';
import { merge, of, interval } from 'rxjs';
import { mergeMap, delay, takeUntil } from 'rxjs/operators';
import { Epic, ofType } from 'redux-observable';
import { createAction, ActionType, createReducer } from 'typesafe-actions';

import { getNextIndex } from './utils';

import { settingsIntervalSelector } from '../settings/selectors';

export enum ActiveFrame {
  ODD = 'odd',
  EVEN = 'even',
}

// constant definitions
const ACTION_DELAY = 3000;

// action constants
const START_STREAMS = 'streams/start';
const END_STREAMS = 'streams/end';

const SET_ACTIVE_FRAME = 'streams/setActiveFrame';
const SET_PRELOAD_FRAME = 'streams/setPreloadFrame';

const SWITCH = 'streams/switch';
const SET_ODD = 'streams/setOdd';
const SET_EVEN = 'streams/setEven';

// const RELOAD = 'streams/reload';

// simple actions
const startStreams = createAction(START_STREAMS)<void>();
const endStreams = createAction(END_STREAMS)<void>();

type SetActivePayload = ActiveFrame | null;

const setActive = createAction(
  SET_ACTIVE_FRAME,
  (active: ActiveFrame | null) => active
)<SetActivePayload>();

type SetPreloadPayload = ActiveFrame | null;

const setPreload = createAction(
  SET_PRELOAD_FRAME,
  (preload: ActiveFrame | null) => preload
)<SetPreloadPayload>();

type SwitchStreamsPayload = {
  activeIndex: number;
};

const switchStreams = createAction(SWITCH, (activeIndex: number) => ({
  activeIndex,
}))<SwitchStreamsPayload>();

type IndexPayload = number;

const setOdd = createAction(SET_ODD)<IndexPayload>();
const setEven = createAction(SET_EVEN)<IndexPayload>();

export const streamsActions = {
  setActive,
  setPreload,
  startStreams,
  endStreams,
  switchStreams,
  setOdd,
  setEven,
};

export type StreamsAction = ActionType<typeof streamsActions>;

// epics
const handleStreamsEpic: Epic<RootAction, RootAction, RootState, Services> = (
  action$,
  store
) =>
  action$.pipe(
    ofType(START_STREAMS),
    mergeMap(() => {
      const userInterval = settingsIntervalSelector(store.value);
      console.log({ userInterval }); // eslint-disable-line

      return interval(userInterval).pipe(
        takeUntil(action$.ofType(END_STREAMS)), // stop on end streams
        mergeMap(() => {
          const { indices, active } = store.value.streams;
          const { ids } = store.value.settings.streams;
          console.log({ indices }); // eslint-disable-line
          console.log('calculate next integer'); // eslint-disable-line

          const nextActiveFrame =
            active === ActiveFrame.EVEN ? ActiveFrame.ODD : ActiveFrame.EVEN;

          const nextIndex = getNextIndex(
            nextActiveFrame === ActiveFrame.EVEN ? indices.odd : indices.even,
            ids.length
          );

          const setIndexAction =
            nextActiveFrame === ActiveFrame.EVEN ? setEven : setOdd;

          return merge(
            of(setPreload(nextActiveFrame), setIndexAction(nextIndex)),
            of(setActive(nextActiveFrame)).pipe(delay(ACTION_DELAY))
          );
        })
      );
    })
  );

export const streamsEpics = {
  handleStreamsEpic,
};

// reducers

/**
 * active reducers
 */
type ActiveState = ActiveFrame | null;

const activeReducer = createReducer<ActiveState, StreamsAction>(
  null
).handleAction(streamsActions.setActive, (_, action) => action.payload);
// .handleAction(streamsActions.startStreams, () => true)
// .handleAction(streamsActions.endStreams, () => false);

/**
 * indices reducer
 */
type IndexState = number;

const evenReducerInitialState = 0;

const evenReducer = createReducer<IndexState, StreamsAction>(
  evenReducerInitialState
).handleAction(streamsActions.setEven, (_, action) => action.payload);

const oddReducerInitialState = 1;

const oddReducer = createReducer<IndexState, StreamsAction>(
  oddReducerInitialState
).handleAction(streamsActions.setOdd, (_, action) => action.payload);

type IndicesState = {
  readonly even: IndexState;
  readonly odd: IndexState;
};

const indicesReducer = combineReducers<IndicesState, StreamsAction>({
  even: evenReducer,
  odd: oddReducer,
});

export type StreamsState = {
  readonly active: ActiveState;
  readonly indices: IndicesState;
};

export default combineReducers<StreamsState, StreamsAction>({
  active: activeReducer,
  indices: indicesReducer,
});
