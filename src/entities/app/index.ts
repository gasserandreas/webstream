import { RootAction, RootState, Services } from 'MyTypes';
import { combineReducers } from 'redux';
import { createAction, ActionType, createReducer } from 'typesafe-actions';
import { map } from 'rxjs/operators';
import { Epic, ofType } from 'redux-observable';

import { supportsLocalstorage } from '../../services/local-storage-service';

export const AppStatus = {
  INITIAL: 'INITIAL',
  APPLICATION_WILL_LOAD: 'APPLICATION_WILL_LOAD',
  APPLICATION_DID_LOAD: 'APPLICATION_DID_LOAD',
};

// types
type DidLoadPayload = {
  showNav: boolean;
  isLocalStorageSupported: boolean;
};

// action constants
const WILL_LOAD = 'app/willLoad';
const DID_LOAD = 'app/didLoad';

// simple actions
const willLoad = createAction(WILL_LOAD)<void>();
const didLoad = createAction(
  DID_LOAD,
  (showNav: boolean, isLocalStorageSupported: boolean) => ({
    showNav,
    isLocalStorageSupported,
  })
)<DidLoadPayload>();

export const appActions = {
  willLoad,
  didLoad,
};

export type AppAction = ActionType<typeof appActions>;

// epics
const didLoadEpic: Epic<RootAction, RootAction, RootState, Services> = (
  action$
) =>
  action$.pipe(
    ofType(WILL_LOAD),
    map(() => didLoad(false, supportsLocalstorage()))
  );

export const appEpics = {
  didLoadEpic,
};

// reducers
type StatusState = string;

const statusReducer = createReducer<StatusState, AppAction>(AppStatus.INITIAL)
  .handleAction(appActions.willLoad, () => AppStatus.APPLICATION_WILL_LOAD)
  .handleAction(appActions.didLoad, () => AppStatus.APPLICATION_DID_LOAD);

type ShowNavState = boolean;

const showNavReducer = createReducer<ShowNavState, AppAction>(
  false
).handleAction(appActions.didLoad, (_, action) => action.payload.showNav);

type LocalStorageSupportedState = boolean;

const localStorageSupportedReducer = createReducer<
  LocalStorageSupportedState,
  AppAction
>(false).handleAction(
  appActions.didLoad,
  (_, action) => action.payload.isLocalStorageSupported
);

export type AppState = {
  readonly status: StatusState;
  readonly showNav: ShowNavState;
  readonly localStorageSupported: LocalStorageSupportedState;
};

export default combineReducers<AppState, AppAction>({
  status: statusReducer,
  showNav: showNavReducer,
  localStorageSupported: localStorageSupportedReducer,
});
