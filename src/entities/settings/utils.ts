/* eslint-disable import/prefer-default-export */
import { Id } from '../models';

export function removeIdItem(array: Array<Id>, id: Id): Array<Id> {
  return array.filter((item: Id) => item !== id);
}
