'use strict';

export default function toast({ bus }, refSelector) {
  let rootNode = null;
  let messageNode = null;
  let controlsNode = null;
  let resolveAction = null;

  const show = function(message, buttons = [], timeout = false) {
    return new Promise(resolve => {
      resolveAction = resolve;
      messageNode.textContent = message;

      // Remove any buttons
      if(controlsNode.childNodes.length) {
        controlsNode.childNodes.forEach(node => node.remove());
      }

      buttons.forEach(action => {
        const buttonNode = document.createElement('button');
        buttonNode.textContent = action;
        controlsNode.appendChild(buttonNode);

        const actionResolver = () => {
          resolveAction(action);
          resolveAction = null;
          buttonNode.removeEventListener('click', actionResolver);
          hide();
        };

        buttonNode.addEventListener('click', actionResolver);
      });

      if (timeout) {
        setTimeout(hide, timeout === true ? 2000 : timeout);
      }

      rootNode.classList.add('isShown');
    });
  };

  const hide = function() {
    rootNode.classList.remove('isShown');

    if (resolveAction) {
      resolveAction(null);
      resolveAction = null;
    }
  };

  const register = function() {
    if (rootNode)
      throw new Error('register(): rootNode already set, cannot register component');

    rootNode = document.querySelector(refSelector);
    messageNode = rootNode.querySelector('p');
    controlsNode = rootNode.querySelector('.toast__controls');
  };

  return {
    register,
    show
  };
};
