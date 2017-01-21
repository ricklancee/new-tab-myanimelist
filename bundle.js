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
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = shell;

var _core = __webpack_require__(7);

var _core2 = _interopRequireDefault(_core);

var _mal = __webpack_require__(10);

var _mal2 = _interopRequireDefault(_mal);

var _mediator = __webpack_require__(8);

var _mediator2 = _interopRequireDefault(_mediator);

var _stringToHtml = __webpack_require__(11);

var _stringToHtml2 = _interopRequireDefault(_stringToHtml);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Utilities
var services = {
  toHtml: _stringToHtml2.default,
  providers: {
    mal: (0, _mal2.default)()
  },
  storage: localStorage,
  bus: (0, _mediator2.default)()
};

// Providers
function shell() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { log: false };


  var info = window.console.info;
  var log = window.console.log;
  var warn = window.console.warn;

  window.console.info = function () {
    if (opts.log === true || opts.log === 'INFO') return info.apply(undefined, arguments);
  };

  window.console.log = function () {
    if (opts.log === true || opts.log === 'LOG') return log.apply(undefined, arguments);
  };

  window.console.warn = function () {
    if (opts.log === true || opts.log === 'WARN') return warn.apply(undefined, arguments);
  };

  return (0, _core2.default)(services);
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = actions;
function actions(_ref, provider, user, list) {
  var bus = _ref.bus,
      storage = _ref.storage;

  var changes = {};

  var queue = {};
  var queuePop = function queuePop(channel, cb) {
    if (!queue[channel]) queue[channel] = {};

    clearTimeout(queue[channel].timeout);
    queue[channel].timeout = setTimeout(cb, 200);
  };

  bus.when('card:changed', function (cardState) {
    // console.info('A card changed:', cardState);
  });

  bus.when('anime:currentEpisodeChanged', function (data) {
    console.info('Episode count changed:', data);

    queuePop('updateEpisodeCount', function () {
      bus.emit('app:isDoingSomeWork');

      // const currentCache = storage.getItem('app.list');
      var newCache = JSON.stringify(list);

      storage.setItem('app.' + user.username + '.list', newCache);

      provider.updateEpisodeCount(data.id, data.currentEpisode).then(function (_) {
        bus.emit('app:isDoneDoingSomeWork');

        // if failed revert cache, check with timestamps? which ever is newer?
      });
    });
  });
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = card;
function card(_ref, refElement, anime) {
  var toHtml = _ref.toHtml,
      bus = _ref.bus;

  var rootNode = void 0;

  var elements = {};

  var setState = function setState(newState) {
    return new Proxy(newState, {
      set: function set(target, key, value) {
        var oldValue = target[key];

        target[key] = value;

        // copy the state
        var clone = Object.assign({}, target);

        bus.emit('card:changed', { state: clone, oldValue: oldValue, newValue: value });

        return true;
      }
    });
  };

  var cardTemplate = function cardTemplate(anime) {
    var template = '\n      <div class="card card--showTitleOnHover isStatus-' + anime.status + '" data-id="' + anime.id + '">\n        <div class="card__title">\n          <p data-ref="title">' + anime.title + '</p>\n        </div>\n        <figure class="card__image-container">\n          <a href="https://myanimelist.net/anime/' + anime.id + '" target="_blank" class="card__link">\n            <img data-ref="image" src="' + anime.image + '" alt="' + anime.title + '">\n          </a>\n        </figure>\n        <div class="card__controls">\n          <button class="card__episode-button" data-ref="decrement">-</button>\n          <div class="card__episode-count">\n            <div>\n              <input type="number" data-ref="input" class="episode-count__input" value="' + anime.currentEpisode + '">\n              <span class="episode-count__title">Episodes seen:</span>\n              <span class="episode-count__episodes"><span data-ref="currentEpisode">' + anime.currentEpisode + '</span>/<span data-ref="episodeCount">' + (anime.episodeCount ? anime.episodeCount : '??') + '</span></span>\n            </div>\n          </div>\n          <button class="card__episode-button" data-ref="increment">+</button>\n        </div>\n      </div>';

    return toHtml(template);
  };

  var incrementEpisode = function incrementEpisode() {
    if (state.currentEpisode === anime.episodeCount) return;

    state.currentEpisode = state.currentEpisode + 1;
    updateCard();

    bus.emit('anime:currentEpisodeChanged', { id: state.id, currentEpisode: state.currentEpisode });
  };

  var decrementEpisode = function decrementEpisode() {
    if (state.currentEpisode === 0) return;

    state.currentEpisode = state.currentEpisode - 1;

    updateCard();
    bus.emit('anime:currentEpisodeChanged', { id: state.id, currentEpisode: state.currentEpisode });
  };

  var changeEpisode = function changeEpisode(event) {
    state.currentEpisode = parseInt(event.target.value);

    updateCard();
    bus.emit('anime:currentEpisodeChanged', { id: state.id, currentEpisode: state.currentEpisode });
  };

  var updateCard = function updateCard() {
    elements.input.value = state.currentEpisode;
    elements.currentEpisode.textContent = state.currentEpisode;
    elements.episodeCount.textContent = anime.episodeCount ? anime.episodeCount : '??';
    elements.image.src = state.image;
    elements.image.alt = state.title;
    elements.title.textContent = state.title;
  };

  var render = function render() {
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

  var state = setState(anime);

  var updateState = function updateState(newState) {
    Object.assign(state, newState);
  };

  // Whenever an anime:changed event is fire with the id of this card
  // update the state of the card.
  bus.when('anime:changed', { id: anime.id }, function (newState) {
    // Copy the newState's properties on the current state.
    updateState(newState);
    updateCard();
  });

  return {
    state: state,
    updateCard: updateCard,
    render: render
  };
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = cardContainer;
function cardContainer(services, card, refSelector, list) {
  var rootNode = null;
  var data = list.slice();
  var renderedCards = [];
  var state = data;
  var loadLimit = 32;
  var containerHeight = 0;
  var windowHeight = window.innerHeight;

  var filters = {
    status: 'watching',
    season: 'all',
    year: 'all'
  };

  var seasons = {
    winter: 0, // Jan starts at 0
    spring: 3,
    summer: 6,
    fall: 9
  };

  var getSeasonByMonth = function getSeasonByMonth(month) {
    var seasonsByIndex = Object.keys(seasons);
    var index = 0;

    console.log(month);

    for (var _season in seasons) {
      if (month >= seasons[_season] && month < seasons[seasonsByIndex[index + 1]]) return _season;
      index++;
    }
    return false;
  };

  // 1/watching, 2/completed, 3/onhold, 4/dropped, 6/plantowatch
  var watching = function watching(item) {
    return item.status === 1;
  };
  var completed = function completed(item) {
    return item.status === 2;
  };
  var onHold = function onHold(item) {
    return item.status === 3;
  };
  var dropped = function dropped(item) {
    return item.status === 4;
  };
  var planToWatch = function planToWatch(item) {
    return item.status === 6;
  };

  var winterSeason = function winterSeason(item) {
    return new Date(item.starts).getMonth() == seasons.winter;
  };
  var springSeason = function springSeason(item) {
    return new Date(item.starts).getMonth() == seasons.spring;
  };
  var summerSeason = function summerSeason(item) {
    return new Date(item.starts).getMonth() == seasons.summer;
  };
  var fallSeason = function fallSeason(item) {
    return new Date(item.starts).getMonth() == seasons.fall;
  };

  // Event Listeners
  var handleLoadingOfNextStateOnScroll = function handleLoadingOfNextStateOnScroll(event) {
    if (renderedCards.length >= state.length) {
      return;
    }

    var distance = containerHeight - (window.scrollY + windowHeight);

    if (distance < containerHeight / 2) {
      renderNextStatePartial();
    }
  };

  var filter = function filter() {
    var status = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'watching';
    var season = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'all';
    var year = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'all';

    filters.status = status;
    filters.season = season;
    filters.year = year;

    var sortedData = sortData(data);
    var filteredData = filterData(sortedData);
    state = filteredData;
  };

  var filterData = function filterData(dataToFilter) {
    var filtered = dataToFilter.slice();

    switch (filters.status) {
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
        throw new Error('Unrecognized filter "' + status + '"');
    }

    switch (filters.season) {
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
        throw new Error('Unrecognized filter "' + season + '"');
    }

    if (filters.year !== 'all') {
      filters.year = parseInt(filters.year, 10);
      filtered = filtered.filter(function (item) {
        return new Date(item.starts).getFullYear() === filters.year;
      });
    }

    return filtered;
  };

  var sortData = function sortData(dataToSort) {
    var sortedByStatus = dataToSort.slice().sort(function (a, b) {
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

    var grouped = {};
    sortedByStatus.forEach(function (item) {
      if (!grouped[item.status]) {
        grouped[item.status] = [];
      }

      grouped[item.status].push(item);
    });

    var sorted = [];
    for (var prop in grouped) {
      grouped[prop].sort(function (a, b) {
        var dateA = new Date(a.starts);
        var dateB = new Date(b.starts);

        if (dateA.getTime() < dateB.getTime()) return 1;

        return -1;
      });

      sorted = sorted.concat(grouped[prop]);
    }

    return sorted;
  };

  var render = function render() {
    // If there are any remove all cards from dom first
    if (renderedCards.length) {
      renderedCards.forEach(function (_ref) {
        var node = _ref.node;
        return node.remove();
      });
    }

    // Clear the array
    renderedCards = [];

    if (!state.length) {
      rootNode.classList.add('isEmpty');
      console.warn('! nothing found... show empty state!');
      return;
    }
    rootNode.classList.remove('isEmpty');

    var stateToLoad = getStateToLoad();
    renderCardsToRootNode(stateToLoad);
    reCalcContainerHeight();
  };

  var renderNextStatePartial = function renderNextStatePartial() {
    if (renderedCards.length >= state.length) {
      console.info('Completely rendered state to DOM.');
      return;
    }

    var stateToLoad = getStateToLoad();
    renderCardsToRootNode(stateToLoad);
    reCalcContainerHeight();
  };

  var renderCardsToRootNode = function renderCardsToRootNode(data) {
    data.forEach(function (anime) {
      var node = document.createElement('li');
      var animeCard = card(services, node, anime);
      animeCard.render();
      renderedCards.push({ instance: animeCard, id: animeCard.state.id, node: node });
    });

    // Append all cards to dom after creating the cards
    // this prevents a read, write, read, write cycle
    renderedCards.forEach(function (_ref2) {
      var node = _ref2.node;
      return rootNode.appendChild(node);
    });
  };

  var getStateToLoad = function getStateToLoad() {
    var loaded = renderedCards.length;
    var slicedState = state.slice(loaded, loaded + loadLimit);
    return slicedState;
  };

  var reCalcContainerHeight = function reCalcContainerHeight() {
    containerHeight = rootNode.offsetTop + rootNode.offsetHeight;
  };

  var updateState = function updateState(newState) {
    console.info('updateState: Updating to new state.');
    data = newState.slice();

    var sortedData = sortData(data);
    var filteredData = filterData(sortedData);

    state = filteredData;
  };

  var register = function register() {
    if (rootNode) throw new Error('register(): rootNode already set, cannot register component');

    rootNode = document.querySelector(refSelector);

    window.addEventListener('scroll', handleLoadingOfNextStateOnScroll, { passive: true });
    window.addEventListener('resize', function () {
      windowHeight = window.innerHeight;
    }, { passive: true });

    var status = 'watching';
    var season = 'all';
    var year = 'all';

    filter(status, season, year);

    // Container event handlers.
    var filterStatusElements = document.querySelectorAll('[data-filter-status]');
    var filterCurrentSeason = document.querySelector('[data-filter-season="current"]');
    var filterAllSeasons = document.querySelector('[data-filter-season="all"]');

    var now = new Date();
    var currentSeason = getSeasonByMonth(now.getMonth());
    var currentYear = now.getFullYear();

    filterCurrentSeason.setAttribute('data-season', currentSeason);
    filterCurrentSeason.setAttribute('data-year', currentYear);
    filterCurrentSeason.textContent = currentSeason.charAt(0).toUpperCase() + currentSeason.slice(1) + ' ' + currentYear;

    document.querySelector('[data-filter-status="' + status + '"]').classList.add('active');
    filterAllSeasons.classList.add('active');
    var handleFilterCurrentSeasonClick = function handleFilterCurrentSeasonClick(event) {
      filterAllSeasons.classList.remove('active');
      event.target.classList.add('active');

      season = currentSeason;
      year = currentYear;

      filter(status, season, year);
      render();
    };

    var handleFilterAllSeasonsClick = function handleFilterAllSeasonsClick(event) {
      filterCurrentSeason.classList.remove('active');
      event.target.classList.add('active');

      season = 'all';
      year = 'all';

      filter(status, season, year);
      render();
    };

    var handleFilterStatusClick = function handleFilterStatusClick(event) {
      status = event.target.getAttribute('data-filter-status');

      filterStatusElements.forEach(function (el) {
        return el.classList.remove('active');
      });
      event.target.classList.add('active');

      filter(status, season, year);
      render();
    };

    filterStatusElements.forEach(function (el) {
      return el.addEventListener('click', handleFilterStatusClick);
    });
    filterCurrentSeason.addEventListener('click', handleFilterCurrentSeasonClick);
    filterAllSeasons.addEventListener('click', handleFilterAllSeasonsClick);

    render();
  };

  return {
    register: register,
    filter: filter,
    state: state,
    updateState: updateState,
    render: render,
    renderNextStatePartial: renderNextStatePartial
  };
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loader;
function loader(_ref, refSelector) {
  var bus = _ref.bus;

  var rootNode = null;
  var thingsDoingWork = 0;
  var isLoading = true;

  var show = function show() {
    console.info('loader:show() show a loader');
    isLoading = true;
    thingsDoingWork++;
    rootNode.classList.add('isLoading');
  };

  var hide = function hide() {
    if (!isLoading) return;

    if (! --thingsDoingWork) {
      console.info('loader:hide() all loaders done');
      rootNode.classList.remove('isLoading');
      isLoading = false;
    }
  };

  var register = function register() {
    if (rootNode) throw new Error('register(): rootNode already set, cannot register component');

    rootNode = document.querySelector(refSelector);

    bus.when('app:isDoingSomeWork', show);
    bus.when('app:isDoneDoingSomeWork', hide);
  };

  return {
    show: show,
    hide: hide,
    register: register
  };
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = login;
function login(_ref, provider, refSelector) {
  var storage = _ref.storage,
      bus = _ref.bus;

  var rootNode = null;
  var loginForm = null;
  var errorElement = null;
  var logoutLink = null;
  var loginSuccessResolver = null;

  var logout = function logout() {
    var user = storage.removeItem('app.user');
    window.location.reload();
  };

  var loginOrPrompt = function loginOrPrompt() {
    var user = storage.getItem('app.user');

    return new Promise(function (resolve, reject) {
      loginSuccessResolver = resolve;

      if (!user) {
        showLoginPrompt();
        return;
      }

      var userObject = JSON.parse(user);
      provider.setCredentials(userObject.username, userObject.password);
      loginSuccessResolver(userObject);
    });
  };

  var showLoginPrompt = function showLoginPrompt() {
    document.body.classList.add('hasOverlay');
    rootNode.classList.add('isShown');
  };

  var hideLoginPrompt = function hideLoginPrompt() {
    document.body.classList.remove('hasOverlay');
    rootNode.classList.remove('isShown');
  };

  var handleLoginFormSubmit = function handleLoginFormSubmit(event) {
    event.preventDefault();
    hideError();

    var formData = new FormData(event.target);
    var username = formData.get('username');
    var password = formData.get('password');

    if (!username.trim() || !password.trim()) {
      showError();
      return;
    }

    rootNode.classList.add('isLoading');

    provider.authenticate(username, password).then(function (result) {
      rootNode.classList.remove('isLoading');

      if (result.user) {
        console.info('Successfully logged in user "' + username + '"');

        hideLoginPrompt();

        storage.setItem('app.user', JSON.stringify({ username: username, password: password }));

        if (loginSuccessResolver) loginSuccessResolver({ username: username, password: password });

        bus.emit('app:userLoggedIn', { username: username, password: password });
      } else {
        showError();
      }
    }).catch(function (err) {
      rootNode.classList.remove('isLoading');
      showError();
    });
  };

  var showError = function showError() {
    errorElement.classList.add('isShown');
  };

  var hideError = function hideError() {
    errorElement.classList.remove('isShown');
  };

  var handleLogoutClick = function handleLogoutClick(event) {
    event.preventDefault();
    logout();
  };

  var register = function register() {
    if (rootNode) throw new Error('register(): rootNode already set, cannot register component');

    rootNode = document.querySelector(refSelector);
    errorElement = rootNode.querySelector('[data-ref="error"]');
    loginForm = rootNode.querySelector('form');
    logoutLink = document.querySelector('[data-ref="logout"]');

    loginForm.addEventListener('submit', handleLoginFormSubmit);
    logoutLink.addEventListener('click', handleLogoutClick);
  };

  return {
    register: register,
    showLoginPrompt: showLoginPrompt,
    hideLoginPrompt: hideLoginPrompt,
    loginOrPrompt: loginOrPrompt
  };
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toast;
function toast(_ref, refSelector) {
  var bus = _ref.bus;

  var rootNode = null;
  var messageNode = null;
  var controlsNode = null;
  var resolveAction = null;

  var show = function show(message) {
    var buttons = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    return new Promise(function (resolve) {
      resolveAction = resolve;
      messageNode.textContent = message;

      // Remove any buttons
      if (controlsNode.childNodes.length) {
        controlsNode.childNodes.forEach(function (node) {
          return node.remove();
        });
      }

      buttons.forEach(function (action) {
        var buttonNode = document.createElement('button');
        buttonNode.textContent = action;
        controlsNode.appendChild(buttonNode);

        var actionResolver = function actionResolver() {
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

  var hide = function hide() {
    rootNode.classList.remove('isShown');

    if (resolveAction) {
      resolveAction(null);
      resolveAction = null;
    }
  };

  var register = function register() {
    if (rootNode) throw new Error('register(): rootNode already set, cannot register component');

    rootNode = document.querySelector(refSelector);
    messageNode = rootNode.querySelector('p');
    controlsNode = rootNode.querySelector('.toast__controls');
  };

  return {
    register: register,
    show: show
  };
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = core;

var _actions = __webpack_require__(1);

var _actions2 = _interopRequireDefault(_actions);

var _card = __webpack_require__(2);

var _card2 = _interopRequireDefault(_card);

var _cardContainer = __webpack_require__(3);

var _cardContainer2 = _interopRequireDefault(_cardContainer);

var _loader = __webpack_require__(4);

var _loader2 = _interopRequireDefault(_loader);

var _login = __webpack_require__(5);

var _login2 = _interopRequireDefault(_login);

var _toast = __webpack_require__(6);

var _toast2 = _interopRequireDefault(_toast);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function core(services) {
  console.info('initialize with ', services);

  var provider = services.providers.mal;

  // Bootstrap the application
  console.info('initialize app...');
  var loginComponent = (0, _login2.default)(services, provider, '[data-ref="login"]');
  loginComponent.register();

  // Login remebered user or prompt a login, when done render the lists.
  loginComponent.loginOrPrompt().then(function (user) {
    var list = [];
    var cachedList = services.storage.getItem('app.' + user.username + '.list');

    if (cachedList) {
      console.info('Using cached list...');
      list = JSON.parse(cachedList);
    }

    (0, _actions2.default)(services, provider, user, list);

    // Register components.
    console.log('Registering components...');
    var toast = (0, _toast2.default)(services, '[data-ref="toast"]');
    var appLoadIcon = (0, _loader2.default)(services, '[data-ref="loader"]');
    var container = (0, _cardContainer2.default)(services, _card2.default, '[data-ref="cardContainer"]', list);

    // Bootstrap components
    appLoadIcon.register();
    container.register();
    toast.register();

    services.bus.emit('app:isDoingSomeWork');
    provider.list.get().then(function (data) {
      console.info('Fetched list from provider.');

      services.bus.emit('app:isDoneDoingSomeWork');

      // Update the container state list only if there are changes
      var json = JSON.stringify(data);

      if (!cachedList) {
        console.info('Updating list from empty cache');
        services.storage.setItem('app.' + user.username + '.list', json);
        container.updateState(data);
        container.render();
      } else if (cachedList !== json) {
        console.info('List updated, resetting cache with new list');
        services.storage.setItem('app.' + user.username + '.list', json);
        container.updateState(data);
        container.render();
        toast.show('Your list on MAL was updated, changes are reflected here.', [], 3000);
      } else {
        console.info('List the same, using cached list');
      }
    }).catch(function (err) {
      services.bus.emit('app:isDoneDoingSomeWork');
      toast.show('Failed to retrieve list from MAL. See console for errors', [], 3000);
      console.error(err);
    });
  });
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var mediator = function mediator() {

  var channels = {};

  var matchesFilter = function matchesFilter(filter, match) {
    var keys = Object.keys(match);

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var key = _step.value;

        if (match[key] !== filter[key] || !(key in filter)) {
          return false;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return true;
  };

  return {
    when: function when(channel) {
      if (!channels[channel]) {
        channels[channel] = [];
      }

      var handler = void 0,
          filter = void 0;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (args.length === 1) {
        handler = args[0];
        filter = null;
      }

      if (args.length === 2) {
        filter = args[0];
        handler = args[1];
      }

      channels[channel].push({ filter: filter, handler: handler });

      return this;
    },
    emit: function emit(channel) {
      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      if (!channels[channel]) {
        var _console;

        (_console = console).warn.apply(_console, ["Emit: No handlers for event: \"" + channel + "\", args: "].concat(args));
        return;
      }

      var payload = void 0,
          filter = void 0;

      if (args.length === 1) {
        payload = args[0];
        filter = null;
      }

      if (args.length === 2) {
        filter = args[0];
        payload = args[1];
      }

      console.info("Emitting event: \"" + channel + "\" with payload:", payload, ' and filter: ', filter);

      channels[channel].forEach(function (_ref) {
        var handler = _ref.handler,
            toMatch = _ref.filter;

        if (!filter && toMatch) {
          console.warn("Trying to emit an even on a channel that has a filter, requires filter: \"" + JSON.stringify(toMatch) + "\"");
          return;
        }

        if (!filter || toMatch && matchesFilter(filter, toMatch)) {
          handler(payload);
          return;
        }
      });

      return this;
    },
    delete: function _delete(channel) {
      var handler = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (!channels[channel]) {
        console.warn("Delete: No handlers for channel \"" + channel + "\"");
        return false;
      }

      if (!handler) {
        delete channels[channel];
        return this;
      }

      var index = channels[channel].findIndex(function (_ref2) {
        var channelHandler = _ref2.handler;

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

exports.default = mediator;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MALjs = function () {
  function MALjs(user, password) {
    var _this = this;

    _classCallCheck(this, MALjs);

    if (!user || !password) {
      throw new Error('MALjs requires a myanimelist.net username and password.');
    }

    this._user = user;
    this._password = password;
    this._base = 'https://myanimelist.net';

    this._parser = new DOMParser();

    this.anime = {
      search: function search(query) {
        return _this.search(query, 'anime');
      },
      list: function list() {
        return _this.list('anime');
      },
      add: function add(id, data) {
        return _this.add(id, data, 'anime');
      },
      update: function update(id, data) {
        return _this.update(id, data, 'anime');
      },
      delete: function _delete(id, data) {
        return _this.delete(id, 'anime');
      }
    };

    this.manga = {
      search: function search(query) {
        return _this.search(query, 'manga');
      },
      list: function list() {
        return _this.list('manga');
      },
      add: function add(id, data) {
        return _this.add(id, data, 'manga');
      },
      update: function update(id, data) {
        return _this.update(id, data, 'manga');
      },
      delete: function _delete(id, data) {
        return _this.delete(id, 'manga');
      }
    };
  }

  _createClass(MALjs, [{
    key: 'search',
    value: function search(query, type) {
      this._checkType(type);

      return this._get(this._base + '/api/' + type + '/search.xml?q=' + query);
    }
  }, {
    key: 'list',
    value: function list(type) {
      this._checkType(type);
      return this._get(this._base + '/malappinfo.php?u=' + this._user + '&status=all&type=' + type);
    }
  }, {
    key: 'add',
    value: function add(id, data, type) {
      this._checkType(type);

      if (!data) {
        return;
      }

      if (!data.entry) {
        data = { entry: data };
      }

      return this._post(this._base + '/api/' + type + 'list/add/' + id + '.xml', data);
    }
  }, {
    key: 'update',
    value: function update(id, data, type) {
      this._checkType(type);

      if (!data) {
        return;
      }

      if (!data.entry) {
        data = { entry: data };
      }

      return this._post(this._base + '/api/' + type + 'list/update/' + id + '.xml', data);
    }
  }, {
    key: 'delete',
    value: function _delete(id, type) {
      this._checkType(type);
      return this._post(this._base + '/api/' + type + 'list/delete/' + id + '.xml');
    }
  }, {
    key: 'verifyCredentials',
    value: function verifyCredentials() {
      return this._get(this._base + '/api/account/verify_credentials.xml');
    }
  }, {
    key: '_checkType',
    value: function _checkType(type) {
      if (type !== 'anime' && type !== 'manga') {
        throw new Error('Only allowed types are anime and manga. incorrect type: ' + type + ' given.');
      }
    }
  }, {
    key: '_xmlToJson',
    value: function _xmlToJson(xmlString) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {

        var dom = _this2._parser.parseFromString(xmlString, "text/xml");

        if (dom.documentElement.nodeName === "html") {
          reject('Failed to parse xml.');
        } else {
          resolve(_this2._domToJson(dom));
        }
      });
    }
  }, {
    key: '_domToJson',
    value: function _domToJson(dom) {
      var nodes = dom.childNodes;
      var object = {};

      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];

        if (node.nodeName === 'myanimelist') {
          object[node.nodeName] = {};
        } else {
          object[node.nodeName] = [];
        }

        var childNodes = node.childNodes;

        for (var _i = 0; _i < childNodes.length; _i++) {
          var entryNode = childNodes[_i];
          var entryObject = {};

          // Skip empty text nodes.
          if (entryNode.nodeName === '#text') continue;

          var items = entryNode.childNodes;

          for (var _i2 = 0; _i2 < items.length; _i2++) {
            var item = items[_i2];

            if (item.nodeName === '#text') continue;

            var value = item.innerHTML;

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
  }, {
    key: '_toXml',
    value: function _toXml(object) {
      var xmlString = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';

      function getProps(obj) {
        for (var property in obj) {
          if (obj.hasOwnProperty(property)) {
            if (obj[property].constructor == Object) {
              xmlString += '<' + property + '>';
              getProps(obj[property]);
              xmlString += '</' + property + '>';
            } else {
              xmlString += '<' + property + '>' + obj[property] + '</' + property + '>';
            }
          }
        }
      }

      getProps(object);

      return xmlString;
    }
  }, {
    key: '_get',
    value: function _get(url) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        _this3._getForBrowser(url, resolve, reject);
      });
    }
  }, {
    key: '_getForBrowser',
    value: function _getForBrowser(url, resolve, reject) {
      var _this4 = this;

      var req = new XMLHttpRequest();
      req.open('GET', url, true, this._user, this._password);
      req.onload = function () {
        if (req.status === 200) {
          var data = req.response;

          // Covert the xml string to json
          _this4._xmlToJson(data).then(resolve).catch(reject);
        } else {
          reject('Request failed: called url "' + url + '", with user "' + _this4._user + '" and password "' + _this4._password + '"');
        }
      };

      req.onerror = function () {
        reject('Request failed: called url "' + url + '", with user "' + _this4._user + '" and password "' + _this4._password + '"');
      };

      req.send();
    }
  }, {
    key: '_post',
    value: function _post(url) {
      var _this5 = this;

      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      return new Promise(function (resolve, reject) {
        _this5._postForBrowser(url, data, resolve, reject);
      });
    }
  }, {
    key: '_postForBrowser',
    value: function _postForBrowser(url, data, resolve, reject) {
      var req = new XMLHttpRequest();
      req.open('POST', url, true, this._user, this._password);
      req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

      req.onload = function () {
        if (req.status === 200 || req.status === 201) {
          resolve(req.response);
        } else {
          reject(req.response);
        }
      };

      req.onerror = function () {
        reject('Request failed: Called url "' + url + '", with user "' + this._user + '" and password "' + this._password + '". Data passed: "' + JSON.stringify(data, null, 2) + '"');
      };

      if (data) {
        var xml = this._toXml(data);
        req.send('data=' + xml);
      } else {
        req.send();
      }
    }
  }]);

  return MALjs;
}();

exports.default = MALjs;
;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = mal;

var _malApi = __webpack_require__(9);

var _malApi2 = _interopRequireDefault(_malApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function mal() {
  var api = void 0;

  return {
    setCredentials: function setCredentials(username, password) {
      api = new _malApi2.default(username, password);
    },

    authenticate: function authenticate(username, password) {
      api = new _malApi2.default(username, password);
      return api.verifyCredentials();
    },

    updateEpisodeCount: function updateEpisodeCount(id, episode) {
      if (!id || !episode) return Promise.reject('Error: No episode id or episode number given.');

      return api.anime.update(id, {
        episode: episode
      });
    },

    list: function () {
      var formatData = function formatData(anime) {
        return {
          id: parseInt(anime.series_animedb_id, 10),
          title: anime.series_title,
          image: anime.series_image,
          starts: anime.series_start,
          ends: anime.series_end,
          status: parseInt(anime.my_status, 10),
          currentEpisode: parseInt(anime.my_watched_episodes, 10),
          episodeCount: parseInt(anime.series_episodes, 10) ? parseInt(anime.series_episodes, 10) : null
        };
      };

      var get = function get() {
        return api.anime.list().then(function (data) {
          return Promise.resolve(data.myanimelist.anime.map(formatData));
        });
      };

      return {
        get: get
      };
    }()
  };
};

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["default"] = toHtml;


const contextRange = document.createRange();
contextRange.setStart(document.body, 0);

function toHtml(string) {
  return contextRange.createContextualFragment(string);
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _shell = __webpack_require__(0);

var _shell2 = _interopRequireDefault(_shell);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _shell2.default)({
  log: false
});

/***/ })
/******/ ]);