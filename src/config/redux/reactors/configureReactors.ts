// global store
import ric from 'ric-shim';
import { Store, AnyAction } from 'redux';
import { Selector } from 'reselect';

const improveStore = (
  store: Store,
  reactors: Array<Selector<Store, AnyAction>>
) => (): void => {
  const state = store.getState();

  let nextReaction: AnyAction | null = null;
  reactors.some((reactor) => {
    const result = reactor(state);
    if (result) {
      nextReaction = result;
      // returning true will stop the loop
      return true;
    }
    return false;
  });

  // if we found something
  // schedule it for dispatch
  if (nextReaction) {
    // We'll use requestIdleCallback where
    // available. This `ric-shim` library
    // I'm using here will fallback to
    // setTimeout(() => {}, 0) if needed.
    ric(() => {
      if (nextReaction) {
        store.dispatch(nextReaction);
      }
    });
  }
};

export default improveStore;
