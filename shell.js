'use strict';

import core from './core';

// Providers
import mal from './providers/mal';

// Utilities
import mediator from './mediator';

// Virtual domming
import toHtml from 'string-to-html';

const services = {
  hash: function(string) {
    var hash = 0, i, chr, len;
    if (string.length === 0) return hash;
    for (i = 0, len = string.length; i < len; i++) {
      chr   = string.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  },
  toHtml,
  providers: {
    mal: mal()
  },
  storage: localStorage,
  bus: mediator()
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
