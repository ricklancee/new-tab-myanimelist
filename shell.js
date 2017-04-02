'use strict';

import core from './core';

// Providers
import mal from './providers/mal';
import aniList from './providers/anilist';

// Utilities
import mediator from './mediator';
import moment from 'moment';
import toHtml from 'string-to-html';

const services = {
  toHtml,
  providers: {
    mal: mal(),
    aniList: aniList(localStorage)
  },
  storage: localStorage,
  bus: mediator(),
  date: moment
};

export default function shell(opts = { log: false }) {

  const info = window.console.info;
  const log = window.console.log;
  const warn = window.console.warn;

  window.console.info = (...args) => {
    if (opts.log === true || opts.log === 'INFO')
      return info(...args);
  };

  window.console.log = (...args) => {
    if (opts.log === true || opts.log === 'LOG')
      return log(...args);
  };

  window.console.warn = (...args) => {
    if (opts.log === true || opts.log === 'WARN')
      return warn(...args);
  };

  return core(services);
};
