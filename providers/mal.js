'use strict';

import { list } from '../list-data';
import MALjs from './mal-api';

const seasons = {
  winter: new Date('2017-01-01')
};

export default function mal() {
  const api = new MALjs('apitest1234', 'OXtmfmalpoHU');

  return {
    authenticate: (username, password) => {
      return Promise.resolve(true);
    },

    updateEpisodeCount: (id, episode) => {
      console.warn('TEMP DISABLED');
      return;

      if (!id || !episode)
        return;

      return api.anime.update(id, {
        episode: episode
      }).then(result => console.log(result));
    },

    list: function() {
      const formatData = anime => ({
        id: parseInt(anime.series_animedb_id, 10),
        title: anime.series_title,
        image: anime.series_image,
        starts: anime.series_start,
        ends: anime.series_end,
        status: parseInt(anime.my_status, 10),
        currentEpisode: parseInt(anime.my_watched_episodes, 10),
        episodeCount: parseInt(anime.series_episodes, 10) ? parseInt(anime.series_episodes, 10) : null,
      });

      const data = list.map(formatData);

      const get = function() {
        return new Promise(resolve => {
          resolve(data);
          console.warn('Using fake data');

          // api.anime.list().then(data => {
          //   resolve(data.myanimelist.anime.map(formatData));
          // });
        });
      };

      return {
        get
      };
    }()
  };
};
