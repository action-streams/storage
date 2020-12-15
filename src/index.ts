import { Action } from '@action-streams/core';
import { now } from '@most/core';
import { Stream } from '@most/types';

const StorageActionType = 'storage';

interface StorageAction extends Action {
  payload: unknown;
  type: typeof StorageActionType;
}

// @todo handle other storage locations
const readFrom = (key: string): Stream<StorageAction> => {
  const value = window.localStorage.getItem(key);

  try {
    if (value === null) {
      throw new Error('not found');
    }

    return now({
      payload: JSON.parse(value),
      type: StorageActionType,
    });
  } catch (error) {
    return now({
      error: true,
      payload: error,
      type: StorageActionType,
    });
  }
};

// @todo handle other storage locations
// @todo diff to avoid useless writes
const writeTo = (key: string) => (action: StorageAction): void => {
  if (action.type === StorageActionType) {
    window.localStorage.setItem(key, JSON.stringify(action.payload));
  }
};

export { readFrom, StorageAction, StorageActionType, writeTo };
