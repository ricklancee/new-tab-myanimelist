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
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__providers_mal__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__mediator__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_string_to_html__ = __webpack_require__(7);
/* harmony export (immutable) */ __webpack_exports__["a"] = shell;




// Providers


// Utilities


// Virtual domming


const services = {
  hash: function(string) {
    var hash = 0, i, chr, len;
    if (string.length === 0) return hash;
    for (i = 0, len = string.length; i < len; i++) {
      chr   = string.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  },
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


function actions(bus, provider) {
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
          <a href="https://myanimelist.net/anime/${anime.id}" class="card__link">
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


function cardContainer(services, card, refElement, list) {
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
      refElement.classList.add('isEmpty');
      console.warn('! nothing found... show empty state!');
      return;
    }
    refElement.classList.remove('isEmpty');

    const stateToLoad = getStateToLoad();
    renderCardsToRefElement(stateToLoad);
    reCalcContainerHeight();
  };

  const renderNextStatePartial = function() {
    if (renderedCards.length >= state.length) {
      console.info('Completely rendered state to DOM.');
      return;
    }

    const stateToLoad = getStateToLoad();
    renderCardsToRefElement(stateToLoad);
    reCalcContainerHeight();
  };

  const renderCardsToRefElement = function(data) {
    data.forEach(anime => {
      const node = document.createElement('li');
      const animeCard = card(services, node, anime);
      animeCard.render();
      renderedCards.push({ instance: animeCard, id: animeCard.state.id, node});
    });

    // Append all cards to dom after creating the cards
    // this prevents a read, write, read, write cycle
    renderedCards.forEach(({node}) => refElement.appendChild(node));
  };

  const getStateToLoad = function() {
    const loaded = renderedCards.length;
    const slicedState = state.slice(loaded, loaded + loadLimit);
    return slicedState;
  };

  const reCalcContainerHeight = function() {
    containerHeight = refElement.offsetTop + refElement.offsetHeight;
  };

  const updateState = function(newState) {
    console.info('updateState: Updating to new state.');
    data = newState.slice();

    const sortedData = sortData(data);
    const filteredData = filterData(sortedData);

    state = filteredData;

    render();
  };

  return {
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__card__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__cardContainer__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__actions__ = __webpack_require__(1);
/* harmony export (immutable) */ __webpack_exports__["a"] = core;






function core(services) {
  console.info('initialize with ', services);

  const provider = services.providers.mal;

  // Bootstrap the application
  console.info('initialize app...');
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__actions__["a" /* default */])(services.bus, provider);

  console.info('Get settings from storage...');
  const settings = services.storage.getItem('app.settings');
  const user = services.storage.getItem('app.user');
  const cachedList = services.storage.getItem('app.list');

  let prompt = false;
  if (!settings || !settings.loggedIn) {
    console.info('No settings found, or user is not logged in, prompting user...');
    prompt = true;
  }

  let list = [];

  if (cachedList) {
    console.info('Using cached list.');
    list = JSON.parse(cachedList);
  }

  let status = 'watching';
  let season = 'all';
  let year = 'all';

  // Container event handlers.
  const containerEl = document.querySelector(".card-container");
  const container = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__cardContainer__["a" /* default */])(services, __WEBPACK_IMPORTED_MODULE_0__card__["a" /* default */], containerEl, list);

  const filterStatusElements = document.querySelectorAll('[data-filter-status]');
  const filterCurrentSeason = document.querySelector('[data-filter-season="current"]');
  const filterAllSeasons = document.querySelector('[data-filter-season="all"]');

  document.querySelector('[data-filter-status="'+ status +'"]').classList.add('active');
  filterAllSeasons.classList.add('active');

  const handleFilterCurrentSeasonClick = function(event) {
    filterAllSeasons.classList.remove('active');
    event.target.classList.add('active');

    season = 'winter';
    year = 2017;

    container.filter(status, season, year);
    container.render();
  };

  const handleFilterAllSeasonsClick = function(event) {
    filterCurrentSeason.classList.remove('active');
    event.target.classList.add('active');

    season = 'all';
    year = 'all';

    container.filter(status, season, year);
    container.render();
  };

  const handleFilterStatusClick = function(event) {
    status = event.target.getAttribute('data-filter-status');

    filterStatusElements.forEach(el => el.classList.remove('active'));
    event.target.classList.add('active');

    container.filter(status, season, year);
    container.render();
  };

  filterStatusElements.forEach(el => el.addEventListener('click', handleFilterStatusClick));

  filterCurrentSeason.addEventListener('click', handleFilterCurrentSeasonClick);
  filterAllSeasons.addEventListener('click', handleFilterAllSeasonsClick);

  if (cachedList) {
    container.filter(status, season, year);
    container.render();
  }

  services.providers.mal.list.get().then(data => {
    // console.info('Fetched list from provider.');

    // console.log(data.length, list.length);
    // // Update the container state list only if there are changes
    // const json = JSON.stringify(data);
    // if (cachedList !== json) {
    //   container.updateState(data);
    //   // Recache list.
    //   services.storage.setItem('app.list', json);
    // }

  });

  // console.log('Checking if logged in...');
  // If not prompt log in -> store credentials if remember is on.
  // If logged in: get anime data from storage
  // Do background fetch to update -> show spinner for this ?.
};


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


const list = [
      {
         "series_animedb_id": "19",
         "series_title": "Monster",
         "series_synonyms": "; Monster",
         "series_type": "1",
         "series_episodes": "74",
         "series_status": "2",
         "series_start": "2004-04-07",
         "series_end": "2005-09-28",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/10/18793.jpg",
         "my_id": "0",
         "my_watched_episodes": "3",
         "my_start_date": "2016-02-04",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "4",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1454595869",
         "my_tags": []
      },
      {
         "series_animedb_id": "26",
         "series_title": "Texhnolyze",
         "series_synonyms": "Technolyze; Texhnolyze",
         "series_type": "1",
         "series_episodes": "22",
         "series_status": "2",
         "series_start": "2003-04-17",
         "series_end": "2003-09-25",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/3/18165.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1453120569",
         "my_tags": []
      },
      {
         "series_animedb_id": "33",
         "series_title": "Berserk",
         "series_synonyms": "Kenpuu Denki Berserk; Kenfu Denki Berserk; Sword-Wind Chronicle Berserk; Berserk",
         "series_type": "1",
         "series_episodes": "25",
         "series_status": "2",
         "series_start": "1997-10-08",
         "series_end": "1998-04-01",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/12/18520.jpg",
         "my_id": "0",
         "my_watched_episodes": "25",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "7",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1452673549",
         "my_tags": []
      },
      {
         "series_animedb_id": "57",
         "series_title": "Beck",
         "series_synonyms": "BECK; Beck: Mongolian Chop Squad",
         "series_type": "1",
         "series_episodes": "26",
         "series_status": "2",
         "series_start": "2004-10-07",
         "series_end": "2005-03-31",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/11/11636.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "4",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1472397058",
         "my_tags": []
      },
      {
         "series_animedb_id": "67",
         "series_title": "Basilisk: Kouga Ninpou Chou",
         "series_synonyms": "Basilisk: Koga Nimpo Cho; Basilisk",
         "series_type": "1",
         "series_episodes": "24",
         "series_status": "2",
         "series_start": "2005-04-13",
         "series_end": "2005-09-21",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/11/6793.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1453023127",
         "my_tags": []
      },
      {
         "series_animedb_id": "80",
         "series_title": "Mobile Suit Gundam",
         "series_synonyms": "Kidou Senshi Gundam; First Gundam; Mobile Suit Gundam: 0079; MSG; Mobile Suit Gundam",
         "series_type": "1",
         "series_episodes": "43",
         "series_status": "2",
         "series_start": "1979-04-07",
         "series_end": "1980-01-26",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/5/12453.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "6",
         "my_status": "4",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1452673761",
         "my_tags": []
      },
      {
         "series_animedb_id": "90",
         "series_title": "Mobile Suit Gundam Wing",
         "series_synonyms": "Shin Kidou Senki Gundam Wing; Mobile Suit Gundam Wing",
         "series_type": "1",
         "series_episodes": "49",
         "series_status": "2",
         "series_start": "1995-04-07",
         "series_end": "1996-03-29",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/11/6613.jpg",
         "my_id": "0",
         "my_watched_episodes": "49",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "7",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1452673700",
         "my_tags": []
      },
      {
         "series_animedb_id": "121",
         "series_title": "Fullmetal Alchemist",
         "series_synonyms": "Hagane no Renkinjutsushi; FMA; Full Metal Alchemist; Fullmetal Alchemist",
         "series_type": "1",
         "series_episodes": "51",
         "series_status": "2",
         "series_start": "2003-10-04",
         "series_end": "2004-10-02",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/10/75815.jpg",
         "my_id": "0",
         "my_watched_episodes": "51",
         "my_start_date": "2016-05-03",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1462478531",
         "my_tags": []
      },
      {
         "series_animedb_id": "164",
         "series_title": "Mononoke Hime",
         "series_synonyms": "Mononoke Hime; Princess Mononoke",
         "series_type": "3",
         "series_episodes": "1",
         "series_status": "2",
         "series_start": "1997-07-12",
         "series_end": "1997-07-12",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/7/75919.jpg",
         "my_id": "0",
         "my_watched_episodes": "1",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "10",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1483023318",
         "my_tags": []
      },
      {
         "series_animedb_id": "226",
         "series_title": "Elfen Lied",
         "series_synonyms": "Elfen Song; Elfic Song; Elfen Lied",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2004-07-25",
         "series_end": "2004-10-17",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/10/6883.jpg",
         "my_id": "0",
         "my_watched_episodes": "6",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "3",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1453042290",
         "my_tags": []
      },
      {
         "series_animedb_id": "237",
         "series_title": "Eureka Seven",
         "series_synonyms": "Koukyoushihen; Koukyou Shihen Eureka Seven; Eureka 7; Eureka Seven Psalms of Planets; Eureka Seven",
         "series_type": "1",
         "series_episodes": "50",
         "series_status": "2",
         "series_start": "2005-04-17",
         "series_end": "2006-04-02",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/7/14505.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1471115793",
         "my_tags": []
      },
      {
         "series_animedb_id": "269",
         "series_title": "Bleach",
         "series_synonyms": "; Bleach",
         "series_type": "1",
         "series_episodes": "366",
         "series_status": "2",
         "series_start": "2004-10-05",
         "series_end": "2012-03-27",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/3/40451.jpg",
         "my_id": "0",
         "my_watched_episodes": "366",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "8",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1452673485",
         "my_tags": []
      },
      {
         "series_animedb_id": "430",
         "series_title": "Fullmetal Alchemist: The Conqueror of Shamballa",
         "series_synonyms": "Gekijyouban Hagane no Renkinjutsushi - Shanbara wo Yuku Mono; Fullmetal Alchemist the Movie: Conqueror of Shamballa; FMA Movie; Fullmetal Alchemist: The Movie - Conqueror of Shamballa",
         "series_type": "3",
         "series_episodes": "1",
         "series_status": "2",
         "series_start": "2005-07-23",
         "series_end": "2005-07-23",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/4/20113.jpg",
         "my_id": "0",
         "my_watched_episodes": "1",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1462478510",
         "my_tags": []
      },
      {
         "series_animedb_id": "431",
         "series_title": "Howl no Ugoku Shiro",
         "series_synonyms": "; Howl's Moving Castle",
         "series_type": "3",
         "series_episodes": "1",
         "series_status": "2",
         "series_start": "2004-11-20",
         "series_end": "2004-11-20",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/5/75810.jpg",
         "my_id": "0",
         "my_watched_episodes": "1",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "8",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1474496229",
         "my_tags": []
      },
      {
         "series_animedb_id": "457",
         "series_title": "Mushishi",
         "series_synonyms": "; Mushi-Shi",
         "series_type": "1",
         "series_episodes": "26",
         "series_status": "2",
         "series_start": "2005-10-23",
         "series_end": "2006-06-19",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/2/73862.jpg",
         "my_id": "0",
         "my_watched_episodes": "3",
         "my_start_date": "2016-01-19",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "1",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1454588823",
         "my_tags": []
      },
      {
         "series_animedb_id": "477",
         "series_title": "Aria The Animation",
         "series_synonyms": "; Aria The Animation",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2005-10-06",
         "series_end": "2005-12-29",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/2/77620.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1468005479",
         "my_tags": []
      },
      {
         "series_animedb_id": "489",
         "series_title": "Kamichu!",
         "series_synonyms": "Kami-chu!: Kami-sama wa Chuugakusei; The Goddess is a Middle School Student",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2005-06-29",
         "series_end": "2005-09-27",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/3/24641.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1473547013",
         "my_tags": []
      },
      {
         "series_animedb_id": "512",
         "series_title": "Majo no Takkyuubin",
         "series_synonyms": "Witch's Express Delivery; Kiki's Delivery Service",
         "series_type": "3",
         "series_episodes": "1",
         "series_status": "2",
         "series_start": "1989-07-29",
         "series_end": "1989-07-29",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/10/75916.jpg",
         "my_id": "0",
         "my_watched_episodes": "1",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "10",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1471099901",
         "my_tags": []
      },
      {
         "series_animedb_id": "523",
         "series_title": "Tonari no Totoro",
         "series_synonyms": "My Neighbour Totoro; My Neighbor Totoro",
         "series_type": "3",
         "series_episodes": "1",
         "series_status": "2",
         "series_start": "1988-04-16",
         "series_end": "1988-04-16",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/4/75923.jpg",
         "my_id": "0",
         "my_watched_episodes": "1",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "10",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1483023305",
         "my_tags": []
      },
      {
         "series_animedb_id": "777",
         "series_title": "Hellsing Ultimate",
         "series_synonyms": "; Hellsing Ultimate",
         "series_type": "2",
         "series_episodes": "10",
         "series_status": "2",
         "series_start": "2006-02-10",
         "series_end": "2012-12-26",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/6/7333.jpg",
         "my_id": "0",
         "my_watched_episodes": "10",
         "my_start_date": "0000-00-00",
         "my_finish_date": "2016-01-27",
         "my_score": "0",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1453892114",
         "my_tags": []
      },
      {
         "series_animedb_id": "849",
         "series_title": "Suzumiya Haruhi no Yuuutsu",
         "series_synonyms": "Suzumiya Haruhi no Yuuutsu; The Melancholy of Haruhi Suzumiya",
         "series_type": "1",
         "series_episodes": "14",
         "series_status": "2",
         "series_start": "2006-04-03",
         "series_end": "2006-07-03",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/3/65791.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1463254800",
         "my_tags": []
      },
      {
         "series_animedb_id": "918",
         "series_title": "Gintama",
         "series_synonyms": "Gin Tama; Silver Soul; Yorinuki Gintama-san; Gintama",
         "series_type": "1",
         "series_episodes": "201",
         "series_status": "2",
         "series_start": "2006-04-04",
         "series_end": "2010-03-25",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/2/10038.jpg",
         "my_id": "0",
         "my_watched_episodes": "1",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1462041731",
         "my_tags": []
      },
      {
         "series_animedb_id": "934",
         "series_title": "Higurashi no Naku Koro ni",
         "series_synonyms": "When the Cicadas Cry; The Moment the Cicadas Cry; When They Cry",
         "series_type": "1",
         "series_episodes": "26",
         "series_status": "2",
         "series_start": "2006-04-05",
         "series_end": "2006-09-27",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/12/19634.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "4",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1469814052",
         "my_tags": []
      },
      {
         "series_animedb_id": "1482",
         "series_title": "D.Gray-man",
         "series_synonyms": "D. Gray-man; D. Grey-man; D.Gray-man",
         "series_type": "1",
         "series_episodes": "103",
         "series_status": "2",
         "series_start": "2006-10-03",
         "series_end": "2008-09-30",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/13/75194.jpg",
         "my_id": "0",
         "my_watched_episodes": "16",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "3",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1469296500",
         "my_tags": []
      },
      {
         "series_animedb_id": "1535",
         "series_title": "Death Note",
         "series_synonyms": "DN; Death Note",
         "series_type": "1",
         "series_episodes": "37",
         "series_status": "2",
         "series_start": "2006-10-04",
         "series_end": "2007-06-27",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/9/9453.jpg",
         "my_id": "0",
         "my_watched_episodes": "37",
         "my_start_date": "0000-00-00",
         "my_finish_date": "2016-01-23",
         "my_score": "9",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1453583038",
         "my_tags": []
      },
      {
         "series_animedb_id": "1575",
         "series_title": "Code Geass: Hangyaku no Lelouch",
         "series_synonyms": "Code Geass: Hangyaku no Lelouch; Code Geass: Lelouch of the Rebellion",
         "series_type": "1",
         "series_episodes": "25",
         "series_status": "2",
         "series_start": "2006-10-06",
         "series_end": "2007-07-29",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/5/50331.jpg",
         "my_id": "0",
         "my_watched_episodes": "1",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "4",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1460204350",
         "my_tags": []
      },
      {
         "series_animedb_id": "1689",
         "series_title": "Byousoku 5 Centimeter",
         "series_synonyms": "Five Centimeters Per Second; Byousoku 5 Centimeter - a chain of short stories about their distance; 5 Centimetres Per Second; 5 cm per second; 5 Centimeters Per Second",
         "series_type": "3",
         "series_episodes": "3",
         "series_status": "2",
         "series_start": "2007-02-16",
         "series_end": "2007-03-03",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/6/73426.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1460577233",
         "my_tags": []
      },
      {
         "series_animedb_id": "1818",
         "series_title": "Claymore",
         "series_synonyms": "; Claymore",
         "series_type": "1",
         "series_episodes": "26",
         "series_status": "2",
         "series_start": "2007-04-04",
         "series_end": "2007-09-26",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/3/21834.jpg",
         "my_id": "0",
         "my_watched_episodes": "4",
         "my_start_date": "2016-01-17",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "3",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1453042277",
         "my_tags": []
      },
      {
         "series_animedb_id": "1887",
         "series_title": "Lucky☆Star",
         "series_synonyms": "Lucky Star; Lucky☆Star",
         "series_type": "1",
         "series_episodes": "24",
         "series_status": "2",
         "series_start": "2007-04-08",
         "series_end": "2007-09-17",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/13/15010.jpg",
         "my_id": "0",
         "my_watched_episodes": "24",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "10",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1481661911",
         "my_tags": []
      },
      {
         "series_animedb_id": "2001",
         "series_title": "Tengen Toppa Gurren Lagann",
         "series_synonyms": "Tengen Toppa Gurren-Lagann; Making Break-Through Gurren Lagann; Heavenly Breakthrough Gurren Lagann; TTGL; Gurren Lagann",
         "series_type": "1",
         "series_episodes": "27",
         "series_status": "2",
         "series_start": "2007-04-01",
         "series_end": "2007-09-30",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/4/5123.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "6",
         "my_status": "4",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1462107351",
         "my_tags": []
      },
      {
         "series_animedb_id": "2025",
         "series_title": "Darker than Black: Kuro no Keiyakusha",
         "series_synonyms": "DTB; Darker than Black",
         "series_type": "1",
         "series_episodes": "25",
         "series_status": "2",
         "series_start": "2007-04-06",
         "series_end": "2007-09-28",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/5/19570.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1460811388",
         "my_tags": []
      },
      {
         "series_animedb_id": "2034",
         "series_title": "Lovely★Complex",
         "series_synonyms": "Love★Com; Love Com; Lovely Complex",
         "series_type": "1",
         "series_episodes": "24",
         "series_status": "2",
         "series_start": "2007-04-07",
         "series_end": "2007-09-29",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/11/75563.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1482088785",
         "my_tags": []
      },
      {
         "series_animedb_id": "2236",
         "series_title": "Toki wo Kakeru Shoujo",
         "series_synonyms": "Toki wo Kakeru Shojo; TokiKake; Toki o Kakeru Shojo; The Girl Who Cut Time; The Little Girl Who Conquered Time; The Girl Who Leapt Through Time",
         "series_type": "3",
         "series_episodes": "1",
         "series_status": "2",
         "series_start": "2006-07-15",
         "series_end": "2006-07-15",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/1/2432.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1460790238",
         "my_tags": []
      },
      {
         "series_animedb_id": "2251",
         "series_title": "Baccano!",
         "series_synonyms": "; Baccano!",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2007-07-27",
         "series_end": "2007-11-02",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/3/14547.jpg",
         "my_id": "0",
         "my_watched_episodes": "13",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1462037464",
         "my_tags": []
      },
      {
         "series_animedb_id": "2581",
         "series_title": "Mobile Suit Gundam 00",
         "series_synonyms": "Kidou Senshi Gundam 00; Gundam Double O; Mobile Suit Gundam 00",
         "series_type": "1",
         "series_episodes": "25",
         "series_status": "2",
         "series_start": "2007-10-06",
         "series_end": "2008-03-29",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/3/13200.jpg",
         "my_id": "0",
         "my_watched_episodes": "25",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "9",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1452673712",
         "my_tags": []
      },
      {
         "series_animedb_id": "2963",
         "series_title": "Minami-ke",
         "series_synonyms": "Minamike; The Minami Family",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2007-10-08",
         "series_end": "2007-12-31",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/2/75279.jpg",
         "my_id": "0",
         "my_watched_episodes": "13",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1481380122",
         "my_tags": []
      },
      {
         "series_animedb_id": "2966",
         "series_title": "Ookami to Koushinryou",
         "series_synonyms": "Ookami to Koushinryou; Spice and Wolf",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2008-01-09",
         "series_end": "2008-03-26",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/5/59401.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1463600043",
         "my_tags": []
      },
      {
         "series_animedb_id": "3225",
         "series_title": "Minami-ke Okawari",
         "series_synonyms": "Minamike: Okawari",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2008-01-07",
         "series_end": "2008-03-31",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/10/73556.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "1",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1481380239",
         "my_tags": []
      },
      {
         "series_animedb_id": "3455",
         "series_title": "To LOVE-Ru",
         "series_synonyms": "To Love You; ToLoveRu; ToLoveRu Trouble; To-Rabu-Ru; ToRaBuRu; To LOVE Ru",
         "series_type": "1",
         "series_episodes": "26",
         "series_status": "2",
         "series_start": "2008-04-04",
         "series_end": "2008-09-26",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/13/22544.jpg",
         "my_id": "0",
         "my_watched_episodes": "1",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "4",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1460790000",
         "my_tags": []
      },
      {
         "series_animedb_id": "3588",
         "series_title": "Soul Eater",
         "series_synonyms": "SOUL EATER; Soul Eater",
         "series_type": "1",
         "series_episodes": "51",
         "series_status": "2",
         "series_start": "2008-04-07",
         "series_end": "2009-03-30",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/9/7804.jpg",
         "my_id": "0",
         "my_watched_episodes": "51",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "9",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1475257246",
         "my_tags": []
      },
      {
         "series_animedb_id": "3958",
         "series_title": "Kannagi",
         "series_synonyms": "; Kannagi: Crazy Shrine Maidens",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2008-10-04",
         "series_end": "2008-12-27",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/3/19724.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "1",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1477341574",
         "my_tags": []
      },
      {
         "series_animedb_id": "4081",
         "series_title": "Natsume Yuujinchou",
         "series_synonyms": "Natsume Yujincho, Natsume Yujin-cho; Natsume's Book of Friends",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2008-07-08",
         "series_end": "2008-09-30",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/7/28859.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "1",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1461187528",
         "my_tags": []
      },
      {
         "series_animedb_id": "4224",
         "series_title": "Toradora!",
         "series_synonyms": "Tiger X Dragon; Toradora!",
         "series_type": "1",
         "series_episodes": "25",
         "series_status": "2",
         "series_start": "2008-10-02",
         "series_end": "2009-03-26",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/13/22128.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1470961827",
         "my_tags": []
      },
      {
         "series_animedb_id": "4472",
         "series_title": "Lucky☆Star: Original na Visual to Animation",
         "series_synonyms": "Lucky Star OVA",
         "series_type": "2",
         "series_episodes": "1",
         "series_status": "2",
         "series_start": "2008-09-26",
         "series_end": "2008-09-26",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/2/22582.jpg",
         "my_id": "0",
         "my_watched_episodes": "1",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "9",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1481661926",
         "my_tags": []
      },
      {
         "series_animedb_id": "4896",
         "series_title": "Umineko no Naku Koro ni",
         "series_synonyms": "When They Cry 3; When the Seagulls Cry; When They Cry: Seagulls; Umineko: When They Cry",
         "series_type": "1",
         "series_episodes": "26",
         "series_status": "2",
         "series_start": "2009-07-02",
         "series_end": "2009-12-24",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/10/17709.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1469814107",
         "my_tags": []
      },
      {
         "series_animedb_id": "4898",
         "series_title": "Kuroshitsuji",
         "series_synonyms": "Kuro Shitsuji; Kuroshitsuzi; Black Butler",
         "series_type": "1",
         "series_episodes": "24",
         "series_status": "2",
         "series_start": "2008-10-03",
         "series_end": "2009-03-27",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/5/27013.jpg",
         "my_id": "0",
         "my_watched_episodes": "24",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "7",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1470959050",
         "my_tags": []
      },
      {
         "series_animedb_id": "5081",
         "series_title": "Bakemonogatari",
         "series_synonyms": "Ghostory; Bakemonogatari",
         "series_type": "1",
         "series_episodes": "15",
         "series_status": "2",
         "series_start": "2009-07-03",
         "series_end": "2010-06-25",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/11/75274.jpg",
         "my_id": "0",
         "my_watched_episodes": "15",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "10",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1460406670",
         "my_tags": []
      },
      {
         "series_animedb_id": "5114",
         "series_title": "Fullmetal Alchemist: Brotherhood",
         "series_synonyms": "Hagane no Renkinjutsushi (2009); Fullmetal Alchemist (2009); FMA; Fullmetal Alchemist: Brotherhood",
         "series_type": "1",
         "series_episodes": "64",
         "series_status": "2",
         "series_start": "2009-04-05",
         "series_end": "2010-07-04",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/5/47421.jpg",
         "my_id": "0",
         "my_watched_episodes": "1",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "3",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1462479979",
         "my_tags": []
      },
      {
         "series_animedb_id": "5630",
         "series_title": "Higashi no Eden",
         "series_synonyms": "Higashi no Eden; Eden of The East",
         "series_type": "1",
         "series_episodes": "11",
         "series_status": "2",
         "series_start": "2009-04-10",
         "series_end": "2009-06-19",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/9/15033.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1453553502",
         "my_tags": []
      },
      {
         "series_animedb_id": "5680",
         "series_title": "K-On!",
         "series_synonyms": "Keion; K-ON! Season 1; K-ON!",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2009-04-03",
         "series_end": "2009-06-26",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/10/76120.jpg",
         "my_id": "0",
         "my_watched_episodes": "13",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "10",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1472295122",
         "my_tags": []
      },
      {
         "series_animedb_id": "5958",
         "series_title": "Sora no Otoshimono",
         "series_synonyms": "Lost Property of the Sky; Misplaced by Heaven; Heaven's Lost Property",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2009-10-05",
         "series_end": "2009-12-28",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/5/50307.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1460723593",
         "my_tags": []
      },
      {
         "series_animedb_id": "5978",
         "series_title": "Kannagi: Moshimo Kannagi ga Attara...",
         "series_synonyms": "Kannagi - Crazy Shrine Maidens Special; Kannagi - Episode 14; Kannagi Special",
         "series_type": "4",
         "series_episodes": "1",
         "series_status": "2",
         "series_start": "2009-05-27",
         "series_end": "2009-05-27",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/3/19725.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "1",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1480449230",
         "my_tags": []
      },
      {
         "series_animedb_id": "6211",
         "series_title": "Tokyo Magnitude 8.0",
         "series_synonyms": "; Tokyo Magnitude 8.0",
         "series_type": "1",
         "series_episodes": "11",
         "series_status": "2",
         "series_start": "2009-07-10",
         "series_end": "2009-09-18",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/10/13776.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1471115775",
         "my_tags": []
      },
      {
         "series_animedb_id": "6213",
         "series_title": "Toaru Kagaku no Railgun",
         "series_synonyms": "Toaru Kagaku no Choudenjihou; A Certain Scientific Railgun",
         "series_type": "1",
         "series_episodes": "24",
         "series_status": "2",
         "series_start": "2009-10-03",
         "series_end": "2010-03-20",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/8/53581.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "1",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1470959505",
         "my_tags": []
      },
      {
         "series_animedb_id": "6512",
         "series_title": "Nyan Koi!",
         "series_synonyms": "Nyankoi; Nyan Koi!",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2009-10-02",
         "series_end": "2009-12-18",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/10/18299.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "1",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1483373712",
         "my_tags": []
      },
      {
         "series_animedb_id": "6547",
         "series_title": "Angel Beats!",
         "series_synonyms": "; Angel Beats!",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2010-04-03",
         "series_end": "2010-06-26",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/10/22061.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1463919038",
         "my_tags": []
      },
      {
         "series_animedb_id": "6594",
         "series_title": "Katanagatari",
         "series_synonyms": "Sword Story; Katanagatari",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2010-01-26",
         "series_end": "2010-12-11",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/2/50023.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1477739469",
         "my_tags": []
      },
      {
         "series_animedb_id": "6702",
         "series_title": "Fairy Tail",
         "series_synonyms": "FAIRY TAIL; FT; Fairy Tail",
         "series_type": "1",
         "series_episodes": "175",
         "series_status": "2",
         "series_start": "2009-10-12",
         "series_end": "2013-03-30",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/5/18179.jpg",
         "my_id": "0",
         "my_watched_episodes": "140",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "8",
         "my_status": "3",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1452673436",
         "my_tags": []
      },
      {
         "series_animedb_id": "6746",
         "series_title": "Durarara!!",
         "series_synonyms": "Dhurarara!!; Dyurarara!!; Dulalala!!; Dullalala!!; DRRR!!; Durarara!!",
         "series_type": "1",
         "series_episodes": "24",
         "series_status": "2",
         "series_start": "2010-01-08",
         "series_end": "2010-06-25",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/10/71772.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "3",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1470861281",
         "my_tags": []
      },
      {
         "series_animedb_id": "6802",
         "series_title": "So Ra No Wo To",
         "series_synonyms": "So-Ra-No-Wo-To; Soranowoto; Sora no Woto; Sound of the Sky",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2010-01-05",
         "series_end": "2010-03-23",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/7/81654.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1477823368",
         "my_tags": []
      },
      {
         "series_animedb_id": "6862",
         "series_title": "K-On!: Live House!",
         "series_synonyms": "K-On! OVA; Keion OVA; K-On! Episode 14; Keion OVA",
         "series_type": "4",
         "series_episodes": "1",
         "series_status": "2",
         "series_start": "2010-01-19",
         "series_end": "2010-01-19",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/9/15892.jpg",
         "my_id": "0",
         "my_watched_episodes": "1",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "10",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1472295117",
         "my_tags": []
      },
      {
         "series_animedb_id": "6880",
         "series_title": "Deadman Wonderland",
         "series_synonyms": "DEADMAN WONDERLAND; Deadman Wonderland",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2011-04-17",
         "series_end": "2011-07-03",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/9/75299.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "2016-01-17",
         "my_score": "0",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1453064903",
         "my_tags": []
      },
      {
         "series_animedb_id": "6956",
         "series_title": "Working!!",
         "series_synonyms": "Working!!; Wagnaria!!",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2010-04-04",
         "series_end": "2010-06-27",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/10/75262.jpg",
         "my_id": "0",
         "my_watched_episodes": "13",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "10",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1470126200",
         "my_tags": []
      },
      {
         "series_animedb_id": "7647",
         "series_title": "Arakawa Under the Bridge",
         "series_synonyms": "; Arakawa Under the Bridge",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2010-04-05",
         "series_end": "2010-06-28",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/2/59197.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1470125237",
         "my_tags": []
      },
      {
         "series_animedb_id": "7674",
         "series_title": "Bakuman.",
         "series_synonyms": "Bakuman Season 1; Bakuman.",
         "series_type": "1",
         "series_episodes": "25",
         "series_status": "2",
         "series_start": "2010-10-02",
         "series_end": "2011-04-02",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/6/26138.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1470961754",
         "my_tags": []
      },
      {
         "series_animedb_id": "7724",
         "series_title": "Shiki",
         "series_synonyms": "Corpse Demon; Shiki",
         "series_type": "1",
         "series_episodes": "22",
         "series_status": "2",
         "series_start": "2010-07-09",
         "series_end": "2010-12-31",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/8/21343.jpg",
         "my_id": "0",
         "my_watched_episodes": "3",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "3",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1471886965",
         "my_tags": []
      },
      {
         "series_animedb_id": "7791",
         "series_title": "K-On!!",
         "series_synonyms": "Keion 2; K-On!! 2nd Season; K-ON! Season 2",
         "series_type": "1",
         "series_episodes": "26",
         "series_status": "2",
         "series_start": "2010-04-07",
         "series_end": "2010-09-29",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/12/76121.jpg",
         "my_id": "0",
         "my_watched_episodes": "26",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "10",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1472834336",
         "my_tags": []
      },
      {
         "series_animedb_id": "8457",
         "series_title": "Yozakura Quartet: Hoshi no Umi",
         "series_synonyms": [],
         "series_type": "2",
         "series_episodes": "3",
         "series_status": "2",
         "series_start": "2010-10-08",
         "series_end": "2011-11-09",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/10/27779.jpg",
         "my_id": "0",
         "my_watched_episodes": "3",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1477298057",
         "my_tags": []
      },
      {
         "series_animedb_id": "8769",
         "series_title": "Ore no Imouto ga Konnani Kawaii Wake ga Nai",
         "series_synonyms": "My Little Sister Can't Be This Cute; OreImo",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2010-10-03",
         "series_end": "2010-12-19",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/8/24875.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "8",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1477561196",
         "my_tags": []
      },
      {
         "series_animedb_id": "9253",
         "series_title": "Steins;Gate",
         "series_synonyms": "シュタゲ; Steins;Gate",
         "series_type": "1",
         "series_episodes": "24",
         "series_status": "2",
         "series_start": "2011-04-06",
         "series_end": "2011-09-14",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/5/73199.jpg",
         "my_id": "0",
         "my_watched_episodes": "3",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "3",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1460818096",
         "my_tags": []
      },
      {
         "series_animedb_id": "9260",
         "series_title": "Kizumonogatari I: Tekketsu-hen",
         "series_synonyms": "Koyomi Vamp; Kizumonogatari Part 1: Tekketsu",
         "series_type": "3",
         "series_episodes": "1",
         "series_status": "2",
         "series_start": "2016-01-08",
         "series_end": "2016-01-08",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/12/76485.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1462200905",
         "my_tags": []
      },
      {
         "series_animedb_id": "9289",
         "series_title": "Hanasaku Iroha",
         "series_synonyms": "Hana-Saku Iroha; Hanasaku Iroha ~Blossoms for Tomorrow~",
         "series_type": "1",
         "series_episodes": "26",
         "series_status": "2",
         "series_start": "2011-04-03",
         "series_end": "2011-09-25",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/3/28967.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1460203826",
         "my_tags": []
      },
      {
         "series_animedb_id": "9513",
         "series_title": "Beelzebub",
         "series_synonyms": "; Beelzebub",
         "series_type": "1",
         "series_episodes": "60",
         "series_status": "2",
         "series_start": "2011-01-09",
         "series_end": "2012-03-25",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/3/28013.jpg",
         "my_id": "0",
         "my_watched_episodes": "17",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "3",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1471868780",
         "my_tags": []
      },
      {
         "series_animedb_id": "9617",
         "series_title": "K-On! Movie",
         "series_synonyms": "Eiga K-On!; Keion Movie; K-ON! The Movie",
         "series_type": "3",
         "series_episodes": "1",
         "series_status": "2",
         "series_start": "2011-12-03",
         "series_end": "2011-12-03",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/5/76233.jpg",
         "my_id": "0",
         "my_watched_episodes": "1",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "10",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1472672979",
         "my_tags": []
      },
      {
         "series_animedb_id": "9734",
         "series_title": "K-On!!: Keikaku!",
         "series_synonyms": "Keion 2 Special; K-On!! 2nd Season Special; K-On!! Episode 27",
         "series_type": "4",
         "series_episodes": "1",
         "series_status": "2",
         "series_start": "2011-03-16",
         "series_end": "2011-03-16",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/7/26965.jpg",
         "my_id": "0",
         "my_watched_episodes": "1",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "10",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1472672993",
         "my_tags": []
      },
      {
         "series_animedb_id": "9756",
         "series_title": "Mahou Shoujo Madoka★Magica",
         "series_synonyms": "Mahou Shoujo Madoka Magika; Magical Girl Madoka Magica; Puella Magi Madoka Magica",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2011-01-07",
         "series_end": "2011-04-22",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/11/55225.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "9",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1477233080",
         "my_tags": []
      },
      {
         "series_animedb_id": "9919",
         "series_title": "Ao no Exorcist",
         "series_synonyms": "Ao no Futsumashi; Blue Exorcist",
         "series_type": "1",
         "series_episodes": "25",
         "series_status": "2",
         "series_start": "2011-04-17",
         "series_end": "2011-10-02",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/10/75195.jpg",
         "my_id": "0",
         "my_watched_episodes": "25",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "9",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1470860975",
         "my_tags": []
      },
      {
         "series_animedb_id": "9941",
         "series_title": "Tiger & Bunny",
         "series_synonyms": "Tiger and Bunny; Taibani; Tiger & Bunny",
         "series_type": "1",
         "series_episodes": "25",
         "series_status": "2",
         "series_start": "2011-04-03",
         "series_end": "2011-09-18",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/13/29466.jpg",
         "my_id": "0",
         "my_watched_episodes": "1",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "3",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1469648408",
         "my_tags": []
      },
      {
         "series_animedb_id": "9989",
         "series_title": "Ano Hi Mita Hana no Namae wo Bokutachi wa Mada Shiranai.",
         "series_synonyms": "AnoHana; We Still Don't Know the Name of the Flower We Saw That Day.; anohana: The Flower We Saw That Day",
         "series_type": "1",
         "series_episodes": "11",
         "series_status": "2",
         "series_start": "2011-04-15",
         "series_end": "2011-06-24",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/5/79697.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1461247960",
         "my_tags": []
      },
      {
         "series_animedb_id": "10020",
         "series_title": "Ore no Imouto ga Konnani Kawaii Wake ga Nai Specials",
         "series_synonyms": "My Little Sister Can't Be This Cute Specials; OreImo Specials",
         "series_type": "5",
         "series_episodes": "4",
         "series_status": "2",
         "series_start": "2011-02-22",
         "series_end": "2011-05-31",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/8/29734.jpg",
         "my_id": "0",
         "my_watched_episodes": "4",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1477663093",
         "my_tags": []
      },
      {
         "series_animedb_id": "10087",
         "series_title": "Fate/Zero",
         "series_synonyms": "; Fate/Zero",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2011-10-02",
         "series_end": "2011-12-25",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/2/73249.jpg",
         "my_id": "0",
         "my_watched_episodes": "1",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "1",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1473282881",
         "my_tags": []
      },
      {
         "series_animedb_id": "10162",
         "series_title": "Usagi Drop",
         "series_synonyms": "Usagi Drop; Bunny Drop",
         "series_type": "1",
         "series_episodes": "11",
         "series_status": "2",
         "series_start": "2011-07-08",
         "series_end": "2011-09-16",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/2/29665.jpg",
         "my_id": "0",
         "my_watched_episodes": "11",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "9",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1474214991",
         "my_tags": []
      },
      {
         "series_animedb_id": "10165",
         "series_title": "Nichijou",
         "series_synonyms": "Everyday; Nichijou - My Ordinary Life",
         "series_type": "1",
         "series_episodes": "26",
         "series_status": "2",
         "series_start": "2011-04-03",
         "series_end": "2011-09-25",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/3/75617.jpg",
         "my_id": "0",
         "my_watched_episodes": "26",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "10",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1461098641",
         "my_tags": []
      },
      {
         "series_animedb_id": "10216",
         "series_title": "Yondemasu yo, Azazel-san. (TV)",
         "series_synonyms": "Yondemasu yo, Azazel-san. (2011); You're Being Summoned, Azazel",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2011-04-08",
         "series_end": "2011-07-01",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/4/75284.jpg",
         "my_id": "0",
         "my_watched_episodes": "13",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "7",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1468482399",
         "my_tags": []
      },
      {
         "series_animedb_id": "10278",
         "series_title": "The iDOLM@STER",
         "series_synonyms": "The Idolmaster; THE IDOLM@STER",
         "series_type": "1",
         "series_episodes": "25",
         "series_status": "2",
         "series_start": "2011-07-08",
         "series_end": "2011-12-23",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/9/41085.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1472383891",
         "my_tags": []
      },
      {
         "series_animedb_id": "10357",
         "series_title": "Jinrui wa Suitai Shimashita",
         "series_synonyms": "Jintai; Humanity Has Declined",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2012-07-02",
         "series_end": "2012-09-17",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/4/45704.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "9",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1479594504",
         "my_tags": []
      },
      {
         "series_animedb_id": "10389",
         "series_title": "Momo e no Tegami",
         "series_synonyms": "Momo e no Tegami; A Letter to Momo",
         "series_type": "3",
         "series_episodes": "1",
         "series_status": "2",
         "series_start": "2011-09-10",
         "series_end": "2011-09-10",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/2/43557.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1473022341",
         "my_tags": []
      },
      {
         "series_animedb_id": "10495",
         "series_title": "Yuru Yuri",
         "series_synonyms": "YRYR; YuruYuri: Happy Go Lily",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2011-07-05",
         "series_end": "2011-09-20",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/2/52921.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "7",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1473237320",
         "my_tags": []
      },
      {
         "series_animedb_id": "10521",
         "series_title": "Working'!!",
         "series_synonyms": "Working!! 2; Wagnaria!!2",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2011-10-01",
         "series_end": "2011-12-24",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/3/75263.jpg",
         "my_id": "0",
         "my_watched_episodes": "13",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "10",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1470321869",
         "my_tags": []
      },
      {
         "series_animedb_id": "10620",
         "series_title": "Mirai Nikki (TV)",
         "series_synonyms": "Mirai Nikki; Mirai Nikki (2011); The Future Diary",
         "series_type": "1",
         "series_episodes": "26",
         "series_status": "2",
         "series_start": "2011-10-09",
         "series_end": "2012-04-15",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/13/33465.jpg",
         "my_id": "0",
         "my_watched_episodes": "26",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "7",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1460789983",
         "my_tags": []
      },
      {
         "series_animedb_id": "10711",
         "series_title": "Plastic Neesan",
         "series_synonyms": "+tic Nee-san; +tic Elder Sister; Plustic Neesan; Plastic Nee-san; Purasu Chikku Neesan; Plastic Elder Sister",
         "series_type": "5",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2011-05-16",
         "series_end": "2012-07-26",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/13/76583.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "8",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1481983600",
         "my_tags": []
      },
      {
         "series_animedb_id": "10721",
         "series_title": "Mawaru Penguindrum",
         "series_synonyms": "; Penguindrum",
         "series_type": "1",
         "series_episodes": "24",
         "series_status": "2",
         "series_start": "2011-07-08",
         "series_end": "2011-12-23",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/5/30238.jpg",
         "my_id": "0",
         "my_watched_episodes": "2",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "4",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1477344651",
         "my_tags": []
      },
      {
         "series_animedb_id": "10793",
         "series_title": "Guilty Crown",
         "series_synonyms": "GUILTY CROWN; Guilty Crown",
         "series_type": "1",
         "series_episodes": "22",
         "series_status": "2",
         "series_start": "2011-10-14",
         "series_end": "2012-03-23",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/8/33713.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1462021960",
         "my_tags": []
      },
      {
         "series_animedb_id": "11061",
         "series_title": "Hunter x Hunter (2011)",
         "series_synonyms": "HxH (2011); Hunter x Hunter",
         "series_type": "1",
         "series_episodes": "148",
         "series_status": "2",
         "series_start": "2011-10-02",
         "series_end": "2014-09-24",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/11/33657.jpg",
         "my_id": "0",
         "my_watched_episodes": "30",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "3",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1472074599",
         "my_tags": []
      },
      {
         "series_animedb_id": "11111",
         "series_title": "Another",
         "series_synonyms": "; Another",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2012-01-10",
         "series_end": "2012-03-27",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/4/75509.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1469813983",
         "my_tags": []
      },
      {
         "series_animedb_id": "11597",
         "series_title": "Nisemonogatari",
         "series_synonyms": "Impostory; Nisemonogatari",
         "series_type": "1",
         "series_episodes": "11",
         "series_status": "2",
         "series_start": "2012-01-08",
         "series_end": "2012-03-18",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/10/35619.jpg",
         "my_id": "0",
         "my_watched_episodes": "11",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "10",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1460406719",
         "my_tags": []
      },
      {
         "series_animedb_id": "11633",
         "series_title": "Blood Lad",
         "series_synonyms": "; Blood Lad",
         "series_type": "1",
         "series_episodes": "10",
         "series_status": "2",
         "series_start": "2013-07-08",
         "series_end": "2013-09-09",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/11/47677.jpg",
         "my_id": "0",
         "my_watched_episodes": "10",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "8",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1472073757",
         "my_tags": []
      },
      {
         "series_animedb_id": "11741",
         "series_title": "Fate/Zero 2nd Season",
         "series_synonyms": "Fate/Zero Second Season; Fate/Zero Season 2",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2012-04-08",
         "series_end": "2012-06-24",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/8/41125.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1470823732",
         "my_tags": []
      },
      {
         "series_animedb_id": "11757",
         "series_title": "Sword Art Online",
         "series_synonyms": "S.A.O; SAO; Sword Art Online",
         "series_type": "1",
         "series_episodes": "25",
         "series_status": "2",
         "series_start": "2012-07-08",
         "series_end": "2012-12-23",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/11/39717.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1452673622",
         "my_tags": []
      },
      {
         "series_animedb_id": "11771",
         "series_title": "Kuroko no Basket",
         "series_synonyms": "Kuroko no Basuke; Kuroko's Basketball",
         "series_type": "1",
         "series_episodes": "25",
         "series_status": "2",
         "series_start": "2012-04-08",
         "series_end": "2012-09-22",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/11/50453.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "4",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1475264123",
         "my_tags": []
      },
      {
         "series_animedb_id": "11843",
         "series_title": "Danshi Koukousei no Nichijou",
         "series_synonyms": "Danshi Koukousei no Nichijou; Daily Lives of High School Boys",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2012-01-10",
         "series_end": "2012-03-27",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/3/33257.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "1",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1484428980",
         "my_tags": []
      },
      {
         "series_animedb_id": "11887",
         "series_title": "Kokoro Connect",
         "series_synonyms": "Kokoroco; Kokoro Connect",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2012-07-08",
         "series_end": "2012-09-30",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/2/39665.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "1",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1483456924",
         "my_tags": []
      },
      {
         "series_animedb_id": "12189",
         "series_title": "Hyouka",
         "series_synonyms": "Hyou-ka; Hyouka: You can't escape; Hyou-ka: You can't escape; Hyoka",
         "series_type": "1",
         "series_episodes": "22",
         "series_status": "2",
         "series_start": "2012-04-23",
         "series_end": "2012-09-17",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/13/50521.jpg",
         "my_id": "0",
         "my_watched_episodes": "22",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "10",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1482003948",
         "my_tags": []
      },
      {
         "series_animedb_id": "12355",
         "series_title": "Ookami Kodomo no Ame to Yuki",
         "series_synonyms": "The Wolf Children Ame and Yuki; Wolf Children",
         "series_type": "3",
         "series_episodes": "1",
         "series_status": "2",
         "series_start": "2012-07-21",
         "series_end": "2012-07-21",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/9/35721.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1462783577",
         "my_tags": []
      },
      {
         "series_animedb_id": "12403",
         "series_title": "Yuru Yuri♪♪",
         "series_synonyms": "Yuru Yuri S2; YuruYuri: Happy Go Lily ♪♪",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2012-07-03",
         "series_end": "2012-09-18",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/8/75174.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "3",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1473237338",
         "my_tags": []
      },
      {
         "series_animedb_id": "12679",
         "series_title": "Joshiraku",
         "series_synonyms": "Rakugo Girls; Joshiraku",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2012-07-06",
         "series_end": "2012-09-28",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/8/48925.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "1",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1477233832",
         "my_tags": []
      },
      {
         "series_animedb_id": "13125",
         "series_title": "Shinsekai yori",
         "series_synonyms": "Shin Sekai yori; From the New World",
         "series_type": "1",
         "series_episodes": "25",
         "series_status": "2",
         "series_start": "2012-09-29",
         "series_end": "2013-03-23",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/8/41993.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1461187483",
         "my_tags": []
      },
      {
         "series_animedb_id": "13469",
         "series_title": "Hyouka: Motsubeki Mono wa",
         "series_synonyms": "Hyouka Episode 11.5; Hyouka OVA; Hyou-ka OVA; Hyouka: You can't escape OVA; Hyou-ka: You can't escape OVA; Hyoka OVA",
         "series_type": "2",
         "series_episodes": "1",
         "series_status": "2",
         "series_start": "2012-07-08",
         "series_end": "2012-07-08",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/6/50363.jpg",
         "my_id": "0",
         "my_watched_episodes": "1",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1481828610",
         "my_tags": []
      },
      {
         "series_animedb_id": "13601",
         "series_title": "Psycho-Pass",
         "series_synonyms": "Psychopath; Psycho-Pass",
         "series_type": "1",
         "series_episodes": "22",
         "series_status": "2",
         "series_start": "2012-10-12",
         "series_end": "2013-03-22",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/5/43399.jpg",
         "my_id": "0",
         "my_watched_episodes": "6",
         "my_start_date": "2016-01-27",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "3",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1454588822",
         "my_tags": []
      },
      {
         "series_animedb_id": "13659",
         "series_title": "Ore no Imouto ga Konnani Kawaii Wake ga Nai.",
         "series_synonyms": "My Little Sister Can't Be This Cute 2; Ore no Imouto ga Konna ni Kawaii Wake ga Nai 2; Oreimo 2",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2013-04-07",
         "series_end": "2013-06-30",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/8/45769.jpg",
         "my_id": "0",
         "my_watched_episodes": "13",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1477695981",
         "my_tags": []
      },
      {
         "series_animedb_id": "13759",
         "series_title": "Sakurasou no Pet na Kanojo",
         "series_synonyms": "Sakura-sou no Pet na Kanojo; The Pet Girl of Sakurasou",
         "series_type": "1",
         "series_episodes": "24",
         "series_status": "2",
         "series_start": "2012-10-09",
         "series_end": "2013-03-26",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/4/43643.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "1",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1461743143",
         "my_tags": []
      },
      {
         "series_animedb_id": "14227",
         "series_title": "Tonari no Kaibutsu-kun",
         "series_synonyms": "Tonari no Kaibutsukun; The Monster Next Door; My Neighbor Monster-kun; My Little Monster",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2012-10-02",
         "series_end": "2012-12-25",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/4/39779.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1474571886",
         "my_tags": []
      },
      {
         "series_animedb_id": "14345",
         "series_title": "Btooom!",
         "series_synonyms": "; BTOOOM!",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2012-10-04",
         "series_end": "2012-12-20",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/4/40977.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1470219877",
         "my_tags": []
      },
      {
         "series_animedb_id": "14349",
         "series_title": "Little Witch Academia",
         "series_synonyms": "Wakate Animator Ikusei Project; 2012 Young Animator Training Project; Anime Mirai 2012; LWA",
         "series_type": "3",
         "series_episodes": "1",
         "series_status": "2",
         "series_start": "2013-03-02",
         "series_end": "2013-03-02",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/2/42989.jpg",
         "my_id": "0",
         "my_watched_episodes": "1",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "8",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1474574536",
         "my_tags": []
      },
      {
         "series_animedb_id": "14467",
         "series_title": "K",
         "series_synonyms": "K-Project; K -eine weitere Geschichte-; K",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2012-10-05",
         "series_end": "2012-12-28",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/3/47607.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1453120861",
         "my_tags": []
      },
      {
         "series_animedb_id": "14713",
         "series_title": "Kamisama Hajimemashita",
         "series_synonyms": "Kami-sama Hajimemashita; Kamisama Kiss",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2012-10-02",
         "series_end": "2012-12-25",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/5/67999.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1470859617",
         "my_tags": []
      },
      {
         "series_animedb_id": "14741",
         "series_title": "Chuunibyou demo Koi ga Shitai!",
         "series_synonyms": "Chu-2 Byo demo Koi ga Shitai!; Regardless of My Adolescent Delusions of Grandeur, I Want a Date!; Love, Chunibyo & Other Delusions!",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2012-10-04",
         "series_end": "2012-12-20",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/12/46931.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "8",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1462230353",
         "my_tags": []
      },
      {
         "series_animedb_id": "14813",
         "series_title": "Yahari Ore no Seishun Love Comedy wa Machigatteiru.",
         "series_synonyms": "Oregairu; My youth romantic comedy is wrong as I expected.; My Teen Romantic Comedy SNAFU",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2013-04-05",
         "series_end": "2013-06-28",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/11/49459.jpg",
         "my_id": "0",
         "my_watched_episodes": "2",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "3",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1473186664",
         "my_tags": []
      },
      {
         "series_animedb_id": "14829",
         "series_title": "Fate/kaleid liner Prisma☆Illya",
         "series_synonyms": "; Fate/Kaleid Liner Prisma Illya",
         "series_type": "1",
         "series_episodes": "10",
         "series_status": "2",
         "series_start": "2013-07-13",
         "series_end": "2013-09-14",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/7/52603.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1473954955",
         "my_tags": []
      },
      {
         "series_animedb_id": "15051",
         "series_title": "Love Live! School Idol Project",
         "series_synonyms": "; Love Live! School Idol Project",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2013-01-06",
         "series_end": "2013-03-31",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/11/56849.jpg",
         "my_id": "0",
         "my_watched_episodes": "1",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "3",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1469647750",
         "my_tags": []
      },
      {
         "series_animedb_id": "15315",
         "series_title": "Mondaiji-tachi ga Isekai kara Kuru Sou Desu yo?",
         "series_synonyms": "Mondaiji-tachi ga Isekai kara Kuru Sou Desu yo?; Problem children are coming from another world, aren't they?",
         "series_type": "1",
         "series_episodes": "10",
         "series_status": "2",
         "series_start": "2013-01-12",
         "series_end": "2013-03-16",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/12/43369.jpg",
         "my_id": "0",
         "my_watched_episodes": "10",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "7",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1468964684",
         "my_tags": []
      },
      {
         "series_animedb_id": "15689",
         "series_title": "Nekomonogatari: Kuro",
         "series_synonyms": "Nekomonogatari Black: Tsubasa Family; Nekomonogatari Black",
         "series_type": "1",
         "series_episodes": "4",
         "series_status": "2",
         "series_start": "2012-12-31",
         "series_end": "2012-12-31",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/9/59247.jpg",
         "my_id": "0",
         "my_watched_episodes": "4",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "10",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1460406748",
         "my_tags": []
      },
      {
         "series_animedb_id": "15809",
         "series_title": "Hataraku Maou-sama!",
         "series_synonyms": "Hataraku Maou-sama!; The Devil is a Part-Timer!",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2013-04-04",
         "series_end": "2013-06-27",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/3/50177.jpg",
         "my_id": "0",
         "my_watched_episodes": "13",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "8",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1470606202",
         "my_tags": []
      },
      {
         "series_animedb_id": "15911",
         "series_title": "Yuyushiki",
         "series_synonyms": "Yuyu-shiki; Yuyushiki",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2013-04-10",
         "series_end": "2013-06-26",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/12/48747.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1482872977",
         "my_tags": []
      },
      {
         "series_animedb_id": "16067",
         "series_title": "Nagi no Asukara",
         "series_synonyms": "Nagi no Asu Kara; Earth color of a calm; Nagiasu; A Lull in the Sea",
         "series_type": "1",
         "series_episodes": "26",
         "series_status": "2",
         "series_start": "2013-10-03",
         "series_end": "2014-04-03",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/7/53549.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1470961854",
         "my_tags": []
      },
      {
         "series_animedb_id": "16241",
         "series_title": "Yondemasu yo, Azazel-san. Z",
         "series_synonyms": "Yondemasu yo, Azazel-san. 2nd Season; You're Being Summoned, Azazel Z",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2013-04-07",
         "series_end": "2013-06-30",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/3/48957.jpg",
         "my_id": "0",
         "my_watched_episodes": "13",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "7",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1468505194",
         "my_tags": []
      },
      {
         "series_animedb_id": "16353",
         "series_title": "Love Lab",
         "series_synonyms": "Renai Lab; Love Lab",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2013-07-05",
         "series_end": "2013-09-27",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/12/50257.jpg",
         "my_id": "0",
         "my_watched_episodes": "13",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "8",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1481054964",
         "my_tags": []
      },
      {
         "series_animedb_id": "16417",
         "series_title": "Tamako Market",
         "series_synonyms": "; Tamako Market",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2013-01-10",
         "series_end": "2013-03-28",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/6/79594.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "10",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1473237309",
         "my_tags": []
      },
      {
         "series_animedb_id": "16498",
         "series_title": "Shingeki no Kyojin",
         "series_synonyms": "AoT; Attack on Titan",
         "series_type": "1",
         "series_episodes": "25",
         "series_status": "2",
         "series_start": "2013-04-07",
         "series_end": "2013-09-29",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/10/47347.jpg",
         "my_id": "0",
         "my_watched_episodes": "25",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1452968066",
         "my_tags": []
      },
      {
         "series_animedb_id": "16662",
         "series_title": "Kaze Tachinu",
         "series_synonyms": "Kaze Tachinu; The Wind Rises",
         "series_type": "3",
         "series_episodes": "1",
         "series_status": "2",
         "series_start": "2013-07-20",
         "series_end": "2013-07-20",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/8/52353.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1471543076",
         "my_tags": []
      },
      {
         "series_animedb_id": "16732",
         "series_title": "Kiniro Mosaic",
         "series_synonyms": "Kinmosa; Golden Mosaic; KINMOZA!",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2013-07-06",
         "series_end": "2013-09-21",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/8/51379.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "8",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1482875952",
         "my_tags": []
      },
      {
         "series_animedb_id": "16742",
         "series_title": "Watashi ga Motenai no wa Dou Kangaetemo Omaera ga Warui!",
         "series_synonyms": "Watashi ga Motenai no wa Dou Kangaete mo Omaera ga Warui!; It's Not My Fault That I'm Not Popular!; WataMote; WataMote: No Matter How I Look At It, It's You Guys' Fault I'm Unpopular!",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2013-07-09",
         "series_end": "2013-09-24",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/12/51619.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "1",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1483388945",
         "my_tags": []
      },
      {
         "series_animedb_id": "16762",
         "series_title": "Mirai Nikki Redial",
         "series_synonyms": "Mirai Nikki OVA; The Future Diary Redial",
         "series_type": "2",
         "series_episodes": "1",
         "series_status": "2",
         "series_start": "2013-06-19",
         "series_end": "2013-06-19",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/3/53247.jpg",
         "my_id": "0",
         "my_watched_episodes": "1",
         "my_start_date": "0000-00-00",
         "my_finish_date": "2016-04-16",
         "my_score": "0",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1460808633",
         "my_tags": []
      },
      {
         "series_animedb_id": "16782",
         "series_title": "Kotonoha no Niwa",
         "series_synonyms": "Koto no Ha no Niwa; The Garden of Kotonoha; The Garden of Words",
         "series_type": "3",
         "series_episodes": "1",
         "series_status": "2",
         "series_start": "2013-05-31",
         "series_end": "2013-05-31",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/8/79676.jpg",
         "my_id": "0",
         "my_watched_episodes": "1",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "9",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1477237173",
         "my_tags": []
      },
      {
         "series_animedb_id": "16918",
         "series_title": "Gin no Saji",
         "series_synonyms": "; Silver Spoon",
         "series_type": "1",
         "series_episodes": "11",
         "series_status": "2",
         "series_start": "2013-07-12",
         "series_end": "2013-09-20",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/6/49237.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1462045911",
         "my_tags": []
      },
      {
         "series_animedb_id": "17074",
         "series_title": "Monogatari Series: Second Season",
         "series_synonyms": "Nekomonogatari: Shiro; Kabukimonogatari: Mayoi Jianshi; Otorimonogatari; Onimonogatari; Koimonogatari; Monogatari Series: Second Season",
         "series_type": "1",
         "series_episodes": "26",
         "series_status": "2",
         "series_start": "2013-07-07",
         "series_end": "2013-12-29",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/3/52133.jpg",
         "my_id": "0",
         "my_watched_episodes": "26",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1462045729",
         "my_tags": []
      },
      {
         "series_animedb_id": "17082",
         "series_title": "Aiura",
         "series_synonyms": "; Aiura",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2013-04-10",
         "series_end": "2013-06-26",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/4/60699.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "8",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1482017066",
         "my_tags": []
      },
      {
         "series_animedb_id": "17265",
         "series_title": "Log Horizon",
         "series_synonyms": "; Log Horizon",
         "series_type": "1",
         "series_episodes": "25",
         "series_status": "2",
         "series_start": "2013-10-05",
         "series_end": "2014-03-22",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/6/60613.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1452673637",
         "my_tags": []
      },
      {
         "series_animedb_id": "17549",
         "series_title": "Non Non Biyori",
         "series_synonyms": "; Non Non Biyori",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2013-10-08",
         "series_end": "2013-12-24",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/2/51581.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "10",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1461347242",
         "my_tags": []
      },
      {
         "series_animedb_id": "17909",
         "series_title": "Uchouten Kazoku",
         "series_synonyms": "Uchoten Kazoku; The Eccentric Family",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2013-07-07",
         "series_end": "2013-09-29",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/4/50889.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1474214844",
         "my_tags": []
      },
      {
         "series_animedb_id": "18119",
         "series_title": "Servant x Service",
         "series_synonyms": "; Servant x Service",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2013-07-05",
         "series_end": "2013-09-27",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/13/51579.jpg",
         "my_id": "0",
         "my_watched_episodes": "13",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "8",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1470126562",
         "my_tags": []
      },
      {
         "series_animedb_id": "18153",
         "series_title": "Kyoukai no Kanata",
         "series_synonyms": "Beyond the Horizon; Kyokai no Kanata; Beyond the Boundary",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2013-10-03",
         "series_end": "2013-12-19",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/4/54397.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1472593036",
         "my_tags": []
      },
      {
         "series_animedb_id": "18441",
         "series_title": "Blood Lad: Wagahai wa Neko de wa Nai",
         "series_synonyms": "; Blood Lad OVA",
         "series_type": "2",
         "series_episodes": "1",
         "series_status": "2",
         "series_start": "2013-12-04",
         "series_end": "2013-12-04",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/2/52611.jpg",
         "my_id": "0",
         "my_watched_episodes": "1",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "8",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1472073783",
         "my_tags": []
      },
      {
         "series_animedb_id": "18497",
         "series_title": "Yozakura Quartet: Hana no Uta",
         "series_synonyms": "Yozakura Quartet: Hana no Uta",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2013-10-06",
         "series_end": "2013-12-29",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/5/52563.jpg",
         "my_id": "0",
         "my_watched_episodes": "13",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "9",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1477307180",
         "my_tags": []
      },
      {
         "series_animedb_id": "18499",
         "series_title": "Yozakura Quartet: Tsuki ni Naku",
         "series_synonyms": [],
         "series_type": "2",
         "series_episodes": "3",
         "series_status": "2",
         "series_start": "2013-10-09",
         "series_end": "2014-11-07",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/3/49489.jpg",
         "my_id": "0",
         "my_watched_episodes": "3",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "9",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1477307177",
         "my_tags": []
      },
      {
         "series_animedb_id": "18507",
         "series_title": "Free!",
         "series_synonyms": "フリー！; Free! - Iwatobi Swim Club",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2013-07-04",
         "series_end": "2013-09-26",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/6/51107.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "7",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1473115776",
         "my_tags": []
      },
      {
         "series_animedb_id": "18671",
         "series_title": "Chuunibyou demo Koi ga Shitai! Ren",
         "series_synonyms": "Chuunibyou demo Koi ga Shitai! 2; Chu-2 Byo demo Koi ga Shitai! Ren; Love, Chunibyo & Other Delusions!: Heart Throb",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2014-01-09",
         "series_end": "2014-03-27",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/7/56643.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1462229880",
         "my_tags": []
      },
      {
         "series_animedb_id": "18677",
         "series_title": "Yuusha ni Narenakatta Ore wa Shibushibu Shuushoku wo Ketsui Shimashita.",
         "series_synonyms": "Yu-sibu; Yusibu; Yuushibu; I Couldn't Become a Hero, So I Reluctantly Decided to Get a Job.",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2013-10-05",
         "series_end": "2013-12-21",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/13/54389.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1470576903",
         "my_tags": []
      },
      {
         "series_animedb_id": "18679",
         "series_title": "Kill la Kill",
         "series_synonyms": "KLK; Dressed to Kill; KILL la KILL",
         "series_type": "1",
         "series_episodes": "24",
         "series_status": "2",
         "series_start": "2013-10-04",
         "series_end": "2014-03-28",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/8/75514.jpg",
         "my_id": "0",
         "my_watched_episodes": "24",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "10",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1476829338",
         "my_tags": []
      },
      {
         "series_animedb_id": "18897",
         "series_title": "Nisekoi",
         "series_synonyms": "Nisekoi; Nisekoi: False Love",
         "series_type": "1",
         "series_episodes": "20",
         "series_status": "2",
         "series_start": "2014-01-11",
         "series_end": "2014-05-24",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/13/75587.jpg",
         "my_id": "0",
         "my_watched_episodes": "20",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "8",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1483185753",
         "my_tags": []
      },
      {
         "series_animedb_id": "19369",
         "series_title": "Outbreak Company",
         "series_synonyms": "; Outbreak Company",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2013-10-04",
         "series_end": "2013-12-20",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/7/54343.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1473757576",
         "my_tags": []
      },
      {
         "series_animedb_id": "19489",
         "series_title": "Little Witch Academia: Mahoujikake no Parade",
         "series_synonyms": "LWA 2; Little Witch Academia 2; Little Witch Academia: The Enchanted Parade",
         "series_type": "3",
         "series_episodes": "1",
         "series_status": "2",
         "series_start": "2015-10-09",
         "series_end": "2015-10-09",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/12/75752.jpg",
         "my_id": "0",
         "my_watched_episodes": "1",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "9",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1484171240",
         "my_tags": []
      },
      {
         "series_animedb_id": "19703",
         "series_title": "Kyousou Giga (TV)",
         "series_synonyms": "Kyousougiga (TV); Kyousogiga (TV); Kyousougiga",
         "series_type": "1",
         "series_episodes": "10",
         "series_status": "2",
         "series_start": "2013-10-10",
         "series_end": "2013-12-19",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/13/55645.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1477315526",
         "my_tags": []
      },
      {
         "series_animedb_id": "19815",
         "series_title": "No Game No Life",
         "series_synonyms": "NGNL; No Game, No Life",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2014-04-09",
         "series_end": "2014-06-25",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/5/65187.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "2016-02-04",
         "my_score": "0",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1454595847",
         "my_tags": []
      },
      {
         "series_animedb_id": "20031",
         "series_title": "D-Frag!",
         "series_synonyms": "D-Frag!; D-Frag!",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2014-01-07",
         "series_end": "2014-03-25",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/2/53407.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "8",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1482348154",
         "my_tags": []
      },
      {
         "series_animedb_id": "20047",
         "series_title": "Sakura Trick",
         "series_synonyms": "; Sakura Trick",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2014-01-10",
         "series_end": "2014-03-28",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/2/56189.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "8",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1480343647",
         "my_tags": []
      },
      {
         "series_animedb_id": "20057",
         "series_title": "Space☆Dandy",
         "series_synonyms": "; Space Dandy",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2014-01-05",
         "series_end": "2014-03-27",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/4/56611.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1471115738",
         "my_tags": []
      },
      {
         "series_animedb_id": "20507",
         "series_title": "Noragami",
         "series_synonyms": "Stray God; Noragami",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2014-01-05",
         "series_end": "2014-03-23",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/9/77809.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "9",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1461840311",
         "my_tags": []
      },
      {
         "series_animedb_id": "20541",
         "series_title": "Mikakunin de Shinkoukei",
         "series_synonyms": "; Engaged to the Unidentified",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2014-01-09",
         "series_end": "2014-03-27",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/10/75249.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "8",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1477425115",
         "my_tags": []
      },
      {
         "series_animedb_id": "20583",
         "series_title": "Haikyuu!!",
         "series_synonyms": "High Kyuu!!, HQ!!; Haikyu!!",
         "series_type": "1",
         "series_episodes": "25",
         "series_status": "2",
         "series_start": "2014-04-06",
         "series_end": "2014-09-21",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/7/76014.jpg",
         "my_id": "0",
         "my_watched_episodes": "25",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "9",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1475503075",
         "my_tags": []
      },
      {
         "series_animedb_id": "20709",
         "series_title": "Sabagebu!",
         "series_synonyms": "Survival Game Club!; Sabagebu! -Survival Game Club!-",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2014-07-06",
         "series_end": "2014-09-21",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/13/60207.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1482948951",
         "my_tags": []
      },
      {
         "series_animedb_id": "20787",
         "series_title": "Black Bullet",
         "series_synonyms": "; Black Bullet",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2014-04-08",
         "series_end": "2014-07-01",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/6/57947.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1461162058",
         "my_tags": []
      },
      {
         "series_animedb_id": "20973",
         "series_title": "Sekai Seifuku: Bouryaku no Zvezda",
         "series_synonyms": "Sekai Seifuku: Bouryaku no Zvezda; World Conquest Zvezda Plot",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2014-01-12",
         "series_end": "2014-03-30",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/2/56133.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1479070141",
         "my_tags": []
      },
      {
         "series_animedb_id": "21085",
         "series_title": "Witch Craft Works",
         "series_synonyms": "Witchcraft Works",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2014-01-05",
         "series_end": "2014-03-23",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/12/55693.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1471099945",
         "my_tags": []
      },
      {
         "series_animedb_id": "21273",
         "series_title": "Gochuumon wa Usagi Desu ka?",
         "series_synonyms": "GochiUsa; Is the order a rabbit?",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2014-04-10",
         "series_end": "2014-06-26",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/6/79600.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "7",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1468790916",
         "my_tags": []
      },
      {
         "series_animedb_id": "21327",
         "series_title": "Isshuukan Friends.",
         "series_synonyms": "Isshuukan Friends.; One Week Friends",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2014-04-07",
         "series_end": "2014-06-23",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/6/61891.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1471100017",
         "my_tags": []
      },
      {
         "series_animedb_id": "21507",
         "series_title": "Soul Eater NOT!",
         "series_synonyms": "Soul Eater Not!",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2014-04-09",
         "series_end": "2014-07-02",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/8/61889.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1473955032",
         "my_tags": []
      },
      {
         "series_animedb_id": "21603",
         "series_title": "Mekakucity Actors",
         "series_synonyms": "Mekaku City Actors; Kagerou Project; MEKAKUCITY ACTORS",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2014-04-13",
         "series_end": "2014-06-29",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/11/61519.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1474273770",
         "my_tags": []
      },
      {
         "series_animedb_id": "21647",
         "series_title": "Tamako Love Story",
         "series_synonyms": "Tamako Market Movie",
         "series_type": "3",
         "series_episodes": "1",
         "series_status": "2",
         "series_start": "2014-04-26",
         "series_end": "2014-04-26",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/5/60473.jpg",
         "my_id": "0",
         "my_watched_episodes": "1",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "10",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1473020637",
         "my_tags": []
      },
      {
         "series_animedb_id": "21659",
         "series_title": "Kill la Kill Special",
         "series_synonyms": "Kill la Kill Tokubetsu-hen",
         "series_type": "4",
         "series_episodes": "1",
         "series_status": "2",
         "series_start": "2014-09-03",
         "series_end": "2014-09-03",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/12/73654.jpg",
         "my_id": "0",
         "my_watched_episodes": "1",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1476829363",
         "my_tags": []
      },
      {
         "series_animedb_id": "21855",
         "series_title": "Hanamonogatari",
         "series_synonyms": "Monogatari Series: Second Season +α; Hanamonogatari",
         "series_type": "1",
         "series_episodes": "5",
         "series_status": "2",
         "series_start": "2014-08-16",
         "series_end": "2014-08-16",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/13/65755.jpg",
         "my_id": "0",
         "my_watched_episodes": "5",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "10",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1462200815",
         "my_tags": []
      },
      {
         "series_animedb_id": "21863",
         "series_title": "Mangaka-san to Assistant-san to The Animation",
         "series_synonyms": "Mangaka-san to Assistant-san to; ManAshi; The Comic Artist and His Assistants",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2014-04-08",
         "series_end": "2014-06-24",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/11/62219.jpg",
         "my_id": "0",
         "my_watched_episodes": "1",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "1",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1483536446",
         "my_tags": []
      },
      {
         "series_animedb_id": "22145",
         "series_title": "Kuroshitsuji: Book of Circus",
         "series_synonyms": "Kuroshitsuji Circus Hen; Kuroshitsuji Shin Series; Black Butler 3; Kuroshitsuji III; Black Butler: Book of Circus",
         "series_type": "1",
         "series_episodes": "10",
         "series_status": "2",
         "series_start": "2014-07-11",
         "series_end": "2014-09-12",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/6/64811.jpg",
         "my_id": "0",
         "my_watched_episodes": "10",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "8",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1471470977",
         "my_tags": []
      },
      {
         "series_animedb_id": "22147",
         "series_title": "Amagi Brilliant Park",
         "series_synonyms": "Amaburi; Amagi Brilliant Park",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2014-10-07",
         "series_end": "2014-12-26",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/3/79593.jpg",
         "my_id": "0",
         "my_watched_episodes": "13",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "8",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1473545148",
         "my_tags": []
      },
      {
         "series_animedb_id": "22199",
         "series_title": "Akame ga Kill!",
         "series_synonyms": "Akame ga Kiru!; Akame ga Kill!",
         "series_type": "1",
         "series_episodes": "24",
         "series_status": "2",
         "series_start": "2014-07-07",
         "series_end": "2014-12-15",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/6/78438.jpg",
         "my_id": "0",
         "my_watched_episodes": "24",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "8",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1452673802",
         "my_tags": []
      },
      {
         "series_animedb_id": "22265",
         "series_title": "Free!: Eternal Summer",
         "series_synonyms": "Free! - Iwatobi Swim Club 2; Free! 2nd Season; Free! - Eternal Summer",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2014-07-03",
         "series_end": "2014-09-25",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/10/64097.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1473115835",
         "my_tags": []
      },
      {
         "series_animedb_id": "22297",
         "series_title": "Fate/stay night: Unlimited Blade Works",
         "series_synonyms": "Fate/stay night (2014); Fate - Stay Night; Fate/stay night [Unlimited Blade Works]",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2014-10-12",
         "series_end": "2014-12-28",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/12/67333.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1470823686",
         "my_tags": []
      },
      {
         "series_animedb_id": "22319",
         "series_title": "Tokyo Ghoul",
         "series_synonyms": "Tokyo Kushu; Toukyou Kushu; Toukyou Ghoul; Tokyo Ghoul",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2014-07-04",
         "series_end": "2014-09-19",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/5/64449.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "8",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1452673406",
         "my_tags": []
      },
      {
         "series_animedb_id": "22535",
         "series_title": "Kiseijuu: Sei no Kakuritsu",
         "series_synonyms": "Parasite; Parasitic Beasts; Parasyte; Parasyte -the maxim-",
         "series_type": "1",
         "series_episodes": "24",
         "series_status": "2",
         "series_start": "2014-10-09",
         "series_end": "2015-03-26",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/3/73178.jpg",
         "my_id": "0",
         "my_watched_episodes": "24",
         "my_start_date": "0000-00-00",
         "my_finish_date": "2016-01-16",
         "my_score": "8",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1452973493",
         "my_tags": []
      },
      {
         "series_animedb_id": "22789",
         "series_title": "Barakamon",
         "series_synonyms": "Barakamon; Barakamon",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2014-07-06",
         "series_end": "2014-09-28",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/5/59321.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "10",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1462189367",
         "my_tags": []
      },
      {
         "series_animedb_id": "22839",
         "series_title": "Cross Road",
         "series_synonyms": "Crossroad",
         "series_type": "4",
         "series_episodes": "1",
         "series_status": "2",
         "series_start": "2014-02-25",
         "series_end": "2014-02-25",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/12/59379.jpg",
         "my_id": "0",
         "my_watched_episodes": "1",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "9",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1477083677",
         "my_tags": []
      },
      {
         "series_animedb_id": "23251",
         "series_title": "Gugure! Kokkuri-san",
         "series_synonyms": "GuguKoku; GUGURE! KOKKURI-SAN",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2014-10-06",
         "series_end": "2014-12-22",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/6/65665.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "1",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1483389132",
         "my_tags": []
      },
      {
         "series_animedb_id": "23273",
         "series_title": "Shigatsu wa Kimi no Uso",
         "series_synonyms": "; Your Lie in April",
         "series_type": "1",
         "series_episodes": "22",
         "series_status": "2",
         "series_start": "2014-10-10",
         "series_end": "2015-03-20",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/3/67177.jpg",
         "my_id": "0",
         "my_watched_episodes": "22",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "10",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1482254426",
         "my_tags": []
      },
      {
         "series_animedb_id": "23283",
         "series_title": "Zankyou no Terror",
         "series_synonyms": "Terror in Tokyo; Terror of Resonance; Terror in Resonance",
         "series_type": "1",
         "series_episodes": "11",
         "series_status": "2",
         "series_start": "2014-07-11",
         "series_end": "2014-09-26",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/4/64447.jpg",
         "my_id": "0",
         "my_watched_episodes": "11",
         "my_start_date": "2016-01-19",
         "my_finish_date": "2016-01-23",
         "my_score": "0",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1453540546",
         "my_tags": []
      },
      {
         "series_animedb_id": "23289",
         "series_title": "Gekkan Shoujo Nozaki-kun",
         "series_synonyms": "Gekkan Shoujo Nozaki-kun; Monthly Girls' Nozaki-kun",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2014-07-07",
         "series_end": "2014-09-22",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/5/66083.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1471100004",
         "my_tags": []
      },
      {
         "series_animedb_id": "23399",
         "series_title": "Minami no Shima no Dera-chan",
         "series_synonyms": "Tamako Market; Tamako Love Story",
         "series_type": "3",
         "series_episodes": "1",
         "series_status": "2",
         "series_start": "2014-04-26",
         "series_end": "2014-04-26",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/6/60437.jpg",
         "my_id": "0",
         "my_watched_episodes": "1",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "10",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1473020628",
         "my_tags": []
      },
      {
         "series_animedb_id": "23623",
         "series_title": "Non Non Biyori Repeat",
         "series_synonyms": "Non Non Biyori 2nd Season; Non Non Biyori Second Season; Non Non Biyori Repeat",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2015-07-07",
         "series_end": "2015-09-22",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/9/75105.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "10",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1462282882",
         "my_tags": []
      },
      {
         "series_animedb_id": "23755",
         "series_title": "Nanatsu no Taizai",
         "series_synonyms": "Nanatsu no Taizai; The Seven Deadly Sins",
         "series_type": "1",
         "series_episodes": "24",
         "series_status": "2",
         "series_start": "2014-10-05",
         "series_end": "2015-03-29",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/8/65409.jpg",
         "my_id": "0",
         "my_watched_episodes": "24",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1452689381",
         "my_tags": []
      },
      {
         "series_animedb_id": "23847",
         "series_title": "Yahari Ore no Seishun Love Comedy wa Machigatteiru. Zoku",
         "series_synonyms": "Oregairu 2; My Teen Romantic Comedy SNAFU 2; Yahari Ore no Seishun Love Comedy wa Machigatteiru. Second Season; Yahari Ore no Seishun Love Comedy wa Machigatteiru. 2nd Season; My Teen Romantic Comedy SNAFU TOO!",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2015-04-03",
         "series_end": "2015-06-26",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/11/75376.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "4",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1484087857",
         "my_tags": []
      },
      {
         "series_animedb_id": "24031",
         "series_title": "Denki-gai no Honya-san",
         "series_synonyms": "Denki Machi no Honya-san; Denkigai no Honya-san; Denki-gai",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2014-10-02",
         "series_end": "2014-12-18",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/2/65339.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "7",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1470752429",
         "my_tags": []
      },
      {
         "series_animedb_id": "24439",
         "series_title": "Kekkai Sensen",
         "series_synonyms": "Bloodline Battlefront; Blood Blockade Battlefront",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2015-04-05",
         "series_end": "2015-10-04",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/12/73559.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1480448316",
         "my_tags": []
      },
      {
         "series_animedb_id": "24765",
         "series_title": "Gakkougurashi!",
         "series_synonyms": "Gakkou Gurashi!; School-Live!",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2015-07-09",
         "series_end": "2015-09-24",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/5/75082.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "4",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1481381741",
         "my_tags": []
      },
      {
         "series_animedb_id": "24833",
         "series_title": "Ansatsu Kyoushitsu (TV)",
         "series_synonyms": "Ansatsu Kyoushitsu; Assassination Classroom",
         "series_type": "1",
         "series_episodes": "22",
         "series_status": "2",
         "series_start": "2015-01-10",
         "series_end": "2015-06-20",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/5/75639.jpg",
         "my_id": "0",
         "my_watched_episodes": "22",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "10",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1469816613",
         "my_tags": []
      },
      {
         "series_animedb_id": "25159",
         "series_title": "Inou-Battle wa Nichijou-kei no Naka de",
         "series_synonyms": "InoBato; Inou-Battle in the Usually Daze.; Inou Battle Within Everyday Life; When Supernatural Battles Became Commonplace",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2014-10-07",
         "series_end": "2014-12-23",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/8/67047.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1478346396",
         "my_tags": []
      },
      {
         "series_animedb_id": "25777",
         "series_title": "Shingeki no Kyojin Season 2",
         "series_synonyms": "; Attack on Titan Season 2",
         "series_type": "1",
         "series_episodes": "0",
         "series_status": "3",
         "series_start": "2017-04-00",
         "series_end": "0000-00-00",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/11/80720.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1453021629",
         "my_tags": []
      },
      {
         "series_animedb_id": "25835",
         "series_title": "Shirobako",
         "series_synonyms": "White Box; Shirobako",
         "series_type": "1",
         "series_episodes": "24",
         "series_status": "2",
         "series_start": "2014-10-09",
         "series_end": "2015-03-26",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/6/68021.jpg",
         "my_id": "0",
         "my_watched_episodes": "24",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "10",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1474493155",
         "my_tags": []
      },
      {
         "series_animedb_id": "25859",
         "series_title": "Re-Kan!",
         "series_synonyms": "; RE-KAN!",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2015-04-03",
         "series_end": "2015-06-26",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/11/72544.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1471099984",
         "my_tags": []
      },
      {
         "series_animedb_id": "25867",
         "series_title": "Rolling☆Girls",
         "series_synonyms": "; The Rolling Girls",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2015-01-11",
         "series_end": "2015-03-29",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/12/71527.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1477315480",
         "my_tags": []
      },
      {
         "series_animedb_id": "25879",
         "series_title": "Working!!!",
         "series_synonyms": "Working!! 3rd Season; Working!! Third Season; Wagnaria!!3",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2015-07-05",
         "series_end": "2015-09-27",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/7/73886.jpg",
         "my_id": "0",
         "my_watched_episodes": "13",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "10",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1470425187",
         "my_tags": []
      },
      {
         "series_animedb_id": "27787",
         "series_title": "Nisekoi:",
         "series_synonyms": "Nisekoi 2nd Season; Nisekoi Second Season; Nisekoi: False Love",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2015-04-10",
         "series_end": "2015-06-26",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/13/72626.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "8",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1483099078",
         "my_tags": []
      },
      {
         "series_animedb_id": "27821",
         "series_title": "Fate/stay night: Unlimited Blade Works - Prologue",
         "series_synonyms": "Fate/stay night (2014) Episode 00; Fate/stay night: Unlimited Blade Works - Prologue",
         "series_type": "4",
         "series_episodes": "1",
         "series_status": "2",
         "series_start": "2014-10-05",
         "series_end": "2014-10-05",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/9/67425.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1470823706",
         "my_tags": []
      },
      {
         "series_animedb_id": "27989",
         "series_title": "Hibike! Euphonium",
         "series_synonyms": "Hibike! Euphonium; Sound! Euphonium",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2015-04-08",
         "series_end": "2015-07-01",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/6/72445.jpg",
         "my_id": "0",
         "my_watched_episodes": "13",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "9",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1483479587",
         "my_tags": []
      },
      {
         "series_animedb_id": "28025",
         "series_title": "Tsukimonogatari",
         "series_synonyms": "Tsukimonogatari: Yotsugi Doll; Monogatari Final Season; Tsukimonogatari",
         "series_type": "1",
         "series_episodes": "4",
         "series_status": "2",
         "series_start": "2014-12-31",
         "series_end": "2014-12-31",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/6/68259.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "1",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1462200854",
         "my_tags": []
      },
      {
         "series_animedb_id": "28121",
         "series_title": "Dungeon ni Deai wo Motomeru no wa Machigatteiru Darou ka",
         "series_synonyms": "DanMachi; Is It Wrong That I Want to Meet You in a Dungeon; Is It Wrong to Try to Pick Up Girls in a Dungeon?",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2015-04-04",
         "series_end": "2015-06-27",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/2/70187.jpg",
         "my_id": "0",
         "my_watched_episodes": "13",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "9",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1472928556",
         "my_tags": []
      },
      {
         "series_animedb_id": "28171",
         "series_title": "Shokugeki no Souma",
         "series_synonyms": "Shokugeki no Soma; Food Wars: Shokugeki no Soma; Food Wars! Shokugeki no Soma",
         "series_type": "1",
         "series_episodes": "24",
         "series_status": "2",
         "series_start": "2015-04-04",
         "series_end": "2015-09-26",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/3/72943.jpg",
         "my_id": "0",
         "my_watched_episodes": "24",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "10",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1471628258",
         "my_tags": []
      },
      {
         "series_animedb_id": "28223",
         "series_title": "Death Parade",
         "series_synonyms": "; Death Parade",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2015-01-10",
         "series_end": "2015-03-28",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/5/71553.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1471633187",
         "my_tags": []
      },
      {
         "series_animedb_id": "28297",
         "series_title": "Ore Monogatari!!",
         "series_synonyms": "Ore Monogatari!!; My Story!!; My Love Story!!",
         "series_type": "1",
         "series_episodes": "24",
         "series_status": "2",
         "series_start": "2015-04-09",
         "series_end": "2015-09-24",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/13/69455.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "1",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1483095099",
         "my_tags": []
      },
      {
         "series_animedb_id": "28405",
         "series_title": "Ansatsu Kyoushitsu (TV): Deai no Jikan",
         "series_synonyms": "Assassination Classroom; Ansatsu Kyoushitsu (TV) Episode 0: Deai no Jikan; Ansatsu Kyoushitsu: Jump Festa 2014 Special; Assassination Classroom: Meeting Time",
         "series_type": "4",
         "series_episodes": "1",
         "series_status": "2",
         "series_start": "2014-11-09",
         "series_end": "2014-11-09",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/12/68547.jpg",
         "my_id": "0",
         "my_watched_episodes": "1",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1469816716",
         "my_tags": []
      },
      {
         "series_animedb_id": "28623",
         "series_title": "Koutetsujou no Kabaneri",
         "series_synonyms": "; Kabaneri of the Iron Fortress",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2016-04-08",
         "series_end": "2016-07-01",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/12/79164.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "8",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1468089964",
         "my_tags": []
      },
      {
         "series_animedb_id": "28805",
         "series_title": "Bakemono no Ko",
         "series_synonyms": "; The Boy and the Beast",
         "series_type": "3",
         "series_episodes": "1",
         "series_status": "2",
         "series_start": "2015-07-11",
         "series_end": "2015-07-11",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/11/73540.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "1",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1484916648",
         "my_tags": []
      },
      {
         "series_animedb_id": "28825",
         "series_title": "Himouto! Umaru-chan",
         "series_synonyms": "My Two-Faced Little Sister; Himouto! Umaru-chan",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2015-07-09",
         "series_end": "2015-09-24",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/12/75086.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1473976473",
         "my_tags": []
      },
      {
         "series_animedb_id": "28851",
         "series_title": "Koe no Katachi",
         "series_synonyms": "A Silent Voice; The Shape of Voice",
         "series_type": "3",
         "series_episodes": "1",
         "series_status": "2",
         "series_start": "2016-09-17",
         "series_end": "2016-09-17",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/3/80136.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1469611780",
         "my_tags": []
      },
      {
         "series_animedb_id": "28891",
         "series_title": "Haikyuu!! Second Season",
         "series_synonyms": "Haikyuu!! Second Season; Haikyu!! 2nd Season",
         "series_type": "1",
         "series_episodes": "25",
         "series_status": "2",
         "series_start": "2015-10-04",
         "series_end": "2016-03-27",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/9/76662.jpg",
         "my_id": "0",
         "my_watched_episodes": "25",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1475700300",
         "my_tags": []
      },
      {
         "series_animedb_id": "28907",
         "series_title": "Gate: Jieitai Kanochi nite, Kaku Tatakaeri",
         "series_synonyms": "Gate: Thus the JSDF Fought There!; GATE",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2015-07-04",
         "series_end": "2015-09-19",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/8/76222.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1470504004",
         "my_tags": []
      },
      {
         "series_animedb_id": "28999",
         "series_title": "Charlotte",
         "series_synonyms": "; Charlotte",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2015-07-05",
         "series_end": "2015-09-27",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/12/74683.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1470959280",
         "my_tags": []
      },
      {
         "series_animedb_id": "29758",
         "series_title": "Taboo Tattoo",
         "series_synonyms": "; Taboo Tattoo",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2016-07-05",
         "series_end": "2016-09-20",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/12/80197.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "4",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1470575444",
         "my_tags": []
      },
      {
         "series_animedb_id": "29786",
         "series_title": "Shimoneta to Iu Gainen ga Sonzai Shinai Taikutsu na Sekai",
         "series_synonyms": "Shimoseka; SHIMONETA: A Boring World Where the Concept of Dirty Jokes Doesn't Exist",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2015-07-04",
         "series_end": "2015-09-19",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/6/75106.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "8",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1480377108",
         "my_tags": []
      },
      {
         "series_animedb_id": "29787",
         "series_title": "Gochuumon wa Usagi Desu ka??",
         "series_synonyms": "Gochuumon wa Usagi Desu ka? 2; GochiUsa 2; Is the order a rabbit??",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2015-10-10",
         "series_end": "2015-12-26",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/8/76702.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "8",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1482875991",
         "my_tags": []
      },
      {
         "series_animedb_id": "29803",
         "series_title": "Overlord",
         "series_synonyms": "Over Lord; Overlord",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2015-07-07",
         "series_end": "2015-09-29",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/3/74462.jpg",
         "my_id": "0",
         "my_watched_episodes": "13",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "8",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1452673600",
         "my_tags": []
      },
      {
         "series_animedb_id": "29854",
         "series_title": "Ushio to Tora (TV)",
         "series_synonyms": "Ushio & Tora; Ushio and Tora",
         "series_type": "1",
         "series_episodes": "26",
         "series_status": "2",
         "series_start": "2015-07-03",
         "series_end": "2015-12-25",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/8/74945.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1470859660",
         "my_tags": []
      },
      {
         "series_animedb_id": "30015",
         "series_title": "ReLIFE",
         "series_synonyms": "Re LIFE; ReLIFE",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2016-07-02",
         "series_end": "2016-09-24",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/3/82149.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1471025288",
         "my_tags": []
      },
      {
         "series_animedb_id": "30016",
         "series_title": "Nanbaka",
         "series_synonyms": "Nambaka; Numbaka; The Numbers; Nanbaka",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2016-10-05",
         "series_end": "2016-12-28",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/2/81399.jpg",
         "my_id": "0",
         "my_watched_episodes": "13",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1484170005",
         "my_tags": []
      },
      {
         "series_animedb_id": "30206",
         "series_title": "Amagi Brilliant Park: Nonbirishiteiru Hima ga Nai!",
         "series_synonyms": "Amagi Brilliant Park Episode 14; Amagi Brilliant Park Tokubetsu-hen",
         "series_type": "4",
         "series_episodes": "1",
         "series_status": "2",
         "series_start": "2015-06-26",
         "series_end": "2015-06-26",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/11/74772.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1473546789",
         "my_tags": []
      },
      {
         "series_animedb_id": "30276",
         "series_title": "One Punch Man",
         "series_synonyms": "One Punch-Man; One-Punch Man; OPM; One-Punch Man",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2015-10-05",
         "series_end": "2015-12-21",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/12/76049.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "10",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1452673583",
         "my_tags": []
      },
      {
         "series_animedb_id": "30307",
         "series_title": "Monster Musume no Iru Nichijou",
         "series_synonyms": "MonMusu; Monster Musume: Everyday Life with Monster Girls",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2015-07-08",
         "series_end": "2015-09-23",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/9/75104.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "6",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1461450324",
         "my_tags": []
      },
      {
         "series_animedb_id": "30503",
         "series_title": "Noragami Aragoto",
         "series_synonyms": "; Noragami Aragoto",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2015-10-03",
         "series_end": "2015-12-26",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/4/75627.jpg",
         "my_id": "0",
         "my_watched_episodes": "13",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1461840323",
         "my_tags": []
      },
      {
         "series_animedb_id": "30544",
         "series_title": "Gakusen Toshi Asterisk",
         "series_synonyms": "Academy Battle City Asterisk; The Asterisk War: The Academy City on the Water",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2015-10-03",
         "series_end": "2015-12-19",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/5/76034.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1453582978",
         "my_tags": []
      },
      {
         "series_animedb_id": "30654",
         "series_title": "Ansatsu Kyoushitsu (TV) 2nd Season",
         "series_synonyms": "Ansatsu Kyoushitsu Season 2; Ansatsu Kyoushitsu Final Season; Assassination Classroom Second Season",
         "series_type": "1",
         "series_episodes": "25",
         "series_status": "2",
         "series_start": "2016-01-08",
         "series_end": "2016-07-01",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/8/77966.jpg",
         "my_id": "0",
         "my_watched_episodes": "25",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "10",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1470606136",
         "my_tags": []
      },
      {
         "series_animedb_id": "30831",
         "series_title": "Kono Subarashii Sekai ni Shukufuku wo!",
         "series_synonyms": "Give Blessings to This Wonderful World!; KonoSuba: God's Blessing on This Wonderful World!",
         "series_type": "1",
         "series_episodes": "10",
         "series_status": "2",
         "series_start": "2016-01-14",
         "series_end": "2016-03-17",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/8/77831.jpg",
         "my_id": "0",
         "my_watched_episodes": "10",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "8",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1476641281",
         "my_tags": []
      },
      {
         "series_animedb_id": "30911",
         "series_title": "Tales of Zestiria the X",
         "series_synonyms": "Tales of Zestiria the Cross; Tales of Zestiria the X",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2016-07-10",
         "series_end": "2016-09-25",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/3/79271.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1470765648",
         "my_tags": []
      },
      {
         "series_animedb_id": "30991",
         "series_title": "Himouto! Umaru-chan: Umaru-chan Mou Ikkai!",
         "series_synonyms": "Himouto! Umaru-chan OVA",
         "series_type": "2",
         "series_episodes": "1",
         "series_status": "2",
         "series_start": "2015-10-19",
         "series_end": "2015-10-19",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/7/76826.jpg",
         "my_id": "0",
         "my_watched_episodes": "1",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1473976508",
         "my_tags": []
      },
      {
         "series_animedb_id": "31043",
         "series_title": "Boku dake ga Inai Machi",
         "series_synonyms": "The Town Where Only I am Missing; BokuMachi; ERASED",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2016-01-08",
         "series_end": "2016-03-25",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/10/77957.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1453540722",
         "my_tags": []
      },
      {
         "series_animedb_id": "31181",
         "series_title": "Owarimonogatari",
         "series_synonyms": "End Story; Owarimonogatari",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2015-10-04",
         "series_end": "2015-12-20",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/8/76479.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1462200867",
         "my_tags": []
      },
      {
         "series_animedb_id": "31240",
         "series_title": "Re:Zero kara Hajimeru Isekai Seikatsu",
         "series_synonyms": "Re: Life in a different world from zero; ReZero; Re:ZERO -Starting Life in Another World-",
         "series_type": "1",
         "series_episodes": "25",
         "series_status": "2",
         "series_start": "2016-04-04",
         "series_end": "2016-09-19",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/11/79410.jpg",
         "my_id": "0",
         "my_watched_episodes": "25",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "9",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1470473992",
         "my_tags": []
      },
      {
         "series_animedb_id": "31251",
         "series_title": "Mobile Suit Gundam: Iron-Blooded Orphans",
         "series_synonyms": "Kidou Senshi Gundam: Tekketsu no Orphans; G-Tekketsu; Mobile Suit Gundam: Iron-Blooded Orphans",
         "series_type": "1",
         "series_episodes": "25",
         "series_status": "2",
         "series_start": "2015-10-04",
         "series_end": "2016-03-27",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/6/75879.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "9",
         "my_status": "3",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1453120505",
         "my_tags": []
      },
      {
         "series_animedb_id": "31339",
         "series_title": "Drifters",
         "series_synonyms": "Drifters: Battle in a Brand-new World War; Drifters",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2016-10-07",
         "series_end": "2016-12-23",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/10/80271.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "8",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1482948178",
         "my_tags": []
      },
      {
         "series_animedb_id": "31376",
         "series_title": "Flying Witch",
         "series_synonyms": "; Flying Witch",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2016-04-10",
         "series_end": "2016-06-26",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/6/80039.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "10",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1468004357",
         "my_tags": []
      },
      {
         "series_animedb_id": "31422",
         "series_title": "Minami Kamakura Koukou Joshi Jitensha-bu",
         "series_synonyms": "; Minami Kamakura High School Girls Cycling Club",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "1",
         "series_start": "2017-01-07",
         "series_end": "2017-03-25",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/10/83345.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "1",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1484334482",
         "my_tags": []
      },
      {
         "series_animedb_id": "31442",
         "series_title": "Musaigen no Phantom World",
         "series_synonyms": "Musaigen no Phantom World; Myriad Colors Phantom World",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2016-01-07",
         "series_end": "2016-03-31",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/4/78339.jpg",
         "my_id": "0",
         "my_watched_episodes": "13",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "8",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1462282868",
         "my_tags": []
      },
      {
         "series_animedb_id": "31478",
         "series_title": "Bungou Stray Dogs",
         "series_synonyms": "Literary Stray Dogs; Bungo Stray Dogs",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2016-04-07",
         "series_end": "2016-06-23",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/3/79409.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1462374788",
         "my_tags": []
      },
      {
         "series_animedb_id": "31500",
         "series_title": "High School Fleet",
         "series_synonyms": "Haifuri; High School Fleet",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2016-04-10",
         "series_end": "2016-06-26",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/9/79670.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1466883693",
         "my_tags": []
      },
      {
         "series_animedb_id": "31580",
         "series_title": "Ajin",
         "series_synonyms": "Ajin; Ajin: Demi-Human",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2016-01-16",
         "series_end": "2016-04-09",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/13/77968.jpg",
         "my_id": "0",
         "my_watched_episodes": "13",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "8",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1476288861",
         "my_tags": []
      },
      {
         "series_animedb_id": "31636",
         "series_title": "Dagashi Kashi",
         "series_synonyms": "Dagashikashi; Dagashi Kashi",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2016-01-08",
         "series_end": "2016-04-01",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/8/77833.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "10",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1460203895",
         "my_tags": []
      },
      {
         "series_animedb_id": "31646",
         "series_title": "3-gatsu no Lion",
         "series_synonyms": "Sangatsu no Lion; March comes in like a lion",
         "series_type": "1",
         "series_episodes": "22",
         "series_status": "1",
         "series_start": "2016-10-08",
         "series_end": "0000-00-00",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/12/82901.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "1",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1477083988",
         "my_tags": []
      },
      {
         "series_animedb_id": "31715",
         "series_title": "Working!!!: Lord of the Takanashi",
         "series_synonyms": "Working!!! Episode 14",
         "series_type": "4",
         "series_episodes": "1",
         "series_status": "2",
         "series_start": "2016-03-30",
         "series_end": "2016-03-30",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/10/79375.jpg",
         "my_id": "0",
         "my_watched_episodes": "1",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "10",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1470428978",
         "my_tags": []
      },
      {
         "series_animedb_id": "31722",
         "series_title": "Nanatsu no Taizai: Seisen no Shirushi",
         "series_synonyms": "; The Seven Deadly Sins: Signs of Holy War",
         "series_type": "1",
         "series_episodes": "4",
         "series_status": "2",
         "series_start": "2016-08-28",
         "series_end": "2016-09-18",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/13/79331.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1472942636",
         "my_tags": []
      },
      {
         "series_animedb_id": "31757",
         "series_title": "Kizumonogatari II: Nekketsu-hen",
         "series_synonyms": "Koyomi Vamp; Kizumonogatari Part 2; Kizumonogatari Part 2: Nekketsu",
         "series_type": "3",
         "series_episodes": "1",
         "series_status": "2",
         "series_start": "2016-08-19",
         "series_end": "2016-08-19",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/8/80930.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1462200909",
         "my_tags": []
      },
      {
         "series_animedb_id": "31758",
         "series_title": "Kizumonogatari III: Reiketsu-hen",
         "series_synonyms": "Koyomi Vamp; Kizumonogatari Part 3",
         "series_type": "3",
         "series_episodes": "1",
         "series_status": "2",
         "series_start": "2017-01-06",
         "series_end": "2017-01-06",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/8/82911.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1462200922",
         "my_tags": []
      },
      {
         "series_animedb_id": "31764",
         "series_title": "Nejimaki Seirei Senki: Tenkyou no Alderamin",
         "series_synonyms": "; Alderamin on the Sky",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2016-07-09",
         "series_end": "2016-10-01",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/11/79531.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1470503961",
         "my_tags": []
      },
      {
         "series_animedb_id": "31771",
         "series_title": "Amanchu!",
         "series_synonyms": [],
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2016-07-08",
         "series_end": "2016-09-23",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/6/80810.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "9",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1474747291",
         "my_tags": []
      },
      {
         "series_animedb_id": "31793",
         "series_title": "Mahou Shoujo Nante Mou Ii Desukara.",
         "series_synonyms": "I've Had Enough of Being a Magical Girl; Mahou Shoujo Nante Mouiidesukara",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2016-01-12",
         "series_end": "2016-03-29",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/9/77841.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "7",
         "my_status": "3",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1481665102",
         "my_tags": []
      },
      {
         "series_animedb_id": "31798",
         "series_title": "Kiznaiver",
         "series_synonyms": "; Kiznaiver",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2016-04-09",
         "series_end": "2016-06-25",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/6/78466.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1461053989",
         "my_tags": []
      },
      {
         "series_animedb_id": "31812",
         "series_title": "Kuroshitsuji Movie: Book of the Atlantic",
         "series_synonyms": "; Black Butler: Book of the Atlantic",
         "series_type": "3",
         "series_episodes": "1",
         "series_status": "2",
         "series_start": "2017-01-21",
         "series_end": "2017-01-21",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/9/82438.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1471471002",
         "my_tags": []
      },
      {
         "series_animedb_id": "31859",
         "series_title": "Hai to Gensou no Grimgar",
         "series_synonyms": "Grimgal of Ashes and Illusion; Grimgal of Ashes and Fantasies; Hai to Gensou no Grimgal; Grimgar of Fantasy and Ash",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2016-01-11",
         "series_end": "2016-03-28",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/13/77976.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "8",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1461868474",
         "my_tags": []
      },
      {
         "series_animedb_id": "31904",
         "series_title": "Big Order (TV)",
         "series_synonyms": "Big Order",
         "series_type": "1",
         "series_episodes": "10",
         "series_status": "2",
         "series_start": "2016-04-16",
         "series_end": "2016-06-18",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/3/79913.jpg",
         "my_id": "0",
         "my_watched_episodes": "3",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "5",
         "my_status": "4",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1462045717",
         "my_tags": []
      },
      {
         "series_animedb_id": "31952",
         "series_title": "Kono Bijutsubu ni wa Mondai ga Aru!",
         "series_synonyms": "Konobi; This Art Club Has a Problem!",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2016-07-08",
         "series_end": "2016-09-23",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/3/80688.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "8",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1474577851",
         "my_tags": []
      },
      {
         "series_animedb_id": "31953",
         "series_title": "New Game!",
         "series_synonyms": "; New Game!",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2016-07-04",
         "series_end": "2016-09-19",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/9/80417.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "9",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1474496303",
         "my_tags": []
      },
      {
         "series_animedb_id": "31964",
         "series_title": "Boku no Hero Academia",
         "series_synonyms": "; My Hero Academia",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2016-04-03",
         "series_end": "2016-06-26",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/10/78745.jpg",
         "my_id": "0",
         "my_watched_episodes": "13",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "10",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1469124972",
         "my_tags": []
      },
      {
         "series_animedb_id": "32093",
         "series_title": "Tanaka-kun wa Itsumo Kedaruge",
         "series_synonyms": "; Tanaka-kun is Always Listless",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2016-04-09",
         "series_end": "2016-06-25",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/13/78565.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "8",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1468437416",
         "my_tags": []
      },
      {
         "series_animedb_id": "32105",
         "series_title": "Sousei no Onmyouji",
         "series_synonyms": "; Twin Star Exorcists",
         "series_type": "1",
         "series_episodes": "50",
         "series_status": "1",
         "series_start": "2016-04-06",
         "series_end": "0000-00-00",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/12/79556.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1470505127",
         "my_tags": []
      },
      {
         "series_animedb_id": "32182",
         "series_title": "Mob Psycho 100",
         "series_synonyms": "Mob Psycho Hyaku; Mob Psycho One Hundred; Mob Psycho 100",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2016-07-11",
         "series_end": "2016-09-27",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/8/80356.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "10",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1470822541",
         "my_tags": []
      },
      {
         "series_animedb_id": "32190",
         "series_title": "Omoi no Kakera",
         "series_synonyms": [],
         "series_type": "4",
         "series_episodes": "1",
         "series_status": "2",
         "series_start": "2016-03-24",
         "series_end": "2016-03-24",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/5/80101.jpg",
         "my_id": "0",
         "my_watched_episodes": "1",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "7",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1473189462",
         "my_tags": []
      },
      {
         "series_animedb_id": "32268",
         "series_title": "Koyomimonogatari",
         "series_synonyms": [],
         "series_type": "5",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2016-01-10",
         "series_end": "2016-03-27",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/2/77744.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1462200884",
         "my_tags": []
      },
      {
         "series_animedb_id": "32281",
         "series_title": "Kimi no Na wa.",
         "series_synonyms": "; Your Name.",
         "series_type": "3",
         "series_episodes": "1",
         "series_status": "2",
         "series_start": "2016-08-26",
         "series_end": "2016-08-26",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/7/79999.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1472233297",
         "my_tags": []
      },
      {
         "series_animedb_id": "32282",
         "series_title": "Shokugeki no Souma: Ni no Sara",
         "series_synonyms": "Shokugeki no Souma 2nd Season; Shokugeki no Soma 2; Food Wars: Shokugeki no Soma 2; Shokugeki no Soma: The Second Plate; Food Wars! The Second Plate",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2016-07-02",
         "series_end": "2016-09-24",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/8/79353.jpg",
         "my_id": "0",
         "my_watched_episodes": "13",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "8",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1474744845",
         "my_tags": []
      },
      {
         "series_animedb_id": "32370",
         "series_title": "D.Gray-man Hallow",
         "series_synonyms": "; D.Gray-man HALLOW",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2016-07-05",
         "series_end": "2016-09-27",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/12/80766.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1468225524",
         "my_tags": []
      },
      {
         "series_animedb_id": "32380",
         "series_title": "Kono Subarashii Sekai ni Shukufuku wo! OVA",
         "series_synonyms": "KonoSuba OVA; A Blessing to this Wonderful Choker!; Kono Subarashii Choker ni Shufuku wo!",
         "series_type": "2",
         "series_episodes": "1",
         "series_status": "2",
         "series_start": "2016-06-24",
         "series_end": "2016-06-24",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/10/80582.jpg",
         "my_id": "0",
         "my_watched_episodes": "1",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "8",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1482328427",
         "my_tags": []
      },
      {
         "series_animedb_id": "32526",
         "series_title": "Love Live! Sunshine!!",
         "series_synonyms": "Love Live! School Idol Project: Sunshine!!",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2016-07-02",
         "series_end": "2016-09-24",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/8/80791.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "4",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1477991516",
         "my_tags": []
      },
      {
         "series_animedb_id": "32547",
         "series_title": "Non Non Biyori Repeat OVA",
         "series_synonyms": [],
         "series_type": "2",
         "series_episodes": "1",
         "series_status": "2",
         "series_start": "2016-09-23",
         "series_end": "2016-09-23",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/13/78136.jpg",
         "my_id": "0",
         "my_watched_episodes": "1",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "8",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1474913117",
         "my_tags": []
      },
      {
         "series_animedb_id": "32555",
         "series_title": "Stella no Mahou",
         "series_synonyms": "; Magic of Stella",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2016-10-03",
         "series_end": "2016-12-19",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/3/81471.jpg",
         "my_id": "0",
         "my_watched_episodes": "1",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "3",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1475954863",
         "my_tags": []
      },
      {
         "series_animedb_id": "32607",
         "series_title": "Gi(a)rlish Number",
         "series_synonyms": "; Girlish Number",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2016-10-07",
         "series_end": "2016-12-23",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/3/82291.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "8",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1484425783",
         "my_tags": []
      },
      {
         "series_animedb_id": "32615",
         "series_title": "Youjo Senki",
         "series_synonyms": "; Saga of Tanya the Evil",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "1",
         "series_start": "2017-01-06",
         "series_end": "0000-00-00",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/5/82890.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "1",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1484066132",
         "my_tags": []
      },
      {
         "series_animedb_id": "32673",
         "series_title": "Udon no Kuni no Kiniro Kemari",
         "series_synonyms": "Gaogao-chan to Aoi Sora; Poco's Udon World",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2016-10-09",
         "series_end": "2016-12-25",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/10/82343.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "1",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1474141692",
         "my_tags": []
      },
      {
         "series_animedb_id": "32686",
         "series_title": "Keijo!!!!!!!!",
         "series_synonyms": "; Keijo!!!!!!!!",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2016-10-06",
         "series_end": "2016-12-22",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/10/81906.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "8",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1482948792",
         "my_tags": []
      },
      {
         "series_animedb_id": "32729",
         "series_title": "Orange",
         "series_synonyms": "; Orange",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2016-07-04",
         "series_end": "2016-09-26",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/4/80110.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1468003771",
         "my_tags": []
      },
      {
         "series_animedb_id": "32801",
         "series_title": "Dungeon ni Deai wo Motomeru no wa Machigatteiru Darou ka OVA",
         "series_synonyms": "DanMachi OVA",
         "series_type": "2",
         "series_episodes": "1",
         "series_status": "2",
         "series_start": "2016-12-07",
         "series_end": "2016-12-07",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/9/81432.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1472735566",
         "my_tags": []
      },
      {
         "series_animedb_id": "32828",
         "series_title": "Amaama to Inazuma",
         "series_synonyms": "; Sweetness & Lightning",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2016-07-05",
         "series_end": "2016-09-20",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/6/80546.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "9",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1474318627",
         "my_tags": []
      },
      {
         "series_animedb_id": "32887",
         "series_title": "Dungeon ni Deai wo Motomeru no wa Machigatteiru Darou ka Gaiden: Sword Oratoria",
         "series_synonyms": [],
         "series_type": "1",
         "series_episodes": "0",
         "series_status": "3",
         "series_start": "2017-04-00",
         "series_end": "0000-00-00",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/11/83318.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1481815907",
         "my_tags": []
      },
      {
         "series_animedb_id": "32901",
         "series_title": "Eromanga-sensei",
         "series_synonyms": "Ero Manga Sensei",
         "series_type": "1",
         "series_episodes": "0",
         "series_status": "3",
         "series_start": "2017-04-00",
         "series_end": "0000-00-00",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/7/83541.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1482852627",
         "my_tags": []
      },
      {
         "series_animedb_id": "32902",
         "series_title": "Mahoutsukai no Yome: Hoshi Matsu Hito",
         "series_synonyms": "The Magician's Bride; The Ancient Magus' Bride: Those Awaiting a Star",
         "series_type": "2",
         "series_episodes": "3",
         "series_status": "1",
         "series_start": "2016-09-10",
         "series_end": "2017-09-09",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/4/80587.jpg",
         "my_id": "0",
         "my_watched_episodes": "1",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "10",
         "my_status": "1",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1473757328",
         "my_tags": []
      },
      {
         "series_animedb_id": "32924",
         "series_title": "Urara Meirochou",
         "series_synonyms": [],
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "1",
         "series_start": "2017-01-06",
         "series_end": "2017-03-24",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/12/83870.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "1",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1484064346",
         "my_tags": []
      },
      {
         "series_animedb_id": "32935",
         "series_title": "Haikyuu!!: Karasuno Koukou VS Shiratorizawa Gakuen Koukou",
         "series_synonyms": "Haikyuu!! Third Season; Haikyu!! 3rd Season",
         "series_type": "1",
         "series_episodes": "10",
         "series_status": "2",
         "series_start": "2016-10-08",
         "series_end": "2016-12-10",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/7/81992.jpg",
         "my_id": "0",
         "my_watched_episodes": "10",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "9",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1481570127",
         "my_tags": []
      },
      {
         "series_animedb_id": "32937",
         "series_title": "Kono Subarashii Sekai ni Shukufuku wo! 2",
         "series_synonyms": "Give Blessings to This Wonderful World! 2; KonoSuba: God's Blessing on This Wonderful World! 2",
         "series_type": "1",
         "series_episodes": "0",
         "series_status": "1",
         "series_start": "2017-01-12",
         "series_end": "0000-00-00",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/2/83188.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "1",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1476564103",
         "my_tags": []
      },
      {
         "series_animedb_id": "32949",
         "series_title": "Kuzu no Honkai",
         "series_synonyms": "; Scum's Wish",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "1",
         "series_start": "2017-01-13",
         "series_end": "2017-03-31",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/5/83937.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1478856095",
         "my_tags": []
      },
      {
         "series_animedb_id": "32979",
         "series_title": "Flip Flappers",
         "series_synonyms": "; Flip Flappers",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2016-10-06",
         "series_end": "2016-12-29",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/4/82292.jpg",
         "my_id": "0",
         "my_watched_episodes": "13",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "10",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1484405567",
         "my_tags": []
      },
      {
         "series_animedb_id": "32995",
         "series_title": "YURI!!! on ICE",
         "series_synonyms": "; Yuri!!! On ICE",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2016-10-06",
         "series_end": "2016-12-22",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/6/81149.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "9",
         "my_status": "1",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1477139561",
         "my_tags": []
      },
      {
         "series_animedb_id": "32998",
         "series_title": "91 Days",
         "series_synonyms": "; 91 Days",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2016-07-09",
         "series_end": "2016-10-01",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/13/80515.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1474805204",
         "my_tags": []
      },
      {
         "series_animedb_id": "33031",
         "series_title": "Shakunetsu no Takkyuu Musume",
         "series_synonyms": "; Scorching Ping Pong Girls",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2016-10-04",
         "series_end": "2016-12-20",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/9/80746.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "8",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1484170016",
         "my_tags": []
      },
      {
         "series_animedb_id": "33075",
         "series_title": "Musaigen no Phantom World Special",
         "series_synonyms": "; Myriad Colors Phantom World Special",
         "series_type": "4",
         "series_episodes": "1",
         "series_status": "2",
         "series_start": "2016-10-05",
         "series_end": "2016-10-05",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/7/82387.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1473026266",
         "my_tags": []
      },
      {
         "series_animedb_id": "33094",
         "series_title": "WWW.Working!!",
         "series_synonyms": "; WWW.WAGNARIA!!",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2016-10-01",
         "series_end": "2016-12-24",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/11/82287.jpg",
         "my_id": "0",
         "my_watched_episodes": "13",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "10",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1482948141",
         "my_tags": []
      },
      {
         "series_animedb_id": "33204",
         "series_title": "Hirune Hime: Shiranai Watashi no Monogatari",
         "series_synonyms": "; Ancien and the Magic Tablet",
         "series_type": "3",
         "series_episodes": "1",
         "series_status": "3",
         "series_start": "2017-03-18",
         "series_end": "2017-03-18",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/13/80900.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1478857993",
         "my_tags": []
      },
      {
         "series_animedb_id": "33206",
         "series_title": "Kobayashi-san Chi no Maid Dragon",
         "series_synonyms": "The maid dragon of Kobayashi-san; Miss Kobayashi's Dragon Maid",
         "series_type": "1",
         "series_episodes": "0",
         "series_status": "1",
         "series_start": "2017-01-12",
         "series_end": "0000-00-00",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/4/83173.jpg",
         "my_id": "0",
         "my_watched_episodes": "2",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "1",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1483023183",
         "my_tags": []
      },
      {
         "series_animedb_id": "33253",
         "series_title": "Ajin 2nd Season",
         "series_synonyms": "Ajin: Demi-Human 2nd Season",
         "series_type": "1",
         "series_episodes": "13",
         "series_status": "2",
         "series_start": "2016-10-08",
         "series_end": "2016-12-24",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/12/81858.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "1",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1476288878",
         "my_tags": []
      },
      {
         "series_animedb_id": "33255",
         "series_title": "Saiki Kusuo no Ψ-nan (TV)",
         "series_synonyms": "Saiki Kusuo no Psi Nan; The Disastrous Life of Saiki K.",
         "series_type": "1",
         "series_episodes": "120",
         "series_status": "2",
         "series_start": "2016-07-04",
         "series_end": "2016-12-26",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/11/80167.jpg",
         "my_id": "0",
         "my_watched_episodes": "120",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "10",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1484083270",
         "my_tags": []
      },
      {
         "series_animedb_id": "33263",
         "series_title": "Kubikiri Cycle: Aoiro Savant to Zaregototsukai",
         "series_synonyms": "Zaregoto Series;The Headless Cycle;The Beheading Cycle",
         "series_type": "2",
         "series_episodes": "8",
         "series_status": "1",
         "series_start": "2016-10-26",
         "series_end": "2017-06-28",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/12/81588.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "1",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1474273627",
         "my_tags": []
      },
      {
         "series_animedb_id": "33352",
         "series_title": "Violet Evergarden",
         "series_synonyms": "; Violet Evergarden",
         "series_type": "0",
         "series_episodes": "0",
         "series_status": "3",
         "series_start": "0000-00-00",
         "series_end": "0000-00-00",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/7/80143.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1483377015",
         "my_tags": []
      },
      {
         "series_animedb_id": "33433",
         "series_title": "Shuumatsu no Izetta",
         "series_synonyms": "Izetta, Die Letzte Hexe; Izetta: The Last Witch",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2016-10-01",
         "series_end": "2016-12-17",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/7/82119.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "9",
         "my_status": "1",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1475345339",
         "my_tags": []
      },
      {
         "series_animedb_id": "33486",
         "series_title": "Boku no Hero Academia 2nd Season",
         "series_synonyms": "; My Hero Academia 2",
         "series_type": "1",
         "series_episodes": "0",
         "series_status": "3",
         "series_start": "2017-04-00",
         "series_end": "0000-00-00",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/10/83359.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1469041215",
         "my_tags": []
      },
      {
         "series_animedb_id": "33487",
         "series_title": "Masamune-kun no Revenge",
         "series_synonyms": "; Masamune-kun's Revenge",
         "series_type": "1",
         "series_episodes": "0",
         "series_status": "1",
         "series_start": "2017-01-05",
         "series_end": "0000-00-00",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/12/83709.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "4",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1484060624",
         "my_tags": []
      },
      {
         "series_animedb_id": "33489",
         "series_title": "Little Witch Academia (TV)",
         "series_synonyms": [],
         "series_type": "1",
         "series_episodes": "25",
         "series_status": "1",
         "series_start": "2017-01-09",
         "series_end": "0000-00-00",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/13/83934.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "1",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1467534515",
         "my_tags": []
      },
      {
         "series_animedb_id": "33506",
         "series_title": "Ao no Exorcist: Kyoto Fujouou-hen",
         "series_synonyms": "Blue Exorcist: Kyoto Impure King Arc; Blue Exorcist: Kyoto Saga",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "1",
         "series_start": "2017-01-07",
         "series_end": "2017-03-25",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/11/83418.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "1",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1470769153",
         "my_tags": []
      },
      {
         "series_animedb_id": "33731",
         "series_title": "Gabriel DropOut",
         "series_synonyms": "; Gabriel DropOut",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "1",
         "series_start": "2017-01-09",
         "series_end": "2017-03-27",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/9/82590.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "1",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1477564657",
         "my_tags": []
      },
      {
         "series_animedb_id": "33743",
         "series_title": "Fuuka",
         "series_synonyms": "; Fuuka",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "1",
         "series_start": "2017-01-06",
         "series_end": "0000-00-00",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/8/83735.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "1",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1484067689",
         "my_tags": []
      },
      {
         "series_animedb_id": "33818",
         "series_title": "Amanchu! Special",
         "series_synonyms": [],
         "series_type": "4",
         "series_episodes": "1",
         "series_status": "3",
         "series_start": "2017-03-29",
         "series_end": "2017-03-29",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/6/81439.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1474747301",
         "my_tags": []
      },
      {
         "series_animedb_id": "33988",
         "series_title": "Demi-chan wa Kataritai",
         "series_synonyms": "; Interviews With Monster Girls",
         "series_type": "1",
         "series_episodes": "0",
         "series_status": "1",
         "series_start": "2017-01-08",
         "series_end": "0000-00-00",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/8/83417.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "1",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1484077683",
         "my_tags": []
      },
      {
         "series_animedb_id": "34009",
         "series_title": "To Be Hero",
         "series_synonyms": "; TO BE HERO",
         "series_type": "1",
         "series_episodes": "12",
         "series_status": "2",
         "series_start": "2016-10-05",
         "series_end": "2016-12-21",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/2/82347.jpg",
         "my_id": "0",
         "my_watched_episodes": "12",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "9",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1482948962",
         "my_tags": []
      },
      {
         "series_animedb_id": "34051",
         "series_title": "Akiba's Trip The Animation",
         "series_synonyms": "; Akiba's Trip The Animation",
         "series_type": "1",
         "series_episodes": "0",
         "series_status": "1",
         "series_start": "2017-01-04",
         "series_end": "0000-00-00",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/9/83185.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "1",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1484059777",
         "my_tags": []
      },
      {
         "series_animedb_id": "34134",
         "series_title": "One Punch Man 2",
         "series_synonyms": "One Punch-Man 2, One-Punch Man 2, OPM 2",
         "series_type": "1",
         "series_episodes": "0",
         "series_status": "3",
         "series_start": "2017-00-00",
         "series_end": "0000-00-00",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/5/82141.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1474881660",
         "my_tags": []
      },
      {
         "series_animedb_id": "34136",
         "series_title": "Orange: Mirai",
         "series_synonyms": [],
         "series_type": "3",
         "series_episodes": "1",
         "series_status": "2",
         "series_start": "2016-11-18",
         "series_end": "2016-11-18",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/10/82129.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1474881650",
         "my_tags": []
      },
      {
         "series_animedb_id": "34148",
         "series_title": "Nyanko Days",
         "series_synonyms": "; Nyanko Days",
         "series_type": "1",
         "series_episodes": "0",
         "series_status": "1",
         "series_start": "2017-01-08",
         "series_end": "0000-00-00",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/10/83933.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "1",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1484170916",
         "my_tags": []
      },
      {
         "series_animedb_id": "34161",
         "series_title": "Overlord: Fushisha no Ou",
         "series_synonyms": "Gekijouban Overlord",
         "series_type": "3",
         "series_episodes": "1",
         "series_status": "3",
         "series_start": "0000-00-00",
         "series_end": "0000-00-00",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/11/82168.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1478346407",
         "my_tags": []
      },
      {
         "series_animedb_id": "34176",
         "series_title": "Zero kara Hajimeru Mahou no Sho",
         "series_synonyms": [],
         "series_type": "1",
         "series_episodes": "0",
         "series_status": "3",
         "series_start": "2017-04-00",
         "series_end": "0000-00-00",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/3/82428.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1475706157",
         "my_tags": []
      },
      {
         "series_animedb_id": "34240",
         "series_title": "Shelter",
         "series_synonyms": "; Shelter",
         "series_type": "6",
         "series_episodes": "1",
         "series_status": "2",
         "series_start": "2016-10-18",
         "series_end": "2016-10-18",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/5/82388.jpg",
         "my_id": "0",
         "my_watched_episodes": "1",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "10",
         "my_status": "2",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1476870245",
         "my_tags": []
      },
      {
         "series_animedb_id": "34277",
         "series_title": "New Game!: Watashi, Shain Ryokou tte Hajimete nano de...",
         "series_synonyms": "New Game! OVA; New Game Episode 13",
         "series_type": "2",
         "series_episodes": "1",
         "series_status": "3",
         "series_start": "2017-00-00",
         "series_end": "2017-00-00",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/6/82494.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1477307147",
         "my_tags": []
      },
      {
         "series_animedb_id": "34494",
         "series_title": "Sakura Quest",
         "series_synonyms": [],
         "series_type": "1",
         "series_episodes": "0",
         "series_status": "3",
         "series_start": "2017-04-00",
         "series_end": "0000-00-00",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/12/83170.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1481138550",
         "my_tags": []
      },
      {
         "series_animedb_id": "34543",
         "series_title": "DIVE!!",
         "series_synonyms": [],
         "series_type": "1",
         "series_episodes": "0",
         "series_status": "3",
         "series_start": "2017-07-00",
         "series_end": "0000-00-00",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/3/83314.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1481876158",
         "my_tags": []
      },
      {
         "series_animedb_id": "34549",
         "series_title": "Ryuu no Haisha",
         "series_synonyms": "The Dragon Dentist",
         "series_type": "4",
         "series_episodes": "2",
         "series_status": "3",
         "series_start": "2017-02-18",
         "series_end": "2017-02-25",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/13/83336.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1482163141",
         "my_tags": []
      },
      {
         "series_animedb_id": "34577",
         "series_title": "Nanatsu no Taizai 2",
         "series_synonyms": [],
         "series_type": "1",
         "series_episodes": "0",
         "series_status": "3",
         "series_start": "0000-00-00",
         "series_end": "0000-00-00",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/7/83389.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1482743153",
         "my_tags": []
      },
      {
         "series_animedb_id": "34606",
         "series_title": "Drifters 2nd Season",
         "series_synonyms": [],
         "series_type": "1",
         "series_episodes": "0",
         "series_status": "3",
         "series_start": "0000-00-00",
         "series_end": "0000-00-00",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/5/83479.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "6",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1482743146",
         "my_tags": []
      }
   ];
/* harmony export (immutable) */ __webpack_exports__["a"] = list;



/***/ }),
/* 6 */
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
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = toHtml;


