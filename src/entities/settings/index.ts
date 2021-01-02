import { RootAction, RootState, Services } from 'MyTypes';
import { v4 as uuidV4 } from 'uuid';
import { combineReducers } from 'redux';
import { Epic, ofType } from 'redux-observable';
import { createAction, ActionType, createReducer } from 'typesafe-actions';
import { map } from 'rxjs/operators';

import { Link, Id } from '../models';
import { removeIdItem, addIdItem } from './utils';

// action constants
const SET_SETTINGS = 'settings/setSettings';

const SET_TIME_INTERVAL = 'settings/setInterval';
const SET_IS_RANDOM = 'settings/setIsRandom';

const ADD_STREAM = 'settings/addStream';
const REMOVE_STREAM = 'settings/removeStream';
const SET_ORDER = 'settings/setOrder';

const SET_LAST_SAVED = 'settings/setLastSaved';

// types
type SetSettingsPayload = {
  interval: number;
  isRandom: boolean;
  links: {
    byId: ObjectMap<Link>;
    ids: Array<string>;
    ordered: Array<string>;
  };
};

type SetTimeIntervalPayload = number;
type SetIsRandomPayload = boolean;

type AddStreamPayload = Link;
type RemoveStreamPayload = Id;
type SetOrderPayload = Array<Id>;

// simple actions
export const setSettings = createAction(
  SET_SETTINGS,
  (interval, isRandom, links) => {
    const byId: ObjectMap<Link> = {};
    const ids: Array<string> = [];
    const ordered: Array<string> = [];

    links.forEach((link: Link) => {
      const { id } = link;

      byId[id] = link;
      ids.push(id);
      ordered.push(id);
    });

    const newLinks = {
      byId,
      ids,
      ordered,
    };

    return { interval, isRandom, links: newLinks };
  }
)<SetSettingsPayload>();

export const setTimeInterval = createAction(
  SET_TIME_INTERVAL,
  (time) => time
)<SetTimeIntervalPayload>();

export const setIsRandom = createAction(
  SET_IS_RANDOM,
  (isRandom) => isRandom
)<SetIsRandomPayload>();

export const addStream = createAction(ADD_STREAM, (id: Id, value: string) => ({
  id: id || uuidV4(),
  value,
}))<AddStreamPayload>();

export const removeStream = createAction(
  REMOVE_STREAM,
  (id: Id) => id
)<RemoveStreamPayload>();

export const setOrder = createAction(
  SET_ORDER,
  (orderedIds: Array<Id>) => orderedIds
)<SetOrderPayload>();

export const setLastSaved = createAction(SET_LAST_SAVED)<void>();

export const settingsActions = {
  setTimeInterval,
  setIsRandom,
  addStream,
  removeStream,
  setOrder,
  setSettings,
  setLastSaved,
};

export type SettingsAction = ActionType<typeof settingsActions>;

// epics
const updateSettingsEpic: Epic<RootAction, RootAction, RootState, Services> = (
  action$
) =>
  action$.pipe(
    ofType(
      SET_SETTINGS,
      SET_TIME_INTERVAL,
      SET_IS_RANDOM,
      ADD_STREAM,
      REMOVE_STREAM,
      SET_ORDER
    ),
    map(() => setLastSaved())
  );

export const settingsEpics = {
  updateSettingsEpic,
};

// reducers

/**
 * time interval reducers
 */
type TimeIntervalState = number;

const timeIntervalInitialState = 30000;

const timeIntervalReducer = createReducer<TimeIntervalState, SettingsAction>(
  timeIntervalInitialState
)
  .handleAction(settingsActions.setTimeInterval, (_, action) => action.payload)
  .handleAction(
    settingsActions.setSettings,
    (_, action) => action.payload.interval
  );

/**
 * random order reducer
 */
type IsRandomOrderState = boolean;

const isRandomOrderStateReducer = createReducer<
  IsRandomOrderState,
  SettingsAction
>(false)
  .handleAction(settingsActions.setIsRandom, (_, action) => action.payload)
  .handleAction(
    settingsActions.setSettings,
    (_, action) => action.payload.isRandom
  );

/**
 * streams reducers
 */
type StreamsByIdState = {
  [key: string]: Link;
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
  })
  .handleAction(
    settingsActions.setSettings,
    (_, action) => action.payload.links.byId
  );

type StreamsIdsState = Array<string>;

const idsReducerInitialState: Array<string> = [];

const idsReducer = createReducer<StreamsIdsState, SettingsAction>(
  idsReducerInitialState
)
  .handleAction(settingsActions.addStream, (state, action) =>
    addIdItem(state, action.payload.id)
  )
  .handleAction(settingsActions.removeStream, (state, action) =>
    removeIdItem(state, action.payload)
  )
  .handleAction(
    settingsActions.setSettings,
    (_, action) => action.payload.links.ids
  );

type StreamsOrderedState = Array<string>;

const orderedInitialState: Array<string> = [];

const orderedReducer = createReducer<StreamsOrderedState, SettingsAction>(
  orderedInitialState
)
  .handleAction(settingsActions.addStream, (state, action) =>
    addIdItem(state, action.payload.id)
  )
  .handleAction(settingsActions.removeStream, (state, action) =>
    removeIdItem(state, action.payload)
  )
  .handleAction(settingsActions.setOrder, (_, action) => action.payload)
  .handleAction(
    settingsActions.setSettings,
    (_, action) => action.payload.links.ordered
  );

type StreamState = {
  readonly byId: StreamsByIdState;
  readonly ids: StreamsIdsState;
  readonly ordered: StreamsOrderedState;
};

const streamsReducer = combineReducers<StreamState, SettingsAction>({
  byId: byIdReducer,
  ids: idsReducer,
  ordered: orderedReducer,
});

/**
 * meta reducer
 */
type MetaState = {
  lastSaved: number | null;
};

const metaInitialState = {
  lastSaved: null,
};

const metaReducer = createReducer<MetaState, SettingsAction>(
  metaInitialState
).handleAction(settingsActions.setLastSaved, (state) => ({
  ...state,
  lastSaved: Date.now(),
}));

export type SettingsState = {
  readonly timeInterval: TimeIntervalState;
  readonly isRandomOrder: IsRandomOrderState;
  readonly streams: StreamState;
  readonly meta: MetaState;
};

export default combineReducers<SettingsState, SettingsAction>({
  timeInterval: timeIntervalReducer,
  isRandomOrder: isRandomOrderStateReducer,
  streams: streamsReducer,
  meta: metaReducer,
});
