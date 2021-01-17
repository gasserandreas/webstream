/* eslint-disable import/prefer-default-export */
import { Id } from '../models';

export function removeIdItem(array: Array<Id>, id: Id): Array<Id> {
  return array.filter((item: Id) => item !== id);
}

export function addIdItem(array: Array<Id>, id: Id): Array<Id> {
  return [...new Set([...array, id])] as Array<string>;
}

/**
 * Here's a JavaScript implementation of the Durstenfeld shuffle, an optimized version of Fisher-Yates:
 * Link: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array?rq=1
 *
 * @param items
 */
export function shuffleItems(items: Array<Id>): Array<Id> {
  const newItems = [...items];
  // eslint-disable-next-line no-plusplus
  for (let i = newItems.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newItems[i], newItems[j]] = [newItems[j], newItems[i]];
  }
  return newItems;
}