const contextRange = document.createRange();
contextRange.setStart(document.body, 0);

function toHtml(string) {
  return contextRange.createContextualFragment(string);
};


/***/ }),
/* 8 */
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
          reject('request failed');
        }
      };

      req.onerror = () => {
        reject('request failed');
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
        reject('request failed');
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
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__list_data__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mal_api__ = __webpack_require__(8);
/* harmony export (immutable) */ __webpack_exports__["a"] = mal;





const seasons = {
  winter: new Date('2017-01-01')
};

function mal() {
  const api = new __WEBPACK_IMPORTED_MODULE_1__mal_api__["a" /* default */]('apitest1234', 'OXtmfmalpoHU');

  return {
    authenticate: (username, password) => {
      return Promise.resolve(true);
    },

    updateEpisodeCount: (id, episode) => {
      console.warn('TEMP DISABLED');
      return;

      if (!id || !episode)
        return;

      return api.anime.update(id, {
        episode: episode
      }).then(result => console.log(result));
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

      const data = __WEBPACK_IMPORTED_MODULE_0__list_data__["a" /* list */].map(formatData);

      const get = function() {
        return new Promise(resolve => {
          setTimeout(() => {
            console.warn('Fetched fake data');
            resolve(data);
          }, 545);

          // api.anime.list().then(data => {
          //   resolve(data.myanimelist.anime.map(formatData));
          // });
        });
      };

      return {
        get
      };
    }()
  };
};


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shell__ = __webpack_require__(0);




__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__shell__["a" /* default */])({
  log: true
});


/***/ })
/******/ ]);