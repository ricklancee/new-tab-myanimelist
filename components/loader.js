'use strict';

export default function loader({ bus }, refSelector) {
  let rootNode = null;
  let thingsDoingWork = 0;
  let isLoading = true;

  const show = function() {
    log.info('loader:show() show a loader');
    isLoading = true;
    thingsDoingWork++;
    rootNode.classList.add('isLoading');
  };

  const hide = function() {
    if (!isLoading)
      return;

    if (!-- thingsDoingWork) {
      log.info('loader:hide() all loaders done');
      rootNode.classList.remove('isLoading');
      isLoading = false;
    }
  };

  const register = function() {
    if (rootNode)
      throw new Error('register(): rootNode already set, cannot register component');


    rootNode = document.querySelector(refSelector);

    bus.when('app:isDoingSomeWork', show);
    bus.when('app:isDoneDoingSomeWork', hide);
  };

  return {
    show,
    hide,
    register
  }
};
