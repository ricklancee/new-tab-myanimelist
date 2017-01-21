'use strict';

import actions from './actions';
import card from './components/card';
import cardContainer from './components/cardContainer';
import loader from './components/loader';
import login from './components/login';
import { default as toaster } from './components/toast';

export default async function core(services) {
  console.info('initialize with ', services);

  const provider = services.providers.mal;

  // Bootstrap the application
  console.info('initialize app...');
  const loginComponent = login(services, provider, '[data-ref="login"]');
  loginComponent.register();

  const user = await loginComponent.loginOrPrompt();

  let list = [];
  const cachedList = services.storage.getItem(`app.${user.username}.list`);

  if (cachedList) {
    console.info('Using cached list...');
    list = JSON.parse(cachedList);
  }

  actions(services, provider, user, list);

  // Register components.
  console.log('Registering components...');
  const toast = toaster(services, '[data-ref="toast"]');
  const appLoadIcon = loader(services, '[data-ref="loader"]');
  const container = cardContainer(services, card, '[data-ref="cardContainer"]', list);

  // Bootstrap components
  appLoadIcon.register();
  container.register();
  toast.register();

  services.bus.emit('app:isDoingSomeWork');
  provider.list.get().then(data => {
    console.info('Fetched list from provider.');

    services.bus.emit('app:isDoneDoingSomeWork');

    // Update the container state list only if there are changes
    const json = JSON.stringify(data);

    if (!cachedList) {
      console.info('Updating list from empty cache');
      services.storage.setItem(`app.${user.username}.list`, json);
      container.updateState(data);
      container.render();
    } else if (cachedList !== json) {
      console.info('List updated, resetting cache with new list');
      services.storage.setItem(`app.${user.username}.list`, json);
      container.updateState(data);
      container.render();
      toast.show('Your list on MAL was updated, changes are reflected here.', [], 3000);
    } else {
      console.info('List the same, using cached list');
    }
  }).catch(err => {
    services.bus.emit('app:isDoneDoingSomeWork');
    toast.show('Failed to retrieve list from MAL. See console for errors', [], 3000);
    console.error(err);
  });
};
