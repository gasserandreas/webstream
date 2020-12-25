// import { RootAction, RootState, Services } from 'MyTypes';
import { v4 as uuidV4 } from 'uuid';
import { combineReducers } from 'redux';
import { createAction, ActionType, createReducer } from 'typesafe-actions';

import { Stream, Id } from '../models';
import { removeIdItem } from './utils';

// action constants
const SET_TIME_INTERVAL = 'settings/setInterval';
const SET_IS_RANDOM = 'settings/setIsRandom';

const ADD_STREAM = 'settings/addStream';
const REMOVE_STREAM = 'settings/removeStream';
const SET_ORDER = 'settings/setOrder';

// types
type SetTimeIntervalPayload = number;
type SetIsRandomPayload = boolean;

type AddStreamPayload = Stream;
type RemoveStreamPayload = Id;
type SetOrderPayload = Array<Id>;

// simple actions
export const setTimeInterval = createAction(
  SET_TIME_INTERVAL,
  (time) => time
)<SetTimeIntervalPayload>();

export const setIsRandom = createAction(
  SET_IS_RANDOM,
  (isRandom) => isRandom
)<SetIsRandomPayload>();

export const addStream = createAction(ADD_STREAM, (id: Id, href: string) => ({
  id: id || uuidV4(),
  href,
}))<AddStreamPayload>();

export const removeStream = createAction(
  REMOVE_STREAM,
  (id: Id) => id
)<RemoveStreamPayload>();

export const setOrder = createAction(
  SET_ORDER,
  (orderedIds: Array<Id>) => orderedIds
)<SetOrderPayload>();

export const settingsActions = {
  setTimeInterval,
  setIsRandom,
  addStream,
  removeStream,
  setOrder,
};

export type SettingsAction = ActionType<typeof settingsActions>;

// epics

// reducers

/**
 * time interval reducers
 */
type TimeIntervalState = number;

const timeIntervalInitialState = 10000;

const timeIntervalReducer = createReducer<TimeIntervalState, SettingsAction>(
  timeIntervalInitialState
).handleAction(settingsActions.setTimeInterval, (_, action) => action.payload);

/**
 * random order reducer
 */
type IsRandomOrderState = boolean;

const isRandomOrderStateReducer = createReducer<
  IsRandomOrderState,
  SettingsAction
>(false).handleAction(
  settingsActions.setIsRandom,
  (_, action) => action.payload
);

/**
 * streams reducers
 */
type StreamsByIdState = {
  [key: string]: Stream;
};

const byIdReducerInitialState = {};

const byIdReducer = createReducer<StreamsByIdState, SettingsAction>(
  byIdReducerInitialState
)
  .handleAction(settingsActions.addStream, (state, action) => {
    const { id } = action.payload;
    return {
      ...state,
      [id]: action.payload,
    };
  })
  .handleAction(settingsActions.removeStream, (state, action) => {
    const newState = { ...state };
    delete newState[action.payload];
    return newState;
  });

type StreamsIdsState = Array<string>;

const idsReducerInitialState: Array<string> = [];

const idsReducer = createReducer<StreamsIdsState, SettingsAction>(
  idsReducerInitialState
)
  .handleAction(
    settingsActions.addStream,
    (state, action) =>
      [...new Set([...state, action.payload.id])] as Array<string>
  )
  .handleAction(settingsActions.removeStream, (state, action) =>
    removeIdItem(state, action.payload)
  );

type StreamsOrderedState = Array<string>;

const orderedInitialState: Array<string> = [];

const orderedReducer = createReducer<StreamsOrderedState, SettingsAction>(
  orderedInitialState
)
  .handleAction(
    settingsActions.addStream,
    (state, action) =>
      [...new Set([...state, action.payload.id])] as Array<string>
  )
  .handleAction(settingsActions.removeStream, (state, action) =>
    removeIdItem(state, action.payload)
  )
  .handleAction(settingsActions.setOrder, (_, action) => action.payload);

type StreamState = {
  readonly byId: StreamsByIdState;
  readonly ids: StreamsIdsState;
  readonly ordered: StreamsOrderedState;
};

const streamsReducer = combineReducers({
  byId: byIdReducer,
  ids: idsReducer,
  ordered: orderedReducer,
});

export type AppState = {
  readonly timeInterval: TimeIntervalState;
  readonly isRandomOrder: IsRandomOrderState;
  readonly stream: StreamState;
};

export default combineReducers({
  timeInterval: timeIntervalReducer,
  isRandomOrder: isRandomOrderStateReducer,
  streams: streamsReducer,
});
