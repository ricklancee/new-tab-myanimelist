/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 12);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__providers_mal__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__mediator__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_string_to_html__ = __webpack_require__(9);
/* harmony export (immutable) */ __webpack_exports__["a"] = shell;




// Providers


// Utilities



const services = {
  toHtml: __WEBPACK_IMPORTED_MODULE_3_string_to_html__["a" /* default */],
  providers: {
    mal: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__providers_mal__["a" /* default */])()
  },
  storage: localStorage,
  bus: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__mediator__["a" /* default */])()
};

function shell(opts = { log: false }) {

  const info = window.console.info;
  const log = window.console.log;
  const warn = window.console.warn;

  window.console.info = (...args) => {
    if (opts.log === true || opts.log === 'INFO')
      return info(...args);
  };

  window.console.log = (...args) => {
    if (opts.log === true || opts.log === 'LOG')
      return log(...args);
  };

  window.console.warn = (...args) => {
    if (opts.log === true || opts.log === 'WARN')
      return warn(...args);
  };

  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */])(services);
};


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = actions;


function actions({bus, storage}, provider, user, list) {
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


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = card;


function card({ toHtml, bus }, refElement, anime) {
  let rootNode;

  let elements = {};

  const setState = function(newState) {
    return new Proxy(newState, {
      set(target, key, value) {
          const oldValue = target[key];

          target[key] = value;

          // copy the state
          const clone = Object.assign({}, target);

          bus.emit('card:changed', {state: clone, oldValue, newValue: value});

          return true;
        },
      });
  };

  const cardTemplate = function(anime) {
    const template = `
      <div class="card card--showTitleOnHover isStatus-${anime.status}" data-id="${anime.id}">
        <div class="card__title">
          <p data-ref="title">${ anime.title }</p>
        </div>
        <figure class="card__image-container">
          <a href="https://myanimelist.net/anime/${anime.id}" target="_blank" class="card__link">
            <img data-ref="image" src="${anime.image}" alt="${anime.title}">
          </a>
        </figure>
        <div class="card__controls">
          <button class="card__episode-button" data-ref="decrement">-</button>
          <div class="card__episode-count">
            <div>
              <input type="number" data-ref="input" class="episode-count__input" value="${anime.currentEpisode}">
              <span class="episode-count__title">Episodes seen:</span>
              <span class="episode-count__episodes"><span data-ref="currentEpisode">${anime.currentEpisode}</span>/<span data-ref="episodeCount">${anime.episodeCount ? anime.episodeCount : '??'}</span></span>
            </div>
          </div>
          <button class="card__episode-button" data-ref="increment">+</button>
        </div>
      </div>`;

    return toHtml(template);
  };

  const incrementEpisode = function() {
    if (state.currentEpisode === anime.episodeCount)
      return;

    state.currentEpisode = state.currentEpisode + 1;
    updateCard();

    bus.emit('anime:currentEpisodeChanged', { id: state.id, currentEpisode: state.currentEpisode });
  };

  const decrementEpisode = function() {
    if (state.currentEpisode === 0)
      return;

    state.currentEpisode = state.currentEpisode - 1;

    updateCard();
    bus.emit('anime:currentEpisodeChanged', { id: state.id, currentEpisode: state.currentEpisode });
  };

  const changeEpisode = function(event) {
    state.currentEpisode = parseInt(event.target.value);

    updateCard();
    bus.emit('anime:currentEpisodeChanged', { id: state.id, currentEpisode: state.currentEpisode });
  };

  const updateCard = function() {
    elements.input.value = state.currentEpisode;
    elements.currentEpisode.textContent = state.currentEpisode;
    elements.episodeCount.textContent = anime.episodeCount ? anime.episodeCount : '??';
    elements.image.src = state.image;
    elements.image.alt = state.title;
    elements.title.textContent = state.title;
  };

  const render = function() {
    if (refElement.firstElementChild) {
      refElement.firstElementChild.remove();
    }

    rootNode = cardTemplate(state);

    // Event listeners
    elements.currentEpisode = rootNode.querySelector('[data-ref="currentEpisode"]');
    elements.episodeCount = rootNode.querySelector('[data-ref="episodeCount"]');
    elements.input = rootNode.querySelector('[data-ref="input"]');
    elements.image = rootNode.querySelector('[data-ref="image"]');
    elements.title = rootNode.querySelector('[data-ref="title"]');

    rootNode.querySelector('[data-ref="increment"]').addEventListener('click', incrementEpisode);
    rootNode.querySelector('[data-ref="decrement"]').addEventListener('click', decrementEpisode);
    elements.input.addEventListener('change', changeEpisode);

    refElement.appendChild(rootNode);
  };

  const state = setState(anime);

  const updateState = function(newState) {
    Object.assign(state, newState);
  };

  // Whenever an anime:changed event is fire with the id of this card
  // update the state of the card.
  bus.when('anime:changed', { id: anime.id }, function(newState) {
    // Copy the newState's properties on the current state.
    updateState(newState);
    updateCard();
  });

  return {
    state,
    updateCard,
    render
  };
};


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = cardContainer;


function cardContainer(services, card, refSelector, list) {
  let rootNode = null;
  let data = list.slice();
  let renderedCards = [];
  let state = data;
  const loadLimit = 32;
  let containerHeight = 0;
  let windowHeight = window.innerHeight;

  const filters = {
    status: 'watching',
    season: 'all',
    year: 'all',
  };

  const seasons = {
    winter: 0, // Jan starts at 0
    spring: 3,
    summer: 6,
    fall: 9
  };

  const getSeasonByMonth = function(month) {
    const seasonsByIndex = Object.keys(seasons);
    let index = 0;

    console.log(month);

    for (let season in seasons) {
      if (month >= seasons[season] && month < seasons[seasonsByIndex[index + 1]])
        return season;
      index++;
    }
    return false;
  }

  // 1/watching, 2/completed, 3/onhold, 4/dropped, 6/plantowatch
  const watching = item => item.status === 1;
  const completed = item => item.status === 2;
  const onHold = item => item.status === 3;
  const dropped = item => item.status === 4;
  const planToWatch = item => item.status === 6;

  const winterSeason = item => (new Date(item.starts)).getMonth() == seasons.winter;
  const springSeason = item => (new Date(item.starts)).getMonth() == seasons.spring;
  const summerSeason = item => (new Date(item.starts)).getMonth() == seasons.summer;
  const fallSeason = item => (new Date(item.starts)).getMonth() == seasons.fall;

  // Event Listeners
  const handleLoadingOfNextStateOnScroll = function(event) {
    if (renderedCards.length >= state.length) {
      return;
    }

    const distance = containerHeight - (window.scrollY + windowHeight);

    if (distance < containerHeight / 2) {
      renderNextStatePartial();
    }
  };
  window.addEventListener('scroll', handleLoadingOfNextStateOnScroll, { passive: true });
  window.addEventListener('resize', () => { windowHeight = window.innerHeight }, { passive: true });

  const filter = function(status = 'watching', season = 'all', year = 'all') {
    filters.status = status;
    filters.season = season;
    filters.year = year;

    const sortedData = sortData(data);
    const filteredData = filterData(sortedData);
    state = filteredData;
  };

  const filterData = function(dataToFilter) {
    let filtered = dataToFilter.slice();

    switch(filters.status) {
      case 'watching':
        filtered = filtered.filter(watching);
        break;
      case 'completed':
        filtered = filtered.filter(completed);
        break;
      case 'onhold':
        filtered = filtered.filter(onHold);
        break;
      case 'dropped':
        filtered = filtered.filter(dropped);
        break;
      case 'plantowatch':
        filtered = filtered.filter(planToWatch);
        break;
      case 'all':
        filtered = filtered;
        break;
      default:
        throw new Error(`Unrecognized filter "${status}"`);
    }

    switch(filters.season) {
      case 'winter':
        filtered = filtered.filter(winterSeason);
        break;
      case 'spring':
        filtered = filtered.filter(springSeason);
        break;
      case 'summer':
        filtered = filtered.filter(summerSeason);
        break;
      case 'fall':
        filtered = filtered.filter(fallSeason);
        break;
      case 'all':
        filtered = filtered;
        break;
      default:
        throw new Error(`Unrecognized filter "${season}"`);
    }

    if (filters.year !== 'all') {
      filters.year = parseInt(filters.year, 10);
      filtered = filtered.filter(item => ( new Date(item.starts)).getFullYear() === filters.year);
    }

    return filtered;
  };

  const sortData = function(dataToSort) {
    const sortedByStatus = dataToSort.slice().sort((a, b) => {
      if (a.status > b.status) {
        return 1;
      }

      if (a.status < b.status) {
        return -1;
      }

      if (a.status === b.status) {
        return 0;
      }
    });

    const grouped = {};
    sortedByStatus.forEach(item => {
      if (!grouped[item.status]) {
        grouped[item.status] = [];
      }

      grouped[item.status].push(item);
    });

    let sorted = [];
    for (let prop in grouped) {
      grouped[prop].sort((a, b) => {
        const dateA = new Date(a.starts);
        const dateB = new Date(b.starts);

        if (dateA.getTime() < dateB.getTime())
          return 1;

        return -1;
      });

      sorted = sorted.concat(grouped[prop]);
    }

    return sorted;
  };

  const render = function() {
    // If there are any remove all cards from dom first
    if (renderedCards.length) {
      renderedCards.forEach(({node}) => node.remove());
    }

    // Clear the array
    renderedCards = [];

    if (!state.length) {
      rootNode.classList.add('isEmpty');
      console.warn('! nothing found... show empty state!');
      return;
    }
    rootNode.classList.remove('isEmpty');

    const stateToLoad = getStateToLoad();
    renderCardsToRootNode(stateToLoad);
    reCalcContainerHeight();
  };

  const renderNextStatePartial = function() {
    if (renderedCards.length >= state.length) {
      console.info('Completely rendered state to DOM.');
      return;
    }

    const stateToLoad = getStateToLoad();
    renderCardsToRootNode(stateToLoad);
    reCalcContainerHeight();
  };

  const renderCardsToRootNode = function(data) {
    data.forEach(anime => {
      const node = document.createElement('li');
      const animeCard = card(services, node, anime);
      animeCard.render();
      renderedCards.push({ instance: animeCard, id: animeCard.state.id, node});
    });

    // Append all cards to dom after creating the cards
    // this prevents a read, write, read, write cycle
    renderedCards.forEach(({node}) => rootNode.appendChild(node));
  };

  const getStateToLoad = function() {
    const loaded = renderedCards.length;
    const slicedState = state.slice(loaded, loaded + loadLimit);
    return slicedState;
  };

  const reCalcContainerHeight = function() {
    containerHeight = rootNode.offsetTop + rootNode.offsetHeight;
  };

  const updateState = function(newState) {
    console.info('updateState: Updating to new state.');
    data = newState.slice();

    const sortedData = sortData(data);
    const filteredData = filterData(sortedData);

    state = filteredData;
  };

  const register = function() {
    if (rootNode)
      throw new Error('register(): rootNode already set, cannot register component');

    rootNode = document.querySelector(refSelector);

    let status = 'watching';
    let season = 'all';
    let year = 'all';

    filter(status, season, year);

    // Container event handlers.
    const filterStatusElements = document.querySelectorAll('[data-filter-status]');
    const filterCurrentSeason = document.querySelector('[data-filter-season="current"]');
    const filterAllSeasons = document.querySelector('[data-filter-season="all"]');

    const now = new Date();
    const currentSeason = getSeasonByMonth(now.getMonth());
    const currentYear = now.getFullYear();

    filterCurrentSeason.setAttribute('data-season', currentSeason);
    filterCurrentSeason.setAttribute('data-year', currentYear);
    filterCurrentSeason.textContent = currentSeason.charAt(0).toUpperCase() +
      currentSeason.slice(1) + ' ' + currentYear;

    document.querySelector('[data-filter-status="'+ status +'"]').classList.add('active');
    filterAllSeasons.classList.add('active');
    const handleFilterCurrentSeasonClick = function(event) {
      filterAllSeasons.classList.remove('active');
      event.target.classList.add('active');

      season = currentSeason;
      year = currentYear;

      filter(status, season, year);
      render();
    };

    const handleFilterAllSeasonsClick = function(event) {
      filterCurrentSeason.classList.remove('active');
      event.target.classList.add('active');

      season = 'all';
      year = 'all';

      filter(status, season, year);
      render();
    };

    const handleFilterStatusClick = function(event) {
      status = event.target.getAttribute('data-filter-status');

      filterStatusElements.forEach(el => el.classList.remove('active'));
      event.target.classList.add('active');

      filter(status, season, year);
      render();
    };

    filterStatusElements.forEach(el => el.addEventListener('click', handleFilterStatusClick));
    filterCurrentSeason.addEventListener('click', handleFilterCurrentSeasonClick);
    filterAllSeasons.addEventListener('click', handleFilterAllSeasonsClick);

    render();
  };

  return {
    register,
    filter,
    state,
    updateState,
    render,
    renderNextStatePartial
  };
};


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = loader;


function loader({ bus }, refSelector) {
  let rootNode = null;
  let thingsDoingWork = 0;
  let isLoading = true;

  const show = function() {
    console.info('loader:show() show a loader');
    isLoading = true;
    thingsDoingWork++;
    rootNode.classList.add('isLoading');
  };

  const hide = function() {
    if (!isLoading)
      return;

    if (!-- thingsDoingWork) {
      console.info('loader:hide() all loaders done');
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


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = login;


function login({ storage, bus }, provider, refSelector) {
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
          console.info(`Successfully logged in user "${username}"`);

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


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = toast;


function toast({ bus }, refSelector) {
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


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__actions__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_card__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_cardContainer__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_loader__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_login__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_toast__ = __webpack_require__(6);
/* harmony export (immutable) */ __webpack_exports__["a"] = core;









async function core(services) {
  console.info('initialize with ', services);

  const provider = services.providers.mal;

  // Bootstrap the application
  console.info('initialize app...');
  const loginComponent = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__components_login__["a" /* default */])(services, provider, '[data-ref="login"]');
  loginComponent.register();

  const user = await loginComponent.loginOrPrompt();

  let list = [];
  const cachedList = services.storage.getItem(`app.${user.username}.list`);

  if (cachedList) {
    console.info('Using cached list...');
    list = JSON.parse(cachedList);
  }

  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__actions__["a" /* default */])(services, provider, user, list);

  // Register components.
  console.log('Registering components...');
  const toast = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__components_toast__["a" /* default */])(services, '[data-ref="toast"]');
  const appLoadIcon = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__components_loader__["a" /* default */])(services, '[data-ref="loader"]');
  const container = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__components_cardContainer__["a" /* default */])(services, __WEBPACK_IMPORTED_MODULE_1__components_card__["a" /* default */], '[data-ref="cardContainer"]', list);

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


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


const mediator = function mediator() {

  const channels = {};

  const matchesFilter = function(filter, match) {
    const keys = Object.keys(match);

    for (let key of keys) {
      if (match[key] !== filter[key] || !(key in filter)) {
        return false;
      }
    }

    return true;
  }

  return {
    when(channel, ...args) {
      if (!channels[channel]) {
        channels[channel] = [];
      }

      let handler, filter;

      if (args.length === 1) {
        handler = args[0];
        filter = null;
      }

      if (args.length === 2) {
        [filter, handler] = args;
      }

      channels[channel].push({ filter, handler });

      return this;
    },

    emit(channel, ...args) {
      if (!channels[channel]) {
        console.warn(`Emit: No handlers for event: "${channel}", args: `, ...args);
        return;
      }

      let payload, filter;

      if (args.length === 1) {
        payload = args[0];
        filter = null;
      }

      if (args.length === 2) {
        [filter, payload] = args;
      }

      console.info(`Emitting event: "${channel}" with payload:`, payload, ' and filter: ', filter);

      channels[channel].forEach(({handler, filter: toMatch}) => {
        if (!filter && toMatch) {
          console.warn(`Trying to emit an even on a channel that has a filter, requires filter: "${JSON.stringify(toMatch)}"`);
          return;
        }

        if (!filter || (toMatch && matchesFilter(filter, toMatch))) {
          handler(payload);
          return;
        }
      });

      return this;
    },

    delete(channel, handler=null) {
      if (!channels[channel]) {
        console.warn(`Delete: No handlers for channel "${channel}"`);
        return false;
      }

      if (!handler) {
        delete channels[channel];
        return this;
      }

      const index = channels[channel].findIndex(({handler: channelHandler}) => {
        if (channelHandler === handler) {
          return true;
        }

        return false;
      });

      if (index === -1) {
        return false;
      }

      channels[channel].splice(index, 1);

      return this;
    }
  };
};

/* harmony default export */ __webpack_exports__["a"] = mediator;


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = toHtml;


const contextRange = document.createRange();
contextRange.setStart(document.body, 0);

function toHtml(string) {
  return contextRange.createContextualFragment(string);
};


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


class MALjs {
    constructor(user, password) {
      if (!user || !password) {
        throw new Error('MALjs requires a myanimelist.net username and password.');
      }

      this._user = user;
      this._password = password;
      this._base = 'https://myanimelist.net';

      this._parser = new DOMParser();

      this.anime = {
        search: (query) => {
          return this.search(query, 'anime');
        },
        list: () => {
          return this.list('anime');
        },
        add: (id, data) => {
          return this.add(id, data, 'anime');
        },
        update: (id, data) => {
          return this.update(id, data, 'anime');
        },
        delete: (id, data) => {
          return this.delete(id, 'anime');
        }
      };

      this.manga = {
        search: (query) => {
          return this.search(query, 'manga');
        },
        list: () => {
          return this.list('manga');
        },
        add: (id, data) => {
          return this.add(id, data, 'manga');
        },
        update: (id, data) => {
          return this.update(id, data, 'manga');
        },
        delete: (id, data) => {
          return this.delete(id, 'manga');
        }
      };

    }

    search(query, type) {
      this._checkType(type);

      return this._get(`${this._base}/api/${type}/search.xml?q=${query}`);
    }

    list(type) {
      this._checkType(type);
      return this._get(`${this._base}/malappinfo.php?u=${this._user}&status=all&type=${type}`);
    }

    add(id, data, type) {
      this._checkType(type);

      if (!data) {
        return;
      }

      if (!data.entry) {
        data = {entry: data};
      }

      return this._post(`${this._base}/api/${type}list/add/${id}.xml`, data);
    }

    update(id, data, type) {
      this._checkType(type);

      if (!data) {
        return;
      }

      if (!data.entry) {
        data = {entry: data};
      }

      return this._post(`${this._base}/api/${type}list/update/${id}.xml`, data);
    }

    delete(id, type) {
      this._checkType(type);
      return this._post(`${this._base}/api/${type}list/delete/${id}.xml`);
    }

    verifyCredentials() {
      return this._get(`${this._base}/api/account/verify_credentials.xml`);
    }

    _checkType(type) {
      if (type !== 'anime' && type !== 'manga') {
        throw new Error('Only allowed types are anime and manga. incorrect type: '+type +' given.')
      }
    }

    _xmlToJson(xmlString) {
      return new Promise((resolve, reject) => {

        const dom = this._parser.parseFromString(xmlString, "text/xml");

        if (dom.documentElement.nodeName === "html") {
          reject('Failed to parse xml.');
        } else {
          resolve(this._domToJson(dom));
        }

      });
    }

    _domToJson(dom) {
      const nodes = dom.childNodes;
      const object = {};

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        if (node.nodeName === 'myanimelist') {
          object[node.nodeName] = {};
        } else {
          object[node.nodeName] = [];
        }


        const childNodes = node.childNodes;


        for (let i = 0; i < childNodes.length; i++) {
          const entryNode = childNodes[i];
          const entryObject = {};

          // Skip empty text nodes.
          if (entryNode.nodeName === '#text')
            continue;

          const items = entryNode.childNodes;

          for (let i = 0; i < items.length; i++) {
            const item = items[i];

            if (item.nodeName === '#text')
              continue;

            let value = item.innerHTML;

            if (item.nodeName === 'id' || item.nodeName === 'episodes') {
              value = parseInt(value, 10);
            }

            entryObject[item.nodeName] = value;
          }

          if (node.nodeName === 'myanimelist') {
            if (entryNode.nodeName === 'anime' || entryNode.nodeName === 'manga') {
              if (!object[node.nodeName][entryNode.nodeName]) {
                object[node.nodeName][entryNode.nodeName] = [];
              }
              object[node.nodeName][entryNode.nodeName].push(entryObject);
            } else {
              object[node.nodeName][entryNode.nodeName] = entryObject;
            }
          } else {
            object[node.nodeName].push(entryObject);
          }
        }
      }

      return object;
    }

    _toXml(object) {
      let xmlString = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`;

      function getProps(obj) {
        for (let property in obj) {
          if (obj.hasOwnProperty(property)){
            if (obj[property].constructor == Object) {
              xmlString += `<${property}>`;
              getProps(obj[property]);
              xmlString += `</${property}>`;
            } else {
              xmlString += `<${property}>${obj[property]}</${property}>`;
            }
          }
        }
      }

      getProps(object);

      return xmlString;
    }

    _get(url) {
      return new Promise((resolve, reject) => {
        this._getForBrowser(url, resolve, reject);
      });
    }

    _getForBrowser(url, resolve, reject) {
      var req = new XMLHttpRequest();
      req.open('GET', url, true, this._user, this._password);
      req.onload = () => {
        if (req.status === 200) {
          const data = req.response;

          // Covert the xml string to json
          this._xmlToJson(data)
            .then(resolve)
            .catch(reject);

        } else {
          reject(`Request failed: called url "${url}", with user "${this._user}" and password "${this._password}"`);
        }
      };

      req.onerror = () => {
        reject(`Request failed: called url "${url}", with user "${this._user}" and password "${this._password}"`);
      };

      req.send();
    }

    _post(url, data=null) {
      return new Promise((resolve, reject) => {
        this._postForBrowser(url, data, resolve, reject);
      });
    }

    _postForBrowser(url, data, resolve, reject) {
      var req = new XMLHttpRequest();
      req.open('POST', url, true, this._user, this._password);
      req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

      req.onload = function() {
        if (req.status === 200 || req.status === 201) {
          resolve(req.response);
        } else {
          reject(req.response);
        }
      };

      req.onerror = function() {
        reject(`Request failed: Called url "${url}", with user "${this._user}" and password "${this._password}". Data passed: "${JSON.stringify(data, null, 2)}"`);
      };

      if (data) {
        var xml = this._toXml(data);
        req.send('data='+xml);
      } else {
        req.send();
      }
    }
  }
/* harmony export (immutable) */ __webpack_exports__["a"] = MALjs;
;


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mal_api__ = __webpack_require__(10);
/* harmony export (immutable) */ __webpack_exports__["a"] = mal;




function mal() {
  let api;

  return {
    setCredentials: function (username, password) {
      api = new __WEBPACK_IMPORTED_MODULE_0__mal_api__["a" /* default */](username, password);
    },

    authenticate: (username, password) => {
      api = new __WEBPACK_IMPORTED_MODULE_0__mal_api__["a" /* default */](username, password);
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


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shell__ = __webpack_require__(0);




__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__shell__["a" /* default */])({
  log: false
});


/***/ })
/******/ ]);