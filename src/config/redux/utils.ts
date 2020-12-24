/* eslint-disable import/prefer-default-export */
import { compose } from 'redux';

export const composeEnhancers =
  (process.env.NODE_ENV === 'development' &&
    window &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || // ts-ignore
  compose;
