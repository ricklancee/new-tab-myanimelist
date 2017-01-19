'use strict';

export default function actions(bus, provider) {
  const changes = {};

  let queue = {};
  const queuePop = function(channel, cb) {
    if (!queue[channel]) queue[channel] = {};

    clearTimeout(queue[channel].timeout);
    queue[channel].timeout = setTimeout(cb, 350);
  };

  bus.when('card:changed', (cardState) => {
    console.info('A card changed:', cardState);
  });

  bus.when('anime:currentEpisodeChanged', (data) => {
    console.info('Episode count changed:', data);

    queuePop('updateEpisodeCount', () => {
      console.log(data.id, data.currentEpisode);
      provider.updateEpisodeCount(data.id, data.currentEpisode);
    });
  });
};
