import {
  createStore,
  applyMiddleware,
  compose,
  Middleware,
  Store,
} from 'redux';
import debounce from 'lodash/debounce';
import ric from 'ric-shim';
import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer from './rootReducer';

import configureReactors from './reactors/configureReactors';
import reactors from './reactors/reactors';

export const APP_IDLE = 'APP_IDLE';

export const getMiddleware = (): Array<Middleware> => {
  // create middleware
  const middleware: Array<Middleware> = [];

  return middleware;
};

const configureStore = (initialState = {}): Store => {
  // implemented as functions to enable isolated testing
  const middleware = getMiddleware();

  const store =
    process.env.NODE_ENV !== 'development'
      ? createStore(
          rootReducer,
          initialState,
          compose(applyMiddleware(...middleware))
        )
      : createStore(
          rootReducer,
          initialState,
          composeWithDevTools(applyMiddleware(...middleware))
        );

  // add reactors
  store.subscribe(configureReactors(store, reactors));

  // idle configuration
  const idleDispatcher = () => {
    /* istanbul ignore next */
    store.dispatch({ type: APP_IDLE });
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

  return store;
};

export default configureStore;
