'use strict';

import actions from './actions';
import card from './components/card';
import cardContainer from './components/cardContainer';
import loader from './components/loader';
import login from './components/login';
import { default as toaster } from './components/toast';

export default function core(services) {
  log.info('initialize with ', services);

  const provider = services.providers.mal;

  // Bootstrap the application
  log.info('initialize app...');
  const loginComponent = login(services, provider, '[data-ref="login"]');
  loginComponent.register();

  // Login remebered user or prompt a login, when done render the lists.
  loginComponent.loginOrPrompt().then(user => {
    let list = [];
    const cachedList = services.storage.getItem(`app.${user.username}.list`);

    // Get anime airing dates
    services.bus.when('app:listWasFetched', function(list) {
      const watching = list.filter(anime => anime.status === 1)
        .map(anime => [anime.title, ...anime.synonyms]);

      services.providers.aniList.getAiringDatesByTitles(watching).then(dates => {
        dates.forEach(date => {
          const id = list.find(anime => anime.title === watching[date.index][0]).id;
          services.bus.emit('anime:changed', { id }, {airing: date.airing});
        });
      });
    });

    if (cachedList) {
      log.info('Using cached list...');
      list = JSON.parse(cachedList);
      services.bus.emit('app:listWasFetched', list);
    }

    actions(services, provider, user, list);

    // Register components.
    log.info('Registering components...');
    const toast = toaster(services, '[data-ref="toast"]');
    const appLoadIcon = loader(services, '[data-ref="loader"]');
    const container = cardContainer(services, card, '[data-ref="cardContainer"]', list);

    // Bootstrap components
    appLoadIcon.register();
    container.register();
    toast.register();

    services.bus.emit('app:isDoingSomeWork');
    provider.list.get().then(data => {
      log.info('Fetched list from provider.');

      // Update the container state list only if there are changes
      const json = JSON.stringify(data);

      if (!cachedList) {
        log.info('Updating list from empty cache');
        services.storage.setItem(`app.${user.username}.list`, json);
        container.updateState(data);
        container.render();

        services.bus.emit('app:listWasFetched', data);
      } else if (cachedList !== json) {
        log.info('List updated, resetting cache with new list');
        services.storage.setItem(`app.${user.username}.list`, json);
        container.updateState(data);
        container.render();
        services.bus.emit('app:listWasFetched', data);
      } else {
        log.info('List the same, using cached list');
      }

      services.bus.emit('app:isDoneDoingSomeWork');
    }).catch(err => {
      services.bus.emit('app:isDoneDoingSomeWork');
      toast.show('Failed to retrieve list from MAL. See console for errors', [], 3000);
      console.error(err);
    });
  });
};
