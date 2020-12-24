const version = process.env.APP_VERSION;
const STORAGE_KEY = `__SERIALIZED_STATE_TREE_v${version}__`;

export function supportsLocalstorage(): boolean {
  return !!localStorage;
}

export function saveState<T = unknown>(storeState: T): boolean {
  if (!supportsLocalstorage()) {
    return false;
  }

  try {
    const serializedState = JSON.stringify(storeState);
    localStorage.setItem(STORAGE_KEY, serializedState);
    return true;
  } catch (error) {
    throw new Error('store serialization failed');
  }
}

export function loadState<T = unknown>(): T | undefined {
  if (!supportsLocalstorage()) {
    return undefined;
  }

  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState == null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (error) {
    throw new Error('store deserialization failed');
  }
}
