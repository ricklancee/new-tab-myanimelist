'use strict';

export default function actions({bus, storage}, provider, user, list) {
  const changes = {};

  let queue = {};
  const queuePop = function(channel, cb) {
    if (!queue[channel]) queue[channel] = {};

    clearTimeout(queue[channel].timeout);
    queue[channel].timeout = setTimeout(cb, 200);
  };

  bus.when('card:changed', (cardState) => {
    // console.info('A card changed:', cardState);
  });

  bus.when('anime:currentEpisodeChanged', (data) => {
    console.info('Episode count changed:', data);

    queuePop('updateEpisodeCount', () => {
      bus.emit('app:isDoingSomeWork');

      // const currentCache = storage.getItem('app.list');
      const newCache = JSON.stringify(list);

      storage.setItem(`app.${user.username}.list`, newCache);

      provider.updateEpisodeCount(data.id, data.currentEpisode).then(_ => {
        bus.emit('app:isDoneDoingSomeWork');

        // if failed revert cache, check with timestamps? which ever is newer?
      });
    });
  });
};
