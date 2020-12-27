declare type Optional<T> = T | null;

declare type ObjectMap<T> = { [key: string]: T };

declare module 'ric-shim';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}
