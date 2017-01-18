'use strict';

export default function actions(bus, provider) {

  bus.when('card:changed', (cardState) => {
    console.info('A card changed:', cardState);
  });

  bus.when('anime:currentEpisodeChanged', (data) => {
    console.info('Episode count changed:', data);
    provider.updateEpisodeCount(data.id, data.currentEpisode);
  });
};
