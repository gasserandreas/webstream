// import { RootState } from 'MyTypes';
// import { Stream } from './models';

import { AppStatus } from './app';
import { ActiveFrame } from './streams';

const initialState = {
  // appTime: 1609066611798,
  app: {
    status: AppStatus.INITIAL,
    showNav: false,
    localStorageSupported: true,
  },
  settings: {
    timeInterval: 30000,
    isRandomOrder: false,
    streams: {
      byId: {
        'd77170d6-49eb-4419-960c-3e73d348cc7f': {
          id: 'd77170d6-49eb-4419-960c-3e73d348cc7f',
          href: 'https://buochs.roundshot.com',
        },
        '2e89f3ea-00c6-43d8-b6d2-7745cc638b64': {
          id: '2e89f3ea-00c6-43d8-b6d2-7745cc638b64',
          href: 'https://grindelwaldbus.roundshot.com',
        },
        '9231db5f-32ec-446a-8a60-bc8bf077b755': {
          id: '9231db5f-32ec-446a-8a60-bc8bf077b755',
          href: 'https://gemmi.roundshot.com',
        },
      },
      ids: [
        'd77170d6-49eb-4419-960c-3e73d348cc7f',
        '2e89f3ea-00c6-43d8-b6d2-7745cc638b64',
        '9231db5f-32ec-446a-8a60-bc8bf077b755',
      ],
      ordered: [
        'd77170d6-49eb-4419-960c-3e73d348cc7f',
        '2e89f3ea-00c6-43d8-b6d2-7745cc638b64',
        '9231db5f-32ec-446a-8a60-bc8bf077b755',
      ],
    },
  },
  streams: {
    active: ActiveFrame.EVEN,
    indices: {
      [ActiveFrame.EVEN]: 0,
      [ActiveFrame.ODD]: 1,
    },
  },
};

export default initialState;
