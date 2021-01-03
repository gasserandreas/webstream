import { RootAction, RootState, Services } from 'MyTypes';
import { combineReducers } from 'redux';
import { merge, of, interval } from 'rxjs';
import { mergeMap, delay, takeUntil, map } from 'rxjs/operators';
import { Epic, ofType } from 'redux-observable';
import { createAction, ActionType, createReducer } from 'typesafe-actions';

import { getNextIndex } from './utils';

import { settingsIntervalSelector } from '../settings/selectors';

export enum ActiveFrame {
  ODD = 'odd',
  EVEN = 'even',
}

// constant definitions
const SET_ACTIVE_ACTION_DELAY = 3000;
const RESET_PRELOAD_ACTION_DELAY = 5000;

// action constants
const START_STREAMS = 'streams/start';
const END_STREAMS = 'streams/end';

const SET_ACTIVE_FRAME = 'streams/setActiveFrame';
const SET_PRELOAD_FRAME = 'streams/setPreloadFrame';

const SWITCH = 'streams/switch';
const SET_ODD = 'streams/setOdd';
const SET_EVEN = 'streams/setEven';

const NEXT = 'streams/next';
const PREV = 'streams/prev';
const RELOAD = 'streams/reload';

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

type SwitchPayload = {
  nextIndex: number;
  nextFrame: ActiveFrame;
};

const switchStreams = createAction(SWITCH, (nextIndex, nextFrame) => ({
  nextIndex,
  nextFrame,
}))<SwitchPayload>();

type IndexPayload = number;

const setOdd = createAction(SET_ODD)<IndexPayload>();
const setEven = createAction(SET_EVEN)<IndexPayload>();

const next = createAction(NEXT)<void>();
const prev = createAction(PREV)<void>();
const reload = createAction(RELOAD)<void>();

export const streamsActions = {
  setActive,
  setPreload,
  startStreams,
  endStreams,
  switchStreams,
  setOdd,
  setEven,
  next,
  prev,
  reload,
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
      return interval(userInterval).pipe(
        takeUntil(action$.ofType(END_STREAMS)), // stop on end streams
        mergeMap(() => {
          const {
            value: { streams, settings },
          } = store;

          const { indices, active } = streams;
          const { ids } = settings.streams;

          const nextFrame =
            active === ActiveFrame.EVEN ? ActiveFrame.ODD : ActiveFrame.EVEN;

          const nextIndex = getNextIndex(
            nextFrame === ActiveFrame.EVEN ? indices.odd : indices.even,
            ids.length
          );

          return of(switchStreams(nextIndex, nextFrame));
        })
      );
    })
  );

const handleSwitchEpic: Epic<RootAction, RootAction, RootState, Services> = (
  action$
) =>
  action$.pipe(
    ofType(SWITCH),
    mergeMap((action) => {
      // const { indices, active } = store.value.streams;
      // const { ids } = store.value.settings.streams;

      // const nextActiveFrame =
      //   active === ActiveFrame.EVEN ? ActiveFrame.ODD : ActiveFrame.EVEN;

      // const nextIndex = getNextIndex(
      //   nextActiveFrame === ActiveFrame.EVEN ? indices.odd : indices.even,
      //   ids.length
      // );

      const { nextIndex, nextFrame } = action.payload;

      const setIndexAction = nextFrame === ActiveFrame.EVEN ? setEven : setOdd;

      return merge(
        // set pre-load and next index
        of(setPreload(nextFrame), setIndexAction(nextIndex)),
        // change web stream after delay
        of(setActive(nextFrame)).pipe(delay(SET_ACTIVE_ACTION_DELAY)),
        // reset preload
        of(setPreload(null)).pipe(delay(RESET_PRELOAD_ACTION_DELAY))
      );
    })
  );

const handleNextEpic: Epic<RootAction, RootAction, RootState, Services> = (
  action$,
  store
) =>
  action$.pipe(
    ofType(NEXT),
    map(() => {
      const {
        value: { streams, settings },
      } = store;
      const { indices, active } = streams;
      const { ids } = settings.streams;

      const currentIndex =
        active === ActiveFrame.EVEN ? indices.even : indices.odd;

      let nextIndex = currentIndex + 1;

      if (nextIndex >= ids.length) {
        nextIndex = 0;
      }

      return switchStreams(nextIndex, active);
    })
  );

const handlePrevEpic: Epic<RootAction, RootAction, RootState, Services> = (
  action$,
  store
) =>
  action$.pipe(
    ofType(PREV),
    map(() => {
      const {
        value: { streams, settings },
      } = store;
      const { indices, active } = streams;
      const { ids } = settings.streams;

      const currentIndex =
        active === ActiveFrame.EVEN ? indices.even : indices.odd;

      let nextIndex = currentIndex - 1;

      if (nextIndex < 0) {
        nextIndex = ids.length - 1;
      }

      return switchStreams(nextIndex, active);
    })
  );

export const streamsEpics = {
  handleStreamsEpic,
  handleSwitchEpic,
  handleNextEpic,
  handlePrevEpic,
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
 * preload reducers
 */
type PreloadState = ActiveFrame | null;

const preloadReducer = createReducer<PreloadState, StreamsAction>(
  null
).handleAction(streamsActions.setPreload, (_, action) => action.payload);

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
  readonly preload: ActiveState;
  readonly indices: IndicesState;
};

export default combineReducers<StreamsState, StreamsAction>({
  active: activeReducer,
  preload: preloadReducer,
  indices: indicesReducer,
});
