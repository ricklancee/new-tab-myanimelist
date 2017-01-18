'use strict';

import core from './core';

// Providers
import mal from './providers/mal';

// Utilities
import mediator from './mediator';

// Virtual domming
import h from 'virtual-dom/h';
import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';
import createElement from 'virtual-dom/create-element';

const services = {
  virtualDom: {
    h,
    diff,
    patch,
    createElement
  },
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
