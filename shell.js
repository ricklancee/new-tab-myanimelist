'use strict';

import core from './core';

// Providers
import mal from './providers/mal';
import aniList from './providers/anilist';

// Utilities
import medi from './medi';
import moment from 'moment';
import toHtml from 'string-to-html';

const services = {
  toHtml,
  providers: {
    mal: mal(),
    aniList: aniList(localStorage)
  },
  storage: localStorage,
  bus: medi(),
  date: moment
};

export default function shell(opts = { log: false }) {
  window.log = {
      info() {
        if (!opts.log)
          return;

        return console.info(...arguments);
      },
      warn() {
        if (!opts.log)
          return;

        return console.warn(...arguments);
      }
  };

  return core(services);
};
