'use strict';

import toHtml from 'string-to-html';
import core from './core';
// import MALjs from './MALjs';
import mediator from './mediator';

import { list } from './list-data';

const seasons = {
  winter: new Date('2017-01-01')
};

const services = {
  providers: {
    mal: { // provider interface
      authenticate: (username, password) => {
        return Promise.resolve(true);
      },
      update: () => {
        return Promise.resolve(true);
      },
      list: function() {
        const data = list.map(anime => ({
          id: parseInt(anime.series_animedb_id),
          title: anime.series_title,
          image: anime.series_image,
          starts: anime.series_start,
          ends: anime.series_end,
          status: parseInt(anime.series_status),
          currentEpisode: parseInt(anime.my_watched_episodes),
          episodeCount: parseInt(anime.series_episodes) ? parseInt(anime.series_episodes) : null,
        }));

        const get = function() {
          return Promise.resolve(data);
        };

        const isWatching = item => item.status === 1;
        const inWinterSeason = item => (new Date(item.starts).getTime() > seasons.winter.getTime());

        const currentSeason = async function () {
          const list = await get();

          return list
            .filter(inWinterSeason)
            .filter(isWatching)
            .sort((a, b) => {
                const dateA = new Date(a.starts);
                const dateB = new Date(b.starts);

                if (dateA.getTime() > dateB.getTime())
                  return 1;

                return -1;
            });
        };

        return {
          currentSeason,
          get
        };
      }(),

    }
  },
  storage: localStorage,
  toHtml: toHtml,
  bus: mediator(),
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
