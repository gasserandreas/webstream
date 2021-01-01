import { v4 as uuidv4 } from 'uuid';

export type LinkItems = {
  id: ID;
  value: string;
};

export type FormData = {
  interval: string;
  random: boolean;
  items: Array<LinkItems>;
};

export const initialState: FormData = {
  interval: '5',
  random: false,
  items: [
    {
      id: uuidv4(),
      value: 'no value 1',
    },
    {
      id: uuidv4(),
      value: 'no value 2',
    },
    {
      id: uuidv4(),
      value: 'no value 3',
    },
    {
      id: uuidv4(),
      value: 'no value 4',
    },
  ],
};
