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
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_string_to_html__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__mediator__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__list_data__ = __webpack_require__(4);
/* harmony export (immutable) */ __webpack_exports__["a"] = shell;




// import MALjs from './MALjs';




const seasons = {
  winter: new Date('2017-01-01')
};

const services = {
  providers: {
    mal: { // provider interface
      authenticate: (username, password) => {
        return Promise.resolve(true);
      },
      update: () => {
        return Promise.resolve(true);
      },
      list: function() {
        const data = __WEBPACK_IMPORTED_MODULE_3__list_data__["a" /* list */].map(anime => ({
          id: parseInt(anime.series_animedb_id),
          title: anime.series_title,
          image: anime.series_image,
          starts: anime.series_start,
          ends: anime.series_end,
          status: parseInt(anime.series_status),
          currentEpisode: parseInt(anime.my_watched_episodes),
          episodeCount: parseInt(anime.series_episodes) ? parseInt(anime.series_episodes) : null,
        }));

        const get = function() {
          return Promise.resolve(data);
        };

        const isWatching = item => item.status === 1;
        const inWinterSeason = item => (new Date(item.starts).getTime() > seasons.winter.getTime());

        const currentSeason = async function () {
          const list = await get();

          return list
            .filter(inWinterSeason)
            .filter(isWatching)
            .sort((a, b) => {
                const dateA = new Date(a.starts);
                const dateB = new Date(b.starts);

                if (dateA.getTime() > dateB.getTime())
                  return 1;

                return -1;
            });
        };

        return {
          currentSeason,
          get
        };
      }(),

    }
  },
  storage: localStorage,
  toHtml: __WEBPACK_IMPORTED_MODULE_0_string_to_html__["a" /* default */],
  bus: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__mediator__["a" /* default */])(),
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

  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__core__["a" /* default */])(services);
};


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = actions;


function actions(bus) {

  bus.when('card:changed', (cardState) => {
    console.info('A card changed:', cardState);
  });

  bus.when('anime:currentEpisodeChanged', (data) => {
    console.info('Episode count changed:', data);
  });
};


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = card;


function card({toHtml, bus}, refElement, anime) {
  let blockChangeEvent = false;

  const setState = function(newState) {
    return new Proxy(newState, {
      set(target, key, value) {
          target[key] = value;

          // copy the state
          const clone = Object.assign({}, target);

          if (!blockChangeEvent)
            bus.emit('card:changed', clone);

          render();
          return true;
        },
      });
  };

  const cardTemplate = function(anime) {
    const template = `
      <div class="card card--showTitleOnHover" data-id="${anime.id}">
        <div class="card__title">
          <p>${ anime.title }</p>
        </div>
        <figure class="card__image-container">
          <img src="${anime.image}" alt="${anime.title}">
        </figure>
        <div class="card__controls">
          <button class="card__episode-button" data-ref="decrement">-</button>
          <div class="card__episode-count">
            <div>
              <span>Episodes seen:</span>
              <span>${anime.currentEpisode}/${anime.episodeCount ? anime.episodeCount : '??'}</span>
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
    bus.emit('anime:currentEpisodeChanged', { id: state.id, currentEpisode: state.currentEpisode });
  };

  const decrementEpisode = function() {
    if (state.currentEpisode === 0)
      return;

    state.currentEpisode = state.currentEpisode - 1;
    bus.emit('anime:currentEpisodeChanged', { id: state.id, currentEpisode: state.currentEpisode });
  };

  const render = function() {
    // This rerenders the entire node, which might have
    // an impact on performance.
    const node = cardTemplate(state);

    // Add Event Listeners
    node.querySelector('[data-ref="increment"]').addEventListener('click', incrementEpisode);
    node.querySelector('[data-ref="decrement"]').addEventListener('click', decrementEpisode);

    // Add to the dom, replace it if it already exists.
    if (refElement.firstElementChild) {
      refElement.replaceChild(node, refElement.firstElementChild);
    } else {
      refElement.appendChild(node);
    }
  };

  const state = setState(anime);

  // Whenever an anime:changed event is fire with the id of this card
  // update the state of the card.
  bus.when('anime:changed', { id: anime.id }, function(newState) {
    blockChangeEvent = true;
    // Copy the newState's properties on the current state.
    Object.assign(state, newState);
    blockChangeEvent = false;
  });

  return {
    state,
    render
  };
};


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__card__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__actions__ = __webpack_require__(1);
/* harmony export (immutable) */ __webpack_exports__["a"] = core;





async function core(services) {
  console.info('initialize with ', services);

  // Bootstrap the application
  console.info('initialize app...');
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__actions__["a" /* default */])(services.bus);

  console.info('Get settings from storage...');
  const settings = services.storage.getItem('app.settings');

  let prompt = false;
  if (!settings || !settings.loggedIn) {
    console.info('No settings found, or user is not logged in, prompting user...');
    prompt = true;
  }

  const watching = await services.providers.mal.list.currentSeason();

  console.log(watching);

  const cardContainer = document.querySelector(".card-container");

  const nodes = [];
  watching.forEach(anime => {
    const node = document.createElement('li');

    const animeCard = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__card__["a" /* default */])(services, node, anime);

    animeCard.render();

    nodes.push(node);

    return false;
  });

  // Append all nodes to dom
  nodes.forEach(node => cardContainer.appendChild(node));

  // console.log('Checking if logged in...');
  // If not prompt log in -> store credentials if remember is on.
  // If logged in: get anime data from storage
  // Do background fetch to update -> show spinner for this ?.
};

{
  currentEpisode: 3
}


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


const list =  [
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
         "series_animedb_id": "2154",
         "series_title": "Tekkon Kinkreet",
         "series_synonyms": "Tekkon Kinkreet (2006); Black & White; Tekkon Kinkurito; Tekkon Kin Creat; Tekkonkinkreet",
         "series_type": "3",
         "series_episodes": "1",
         "series_status": "2",
         "series_start": "2006-12-23",
         "series_end": "2006-12-23",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/12/8520.jpg",
         "my_id": "0",
         "my_watched_episodes": "0",
         "my_start_date": "0000-00-00",
         "my_finish_date": "0000-00-00",
         "my_score": "0",
         "my_status": "1",
         "my_rewatching": "0",
         "my_rewatching_ep": "0",
         "my_last_updated": "1482005460",
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
         "series_status": "3",
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
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/2/82926.jpg",
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
         "series_animedb_id": "33204",
         "series_title": "Hirune Hime: Shiranai Watashi no Monogatari",
         "series_synonyms": [],
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
         "my_watched_episodes": "0",
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
         "series_animedb_id": "33489",
         "series_title": "Little Witch Academia (TV)",
         "series_synonyms": [],
         "series_type": "1",
         "series_episodes": "25",
         "series_status": "1",
         "series_start": "2017-01-09",
         "series_end": "0000-00-00",
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/3/83096.jpg",
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
         "series_image": "https://myanimelist.cdn-dena.com/images/anime/5/83861.jpg",
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
         "series_synonyms": [],
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
/* 5 */
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
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = toHtml;


const contextRange = document.createRange();
contextRange.setStart(document.body, 0);

function toHtml(string) {
  return contextRange.createContextualFragment(string);
};


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shell__ = __webpack_require__(0);




__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__shell__["a" /* default */])({
  log: true
});


/***/ })
/******/ ]);