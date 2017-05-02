'use strict';

const bestGirls = [
  'Bot-chan is best girl',
  'your waifu is shit',
  'Yui is best girl',
  'Megumin is best girl',
  'Misaka is best girl',
  'Koko is best girl',
  'Utaha is best girl',
  'Mugi is best girl',
  'Kikko is best girl',
  'Tohsaka is best girl'
];

export default function login({ storage, bus }, provider, refSelector) {
  let rootNode = null;
  let loginForm = null;
  let errorElement = null;
  let logoutLink = null;
  let loginSuccessResolver = null;

  const logout = function() {
    const user = storage.removeItem('app.user');
    window.location.reload();
  };

  const loginOrPrompt = function() {
    const user = storage.getItem('app.user');

    return new Promise((resolve, reject) => {
      loginSuccessResolver = resolve;

      if (!user) {
        showLoginPrompt();
        return;
      }

      const userObject = JSON.parse(user);
      provider.setCredentials(userObject.username, userObject.password);
      loginSuccessResolver(userObject);
    });
  }

  const showLoginPrompt = function() {
    document.body.classList.add('hasOverlay');
    rootNode.classList.add('isShown');
  };

  const hideLoginPrompt = function() {
    document.body.classList.remove('hasOverlay');
    rootNode.classList.remove('isShown');
  };

  const handleLoginFormSubmit = function(event) {
    event.preventDefault();
    hideError();

    const formData = new FormData(event.target);
    const username = formData.get('username');
    const password = formData.get('password');

    if(!username.trim() || !password.trim()) {
      showError();
      return;
    }

    rootNode.classList.add('isLoading');

    provider.authenticate(username, password)
      .then(result => {
        rootNode.classList.remove('isLoading');

        if (result.user) {
          log.info(`Successfully logged in user "${username}"`);

          hideLoginPrompt();

          storage.setItem('app.user', JSON.stringify({ username, password }));

          if (loginSuccessResolver)
            loginSuccessResolver({username, password});

          bus.emit('app:userLoggedIn', { username, password });
        } else {
          showError();
        }
      })
      .catch(err => {
        rootNode.classList.remove('isLoading');
        showError();
      });
  };

  const showError = function() {
    errorElement.classList.add('isShown');
  };

  const hideError = function() {
    errorElement.classList.remove('isShown');
  };

  const handleLogoutClick = function(event) {
    event.preventDefault();
    logout();
  };

  const register = function() {
    if (rootNode)
      throw new Error('register(): rootNode already set, cannot register component');

    rootNode = document.querySelector(refSelector);
    errorElement = rootNode.querySelector('[data-ref="error"]');
    loginForm = rootNode.querySelector('form');
    logoutLink = document.querySelector('[data-ref="logout"]');

    rootNode.querySelector('input[type="password"]').setAttribute('placeholder',
      bestGirls[Math.floor(Math.random() * bestGirls.length)]);

    loginForm.addEventListener('submit', handleLoginFormSubmit);
    logoutLink.addEventListener('click', handleLogoutClick);
  };

  return {
    register,
    showLoginPrompt,
    hideLoginPrompt,
    loginOrPrompt
  }
};
