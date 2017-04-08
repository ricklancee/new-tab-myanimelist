'use strict';

import MALjs from './mal-api';

export default function mal() {
  let api;

  return {
    setCredentials: function (username, password) {
      api = new MALjs(username, password);
    },

    authenticate: (username, password) => {
      api = new MALjs(username, password);
      return api.verifyCredentials();
    },

    updateEpisodeCount: (id, episode) => {
      if (!id || !episode)
        return Promise.reject('Error: No episode id or episode number given.');

      return api.anime.update(id, {
        episode: episode
      });
    },

    list: function() {
      const formatData = anime => ({
        id: parseInt(anime.series_animedb_id, 10),
        title: anime.series_title,
        synonyms: anime.series_synonyms.split('; ').filter(title => title.trim()),
        image: anime.series_image,
        starts: anime.series_start,
        ends: anime.series_end,
        status: parseInt(anime.my_status, 10),
        currentEpisode: parseInt(anime.my_watched_episodes, 10),
        episodeCount: parseInt(anime.series_episodes, 10) ? parseInt(anime.series_episodes, 10) : null,
      });

      const get = function() {
        return api.anime.list().then(data => {
          return Promise.resolve(data.myanimelist.anime.map(formatData));
        });
      };

      return {
        get
      };
    }()
  };
};
