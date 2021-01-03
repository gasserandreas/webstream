import { RootAction, RootState, Services } from 'MyTypes';

import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import debounce from 'lodash/debounce';
import ric from 'ric-shim';

import { composeEnhancers } from './utils';
import rootReducer from './rootReducer';
import { appIdle } from './rootActions';
import rootEpic from './rootEpic';
import services from '../../services';

import devInitialState from '../../entities/devInitialState';

export const epicMiddleware = createEpicMiddleware<
  RootAction,
  RootAction,
  RootState,
  Services
>({
  dependencies: services,
});

// const routerMiddleware = createRouterMiddleware(history);

// configure middlewares
const middlewares = [epicMiddleware];
// compose enhancers
const enhancer = composeEnhancers(applyMiddleware(...middlewares));

// rehydrate state on app start
// const initialState = {};
const initialState =
  process.env.NODE_ENV !== 'production' ? devInitialState : {};

// create store
const store = createStore(rootReducer, initialState, enhancer);

// idle configuration
const idleDispatcher = () => {
  /* istanbul ignore next */
  store.dispatch(appIdle());
};

/* istanbul ignore next */
// debounce app idle all 30 seconds
const deBounced = debounce(() => {
  // The requestAnimationFrame ensures it doesn't run when tab isn't active
  // the requestIdleCallback makes sure the browser isn't busy with something
  // else.
  /* istanbul ignore next */
  requestAnimationFrame(() => ric(idleDispatcher, { timeout: 500 }));
}, 30000);

// Now this will run *each time* something
// is dispatched. But once it's been 30 seconds
// since something has happened. It will cause
// its *own* dispatch. Which then start the cycle
// over again.
store.subscribe(deBounced);

epicMiddleware.run(rootEpic);

// export store singleton instance
export default store;
