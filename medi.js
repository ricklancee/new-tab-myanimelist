"use strict";

const medi = function medi(opts = { log:false }) {
  const channels = {};
  const shouldLog = opts.log;

  const log = {
      info() {
        if (!shouldLog)
          return;

        return console.info(...arguments);
      },
      warn() {
        if (!shouldLog)
          return;

        return console.warn(...arguments);
      }
  };

  const matchesFilter = function(filter, match) {
    const keys = Object.keys(match);

    for (let key of keys) {
      if (match[key] !== filter[key] || !(key in filter)) {
        return false;
      }
    }

    return true;
  };

  const getFirstAndOrSecondArgs = function(args) {
      if (args.length === 1) {
        return [args[0], null];
      }

      return [args[1], args[0]];
  };

  return {
    when(channel, ...args) {
      if (!channels[channel]) {
        channels[channel] = [];
      }

      const [handler, filter] = getFirstAndOrSecondArgs(args);

      channels[channel].push({ filter, handler });

      return this;
    },

    emit(channel, ...args) {
      if (!channels[channel]) {
        log.warn(`Emit(): No handlers for event "${channel}", args: `, ...args);
        return;
      }

      const [payload, filter] = getFirstAndOrSecondArgs(args);

      log.info(`Emit(): Emitting event "${channel}" with payload:`, payload, 'and filter: ', filter);

      const promises = [];

      channels[channel].filter(({ filter: toMatch }) => {
        // If we call a channel that has a filter without specifing a filter: abort.
        if (!filter && toMatch) {
          log.warn(`Emit(): Not calling channel "${ channel }", channel has a filter; no filter given`);
          return false;
        }

        // If we call a channel that has a filter but the given filter does not match: abort.
        if (filter && !(toMatch && matchesFilter(filter, toMatch))) {
          log.warn(`Emit(): Not calling channel "${ channel }", given filter does not match channel's filter`);
          return false;
        }

        return true;
      }).forEach(({ handler }) => {
          // Call each handler; resolve the result if something other than nothing was returned.
          const result = handler(payload);
          if (result !== undefined) {
            promises.push(result);
          }
      });

      return Promise.all(promises);
    },

    delete(channel, handler=null) {
      if (!channels[channel]) {
        log.warn(`Delete(): No handlers for channel "${channel}"; nothing to delete`);
        return false;
      }

      if (!handler) {
        delete channels[channel];
        return this;
      }

      const index = channels[channel].findIndex(({ handler: channelHandler }) => {
        if (channelHandler === handler) {
          return true;
        }

        return false;
      });

      if (index === -1) {
        console.warn(`Delete(): Given handler does not exists on channel "${channel}"`);
        return false;
      }

      channels[channel].splice(index, 1);

      return this;
    }
  };
};

export default medi;
