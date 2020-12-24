import { StateType, ActionType } from 'typesafe-actions';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

declare module 'MyTypes' {
  export type Store = StateType<typeof import('./store').default>;
  export type RootAction = ActionType<typeof import('./rootActions').default>;
  export type RootState = StateType<
    ReturnType<typeof import('./rootReducer').default>
  >;
}

declare module 'typesafe-actions' {
  interface Types {
    RootAction: ActionType<typeof import('./rootActions').default>;
  }
}
