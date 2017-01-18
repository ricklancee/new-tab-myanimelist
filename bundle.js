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
/******/ 	return __webpack_require__(__webpack_require__.s = 44);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = isWidget

function isWidget(w) {
    return w && w.type === "Widget"
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var version = __webpack_require__(2)

module.exports = isVirtualNode

function isVirtualNode(x) {
    return x && x.type === "VirtualNode" && x.version === version
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = "2"


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = isThunk

function isThunk(t) {
    return t && t.type === "Thunk"
}


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = isHook

function isHook(hook) {
    return hook &&
      (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
       typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var version = __webpack_require__(2)

module.exports = isVirtualText

function isVirtualText(x) {
    return x && x.type === "VirtualText" && x.version === version
}


/***/ }),
/* 6 */
/***/ (function(module, exports) {

var nativeIsArray = Array.isArray
var toString = Object.prototype.toString

module.exports = nativeIsArray || isArray

function isArray(obj) {
    return toString.call(obj) === "[object Array]"
}


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = __webpack_require__(43);

if (typeof document !== 'undefined') {
    module.exports = document;
} else {
    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }

    module.exports = doccy;
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isObject(x) {
	return typeof x === "object" && x !== null;
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(8)
var isHook = __webpack_require__(4)

module.exports = applyProperties

function applyProperties(node, props, previous) {
    for (var propName in props) {
        var propValue = props[propName]

        if (propValue === undefined) {
            removeProperty(node, propName, propValue, previous);
        } else if (isHook(propValue)) {
            removeProperty(node, propName, propValue, previous)
            if (propValue.hook) {
                propValue.hook(node,
                    propName,
                    previous ? previous[propName] : undefined)
            }
        } else {
            if (isObject(propValue)) {
                patchObject(node, props, previous, propName, propValue);
            } else {
                node[propName] = propValue
            }
        }
    }
}

function removeProperty(node, propName, propValue, previous) {
    if (previous) {
        var previousValue = previous[propName]

        if (!isHook(previousValue)) {
            if (propName === "attributes") {
                for (var attrName in previousValue) {
                    node.removeAttribute(attrName)
                }
            } else if (propName === "style") {
                for (var i in previousValue) {
                    node.style[i] = ""
                }
            } else if (typeof previousValue === "string") {
                node[propName] = ""
            } else {
                node[propName] = null
            }
        } else if (previousValue.unhook) {
            previousValue.unhook(node, propName, propValue)
        }
    }
}

function patchObject(node, props, previous, propName, propValue) {
    var previousValue = previous ? previous[propName] : undefined

    // Set attributes
    if (propName === "attributes") {
        for (var attrName in propValue) {
            var attrValue = propValue[attrName]

            if (attrValue === undefined) {
                node.removeAttribute(attrName)
            } else {
                node.setAttribute(attrName, attrValue)
            }
        }

        return
    }

    if(previousValue && isObject(previousValue) &&
        getPrototype(previousValue) !== getPrototype(propValue)) {
        node[propName] = propValue
        return
    }

    if (!isObject(node[propName])) {
        node[propName] = {}
    }

    var replacer = propName === "style" ? "" : undefined

    for (var k in propValue) {
        var value = propValue[k]
        node[propName][k] = (value === undefined) ? replacer : value
    }
}

function getPrototype(value) {
    if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(value)
    } else if (value.__proto__) {
        return value.__proto__
    } else if (value.constructor) {
        return value.constructor.prototype
    }
}


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(7)

var applyProperties = __webpack_require__(9)

var isVNode = __webpack_require__(1)
var isVText = __webpack_require__(5)
var isWidget = __webpack_require__(0)
var handleThunk = __webpack_require__(11)

module.exports = createElement

function createElement(vnode, opts) {
    var doc = opts ? opts.document || document : document
    var warn = opts ? opts.warn : null

    vnode = handleThunk(vnode).a

    if (isWidget(vnode)) {
        return vnode.init()
    } else if (isVText(vnode)) {
        return doc.createTextNode(vnode.text)
    } else if (!isVNode(vnode)) {
        if (warn) {
            warn("Item is not a valid virtual dom node", vnode)
        }
        return null
    }

    var node = (vnode.namespace === null) ?
        doc.createElement(vnode.tagName) :
        doc.createElementNS(vnode.namespace, vnode.tagName)

    var props = vnode.properties
    applyProperties(node, props)

    var children = vnode.children

    for (var i = 0; i < children.length; i++) {
        var childNode = createElement(children[i], opts)
        if (childNode) {
            node.appendChild(childNode)
        }
    }

    return node
}


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var isVNode = __webpack_require__(1)
var isVText = __webpack_require__(5)
var isWidget = __webpack_require__(0)
var isThunk = __webpack_require__(3)

module.exports = handleThunk

function handleThunk(a, b) {
    var renderedA = a
    var renderedB = b

    if (isThunk(b)) {
        renderedB = renderThunk(b, a)
    }

    if (isThunk(a)) {
        renderedA = renderThunk(a, null)
    }

    return {
        a: renderedA,
        b: renderedB
    }
}

function renderThunk(thunk, previous) {
    var renderedThunk = thunk.vnode

    if (!renderedThunk) {
        renderedThunk = thunk.vnode = thunk.render(previous)
    }

    if (!(isVNode(renderedThunk) ||
            isVText(renderedThunk) ||
            isWidget(renderedThunk))) {
        throw new Error("thunk did not return a valid node");
    }

    return renderedThunk
}


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var version = __webpack_require__(2)

VirtualPatch.NONE = 0
VirtualPatch.VTEXT = 1
VirtualPatch.VNODE = 2
VirtualPatch.WIDGET = 3
VirtualPatch.PROPS = 4
VirtualPatch.ORDER = 5
VirtualPatch.INSERT = 6
VirtualPatch.REMOVE = 7
VirtualPatch.THUNK = 8

module.exports = VirtualPatch

function VirtualPatch(type, vNode, patch) {
    this.type = Number(type)
    this.vNode = vNode
    this.patch = patch
}

VirtualPatch.prototype.version = version
VirtualPatch.prototype.type = "VirtualPatch"


/***/ }),
/* 13 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__providers_mal__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__mediator__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_virtual_dom_h__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_virtual_dom_h___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_virtual_dom_h__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_virtual_dom_diff__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_virtual_dom_diff___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_virtual_dom_diff__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_virtual_dom_patch__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_virtual_dom_patch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_virtual_dom_patch__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_virtual_dom_create_element__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_virtual_dom_create_element___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_virtual_dom_create_element__);
/* harmony export (immutable) */ __webpack_exports__["a"] = shell;




// Providers


// Utilities


// Virtual domming





const services = {
  virtualDom: {
    h: __WEBPACK_IMPORTED_MODULE_3_virtual_dom_h___default.a,
    diff: __WEBPACK_IMPORTED_MODULE_4_virtual_dom_diff___default.a,
    patch: __WEBPACK_IMPORTED_MODULE_5_virtual_dom_patch___default.a,
    createElement: __WEBPACK_IMPORTED_MODULE_6_virtual_dom_create_element___default.a
  },
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
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = actions;


function actions(bus, provider) {

  bus.when('card:changed', (cardState) => {
    console.info('A card changed:', cardState);
  });

  bus.when('anime:currentEpisodeChanged', (data) => {
    console.info('Episode count changed:', data);
    provider.updateEpisodeCount(data.id, data.currentEpisode);
  });
};


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = card;


function card({ virtualDom, bus }, refElement, anime) {
  let blockChangeEvent = false;
  let tree, rootNode;

  const setState = function(newState) {
    return new Proxy(newState, {
      set(target, key, value) {
          target[key] = value;

          // copy the state
          const clone = Object.assign({}, target);

          if (!blockChangeEvent)
            bus.emit('card:changed', clone);

          update();
          return true;
        },
      });
  };

  const cardTemplate = function(anime) {
    return virtualDom.h("div.card.card--showTitleOnHover.isStatus-"+anime.status, {
      "attributes": {
        "data-id": anime.id
      }
    }, [
        virtualDom.h("div.card__title", [
          virtualDom.h("p", anime.title)
        ]),
        virtualDom.h("figure.card__image-container", [
          virtualDom.h("a.card__link", {attributes: {target: '_blank', href: 'https://myanimelist.net/anime/'+anime.id}}, [
            virtualDom.h("img", {
              "attributes": {
                "src": anime.image,
                "alt": anime.title
              }
            })
          ])
        ]),
        virtualDom.h("div.card__controls", [
          virtualDom.h("button.card__episode-button", {
            "attributes": {
              "data-ref": "decrement",
              "className": "card__episode-button"
            }
          }, `-`),
          virtualDom.h("div.card__episode-count", [
            virtualDom.h("div", [
              virtualDom.h("input.episode-count__input", {attributes: {
                type: 'number',
                value: anime.currentEpisode,
                "data-ref": "input",
              }}),
              virtualDom.h("span.episode-count__title", `Episodes seen:`),
              virtualDom.h("span.episode-count__episodes", anime.currentEpisode+`/`+(anime.episodeCount ? anime.episodeCount : '??'))
            ])
          ]),
          virtualDom.h("button.card__episode-button", {
            "attributes": {
              "data-ref": "increment",
              "className": "card__episode-button"
            }
          }, `+`)
        ])
    ]);
  };

  const incrementEpisode = function() {
    if (state.currentEpisode === anime.episodeCount)
      return;

    state.currentEpisode = state.currentEpisode + 1;

    rootNode.querySelector('[data-ref="input"]').value = state.currentEpisode;

    bus.emit('anime:currentEpisodeChanged', { id: state.id, currentEpisode: state.currentEpisode });
  };

  const decrementEpisode = function() {
    if (state.currentEpisode === 0)
      return;

    state.currentEpisode = state.currentEpisode - 1;

    rootNode.querySelector('[data-ref="input"]').value = state.currentEpisode;

    bus.emit('anime:currentEpisodeChanged', { id: state.id, currentEpisode: state.currentEpisode });
  };

  const changeEpisode = function(event) {
    console.log(event.target.value);
    state.currentEpisode = parseInt(event.target.value);
    bus.emit('anime:currentEpisodeChanged', { id: state.id, currentEpisode: state.currentEpisode });
  };

  const render = function() {
    tree = cardTemplate(state);
    rootNode = virtualDom.createElement(tree);
    refElement.appendChild(rootNode);

    // Event listeners
    rootNode.querySelector('[data-ref="increment"]').addEventListener('click', incrementEpisode);
    rootNode.querySelector('[data-ref="decrement"]').addEventListener('click', decrementEpisode);
    rootNode.querySelector('[data-ref="input"]').addEventListener('change', changeEpisode);
  };

  const update = function() {
    const newTree = cardTemplate(state);
    const patches = virtualDom.diff(tree, newTree);
    rootNode = virtualDom.patch(rootNode, patches);
    tree = newTree;
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
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = cardContainer;


function cardContainer(services, card, refElement, list) {
  let nodes = [];
  let state = list;
  let loaded = 0;
  const loadLimit = 32;
  let containerHeight = 0;
  let windowHeight = window.innerHeight;

  // Event Listeners
  const handleLoadingOfNextStateOnScroll = function(event) {
    if (loaded >= state.length) {
      return;
    }

    const distance = containerHeight - (window.scrollY + windowHeight);

    if (distance < containerHeight / 2) {
      renderNextStatePartial();
    }
  };
  window.addEventListener('scroll', handleLoadingOfNextStateOnScroll, { passive: true });
  window.addEventListener('resize', () => { windowHeight = window.innerHeight }, { passive: true });

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

  const filter = function(status = 'watching', season = 'all', year = 'all') {
    let filtered = list.slice(0);

    switch(status) {
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

    switch(season) {
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

    if (year !== 'all') {
      year = parseInt(year, 10);
      filtered = filtered.filter(item => ( new Date(item.starts)).getFullYear() === year);
    }

    return state = filtered;
  };

  const sort = function() {
    const sortedByStatus = state.slice().sort((a, b) => {
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

    state = sorted;
  };

  const render = function() {
    // If there are any remove all nodes from dom first
    if (nodes.length) {
      nodes.forEach(node => node.remove());
    }

    // Clear the array
    nodes = [];
    // Eeset amount of loaded cards
    loaded = 0;

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
    if (loaded >= state.length) {
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
      nodes.push(node);
    });

    // Append all nodes to dom after creating the nodes
    // this prevents a read, write, read, write cycle
    nodes.forEach(node => refElement.appendChild(node));
  };

  const getStateToLoad = function() {
    const slicedState = state.slice(loaded, loaded + loadLimit);
    loaded = loaded + loadLimit;
    return slicedState;
  };

  const reCalcContainerHeight = function() {
    containerHeight = refElement.offsetTop + refElement.offsetHeight;
  };

  return {
    sort,
    filter,
    render,
    renderNextStatePartial
  };
};


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__card__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__cardContainer__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__actions__ = __webpack_require__(15);
/* harmony export (immutable) */ __webpack_exports__["a"] = core;






async function core(services) {
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

  let list;

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
    container.sort();
    container.render();
  };

  const handleFilterAllSeasonsClick = function(event) {
    filterCurrentSeason.classList.remove('active');
    event.target.classList.add('active');

    season = 'all';
    year = 'all';

    container.filter(status, 'all', year);
    container.sort();
    container.render();
  };

  const handleFilterStatusClick = function(event) {
    status = event.target.getAttribute('data-filter-status');

    filterStatusElements.forEach(el => el.classList.remove('active'));
    event.target.classList.add('active');

    container.filter(status, season, year);
    container.sort();
    container.render();
  };

  filterStatusElements.forEach(el => el.addEventListener('click', handleFilterStatusClick));

  filterCurrentSeason.addEventListener('click', handleFilterCurrentSeasonClick);
  filterAllSeasons.addEventListener('click', handleFilterAllSeasonsClick);

  if (cachedList) {
    container.filter(status, season, year);
    container.sort();
    container.render();
  }

  window.container = container;

  // services.providers.mal.list.get().then(data => {
  //   console.info('Fetched list from provider.');
  //   list = data;
  //   services.storage.setItem('app.list', JSON.stringify(data));

  //   // Re-render
  // });

  // console.log('Checking if logged in...');
  // If not prompt log in -> store credentials if remember is on.
  // If logged in: get anime data from storage
  // Do background fetch to update -> show spinner for this ?.
};


/***/ }),
/* 19 */
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
/* 20 */
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
/* 21 */
/***/ (function(module, exports) {

/*!
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 * ECMAScript compliant, uniform cross-browser split method
 */

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * split('a b c d', ' ');
 * // -> ['a', 'b', 'c', 'd']
 *
 * // With limit
 * split('a b c d', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * split('..word1 word2..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
 */
module.exports = (function split(undef) {

  var nativeSplit = String.prototype.split,
    compliantExecNpcg = /()??/.exec("")[1] === undef,
    // NPCG: nonparticipating capturing group
    self;

  self = function(str, separator, limit) {
    // If `separator` is not a regex, use `nativeSplit`
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
      return nativeSplit.call(str, separator, limit);
    }
    var output = [],
      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
      (separator.sticky ? "y" : ""),
      // Firefox 3+
      lastLastIndex = 0,
      // Make `global` and avoid `lastIndex` issues by working with a copy
      separator = new RegExp(separator.source, flags + "g"),
      separator2, match, lastIndex, lastLength;
    str += ""; // Type-convert
    if (!compliantExecNpcg) {
      // Doesn't need flags gy, but they don't hurt
      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
    }
    /* Values for `limit`, per the spec:
     * If undefined: 4294967295 // Math.pow(2, 32) - 1
     * If 0, Infinity, or NaN: 0
     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
     * If other: Type-convert, then use the above rules
     */
    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
    limit >>> 0; // ToUint32(limit)
    while (match = separator.exec(str)) {
      // `separator.lastIndex` is not reliable cross-browser
      lastIndex = match.index + match[0].length;
      if (lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index));
        // Fix browsers whose `exec` methods don't consistently return `undefined` for
        // nonparticipating capturing groups
        if (!compliantExecNpcg && match.length > 1) {
          match[0].replace(separator2, function() {
            for (var i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undef) {
                match[i] = undef;
              }
            }
          });
        }
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if (output.length >= limit) {
          break;
        }
      }
      if (separator.lastIndex === match.index) {
        separator.lastIndex++; // Avoid an infinite loop
      }
    }
    if (lastLastIndex === str.length) {
      if (lastLength || !separator.test("")) {
        output.push("");
      }
    } else {
      output.push(str.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  };

  return self;
})();


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var OneVersionConstraint = __webpack_require__(24);

var MY_VERSION = '7';
OneVersionConstraint('ev-store', MY_VERSION);

var hashKey = '__EV_STORE_KEY@' + MY_VERSION;

module.exports = EvStore;

function EvStore(elem) {
    var hash = elem[hashKey];

    if (!hash) {
        hash = elem[hashKey] = {};
    }

    return hash;
}


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

/*global window, global*/

var root = typeof window !== 'undefined' ?
    window : typeof global !== 'undefined' ?
    global : {};

module.exports = Individual;

function Individual(key, value) {
    if (key in root) {
        return root[key];
    }

    root[key] = value;

    return value;
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Individual = __webpack_require__(23);

module.exports = OneVersion;

function OneVersion(moduleName, version, defaultValue) {
    var key = '__INDIVIDUAL_ONE_VERSION_' + moduleName;
    var enforceKey = key + '_ENFORCE_SINGLETON';

    var versionValue = Individual(enforceKey, version);

    if (versionValue !== version) {
        throw new Error('Can only have one copy of ' +
            moduleName + '.\n' +
            'You already have version ' + versionValue +
            ' installed.\n' +
            'This means you cannot install version ' + version);
    }

    return Individual(key, defaultValue);
}


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

var createElement = __webpack_require__(10)

module.exports = createElement


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var diff = __webpack_require__(40)

module.exports = diff


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

var h = __webpack_require__(35)

module.exports = h


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

var patch = __webpack_require__(31)

module.exports = patch


/***/ }),
/* 29 */
/***/ (function(module, exports) {

// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
// We don't want to read all of the DOM nodes in the tree so we use
// the in-order tree indexing to eliminate recursion down certain branches.
// We only recurse into a DOM node if we know that it contains a child of
// interest.

var noChild = {}

module.exports = domIndex

function domIndex(rootNode, tree, indices, nodes) {
    if (!indices || indices.length === 0) {
        return {}
    } else {
        indices.sort(ascending)
        return recurse(rootNode, tree, indices, nodes, 0)
    }
}

function recurse(rootNode, tree, indices, nodes, rootIndex) {
    nodes = nodes || {}


    if (rootNode) {
        if (indexInRange(indices, rootIndex, rootIndex)) {
            nodes[rootIndex] = rootNode
        }

        var vChildren = tree.children

        if (vChildren) {

            var childNodes = rootNode.childNodes

            for (var i = 0; i < tree.children.length; i++) {
                rootIndex += 1

                var vChild = vChildren[i] || noChild
                var nextIndex = rootIndex + (vChild.count || 0)

                // skip recursion down the tree if there are no nodes down here
                if (indexInRange(indices, rootIndex, nextIndex)) {
                    recurse(childNodes[i], vChild, indices, nodes, rootIndex)
                }

                rootIndex = nextIndex
            }
        }
    }

    return nodes
}

// Binary search for an index in the interval [left, right]
function indexInRange(indices, left, right) {
    if (indices.length === 0) {
        return false
    }

    var minIndex = 0
    var maxIndex = indices.length - 1
    var currentIndex
    var currentItem

    while (minIndex <= maxIndex) {
        currentIndex = ((maxIndex + minIndex) / 2) >> 0
        currentItem = indices[currentIndex]

        if (minIndex === maxIndex) {
            return currentItem >= left && currentItem <= right
        } else if (currentItem < left) {
            minIndex = currentIndex + 1
        } else  if (currentItem > right) {
            maxIndex = currentIndex - 1
        } else {
            return true
        }
    }

    return false;
}

function ascending(a, b) {
    return a > b ? 1 : -1
}


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

var applyProperties = __webpack_require__(9)

var isWidget = __webpack_require__(0)
var VPatch = __webpack_require__(12)

var updateWidget = __webpack_require__(32)

module.exports = applyPatch

function applyPatch(vpatch, domNode, renderOptions) {
    var type = vpatch.type
    var vNode = vpatch.vNode
    var patch = vpatch.patch

    switch (type) {
        case VPatch.REMOVE:
            return removeNode(domNode, vNode)
        case VPatch.INSERT:
            return insertNode(domNode, patch, renderOptions)
        case VPatch.VTEXT:
            return stringPatch(domNode, vNode, patch, renderOptions)
        case VPatch.WIDGET:
            return widgetPatch(domNode, vNode, patch, renderOptions)
        case VPatch.VNODE:
            return vNodePatch(domNode, vNode, patch, renderOptions)
        case VPatch.ORDER:
            reorderChildren(domNode, patch)
            return domNode
        case VPatch.PROPS:
            applyProperties(domNode, patch, vNode.properties)
            return domNode
        case VPatch.THUNK:
            return replaceRoot(domNode,
                renderOptions.patch(domNode, patch, renderOptions))
        default:
            return domNode
    }
}

function removeNode(domNode, vNode) {
    var parentNode = domNode.parentNode

    if (parentNode) {
        parentNode.removeChild(domNode)
    }

    destroyWidget(domNode, vNode);

    return null
}

function insertNode(parentNode, vNode, renderOptions) {
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode) {
        parentNode.appendChild(newNode)
    }

    return parentNode
}

function stringPatch(domNode, leftVNode, vText, renderOptions) {
    var newNode

    if (domNode.nodeType === 3) {
        domNode.replaceData(0, domNode.length, vText.text)
        newNode = domNode
    } else {
        var parentNode = domNode.parentNode
        newNode = renderOptions.render(vText, renderOptions)

        if (parentNode && newNode !== domNode) {
            parentNode.replaceChild(newNode, domNode)
        }
    }

    return newNode
}

function widgetPatch(domNode, leftVNode, widget, renderOptions) {
    var updating = updateWidget(leftVNode, widget)
    var newNode

    if (updating) {
        newNode = widget.update(leftVNode, domNode) || domNode
    } else {
        newNode = renderOptions.render(widget, renderOptions)
    }

    var parentNode = domNode.parentNode

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    if (!updating) {
        destroyWidget(domNode, leftVNode)
    }

    return newNode
}

function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
    var parentNode = domNode.parentNode
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    return newNode
}

function destroyWidget(domNode, w) {
    if (typeof w.destroy === "function" && isWidget(w)) {
        w.destroy(domNode)
    }
}

function reorderChildren(domNode, moves) {
    var childNodes = domNode.childNodes
    var keyMap = {}
    var node
    var remove
    var insert

    for (var i = 0; i < moves.removes.length; i++) {
        remove = moves.removes[i]
        node = childNodes[remove.from]
        if (remove.key) {
            keyMap[remove.key] = node
        }
        domNode.removeChild(node)
    }

    var length = childNodes.length
    for (var j = 0; j < moves.inserts.length; j++) {
        insert = moves.inserts[j]
        node = keyMap[insert.key]
        // this is the weirdest bug i've ever seen in webkit
        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to])
    }
}

function replaceRoot(oldRoot, newRoot) {
    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
        oldRoot.parentNode.replaceChild(newRoot, oldRoot)
    }

    return newRoot;
}


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(7)
var isArray = __webpack_require__(6)

var render = __webpack_require__(10)
var domIndex = __webpack_require__(29)
var patchOp = __webpack_require__(30)
module.exports = patch

function patch(rootNode, patches, renderOptions) {
    renderOptions = renderOptions || {}
    renderOptions.patch = renderOptions.patch && renderOptions.patch !== patch
        ? renderOptions.patch
        : patchRecursive
    renderOptions.render = renderOptions.render || render

    return renderOptions.patch(rootNode, patches, renderOptions)
}

function patchRecursive(rootNode, patches, renderOptions) {
    var indices = patchIndices(patches)

    if (indices.length === 0) {
        return rootNode
    }

    var index = domIndex(rootNode, patches.a, indices)
    var ownerDocument = rootNode.ownerDocument

    if (!renderOptions.document && ownerDocument !== document) {
        renderOptions.document = ownerDocument
    }

    for (var i = 0; i < indices.length; i++) {
        var nodeIndex = indices[i]
        rootNode = applyPatch(rootNode,
            index[nodeIndex],
            patches[nodeIndex],
            renderOptions)
    }

    return rootNode
}

function applyPatch(rootNode, domNode, patchList, renderOptions) {
    if (!domNode) {
        return rootNode
    }

    var newNode

    if (isArray(patchList)) {
        for (var i = 0; i < patchList.length; i++) {
            newNode = patchOp(patchList[i], domNode, renderOptions)

            if (domNode === rootNode) {
                rootNode = newNode
            }
        }
    } else {
        newNode = patchOp(patchList, domNode, renderOptions)

        if (domNode === rootNode) {
            rootNode = newNode
        }
    }

    return rootNode
}

function patchIndices(patches) {
    var indices = []

    for (var key in patches) {
        if (key !== "a") {
            indices.push(Number(key))
        }
    }

    return indices
}


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var isWidget = __webpack_require__(0)

module.exports = updateWidget

function updateWidget(a, b) {
    if (isWidget(a) && isWidget(b)) {
        if ("name" in a && "name" in b) {
            return a.id === b.id
        } else {
            return a.init === b.init
        }
    }

    return false
}


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var EvStore = __webpack_require__(22);

module.exports = EvHook;

function EvHook(value) {
    if (!(this instanceof EvHook)) {
        return new EvHook(value);
    }

    this.value = value;
}

EvHook.prototype.hook = function (node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = this.value;
};

EvHook.prototype.unhook = function(node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = undefined;
};


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = SoftSetHook;

function SoftSetHook(value) {
    if (!(this instanceof SoftSetHook)) {
        return new SoftSetHook(value);
    }

    this.value = value;
}

SoftSetHook.prototype.hook = function (node, propertyName) {
    if (node[propertyName] !== this.value) {
        node[propertyName] = this.value;
    }
};


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isArray = __webpack_require__(6);

var VNode = __webpack_require__(37);
var VText = __webpack_require__(38);
var isVNode = __webpack_require__(1);
var isVText = __webpack_require__(5);
var isWidget = __webpack_require__(0);
var isHook = __webpack_require__(4);
var isVThunk = __webpack_require__(3);

var parseTag = __webpack_require__(36);
var softSetHook = __webpack_require__(34);
var evHook = __webpack_require__(33);

module.exports = h;

function h(tagName, properties, children) {
    var childNodes = [];
    var tag, props, key, namespace;

    if (!children && isChildren(properties)) {
        children = properties;
        props = {};
    }

    props = props || properties || {};
    tag = parseTag(tagName, props);

    // support keys
    if (props.hasOwnProperty('key')) {
        key = props.key;
        props.key = undefined;
    }

    // support namespace
    if (props.hasOwnProperty('namespace')) {
        namespace = props.namespace;
        props.namespace = undefined;
    }

    // fix cursor bug
    if (tag === 'INPUT' &&
        !namespace &&
        props.hasOwnProperty('value') &&
        props.value !== undefined &&
        !isHook(props.value)
    ) {
        props.value = softSetHook(props.value);
    }

    transformProperties(props);

    if (children !== undefined && children !== null) {
        addChild(children, childNodes, tag, props);
    }


    return new VNode(tag, props, childNodes, key, namespace);
}

function addChild(c, childNodes, tag, props) {
    if (typeof c === 'string') {
        childNodes.push(new VText(c));
    } else if (typeof c === 'number') {
        childNodes.push(new VText(String(c)));
    } else if (isChild(c)) {
        childNodes.push(c);
    } else if (isArray(c)) {
        for (var i = 0; i < c.length; i++) {
            addChild(c[i], childNodes, tag, props);
        }
    } else if (c === null || c === undefined) {
        return;
    } else {
        throw UnexpectedVirtualElement({
            foreignObject: c,
            parentVnode: {
                tagName: tag,
                properties: props
            }
        });
    }
}

function transformProperties(props) {
    for (var propName in props) {
        if (props.hasOwnProperty(propName)) {
            var value = props[propName];

            if (isHook(value)) {
                continue;
            }

            if (propName.substr(0, 3) === 'ev-') {
                // add ev-foo support
                props[propName] = evHook(value);
            }
        }
    }
}

function isChild(x) {
    return isVNode(x) || isVText(x) || isWidget(x) || isVThunk(x);
}

function isChildren(x) {
    return typeof x === 'string' || isArray(x) || isChild(x);
}

function UnexpectedVirtualElement(data) {
    var err = new Error();

    err.type = 'virtual-hyperscript.unexpected.virtual-element';
    err.message = 'Unexpected virtual child passed to h().\n' +
        'Expected a VNode / Vthunk / VWidget / string but:\n' +
        'got:\n' +
        errorString(data.foreignObject) +
        '.\n' +
        'The parent vnode is:\n' +
        errorString(data.parentVnode)
        '\n' +
        'Suggested fix: change your `h(..., [ ... ])` callsite.';
    err.foreignObject = data.foreignObject;
    err.parentVnode = data.parentVnode;

    return err;
}

function errorString(obj) {
    try {
        return JSON.stringify(obj, null, '    ');
    } catch (e) {
        return String(obj);
    }
}


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var split = __webpack_require__(21);

var classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;
var notClassId = /^\.|#/;

module.exports = parseTag;

function parseTag(tag, props) {
    if (!tag) {
        return 'DIV';
    }

    var noId = !(props.hasOwnProperty('id'));

    var tagParts = split(tag, classIdSplit);
    var tagName = null;

    if (notClassId.test(tagParts[1])) {
        tagName = 'DIV';
    }

    var classes, part, type, i;

    for (i = 0; i < tagParts.length; i++) {
        part = tagParts[i];

        if (!part) {
            continue;
        }

        type = part.charAt(0);

        if (!tagName) {
            tagName = part;
        } else if (type === '.') {
            classes = classes || [];
            classes.push(part.substring(1, part.length));
        } else if (type === '#' && noId) {
            props.id = part.substring(1, part.length);
        }
    }

    if (classes) {
        if (props.className) {
            classes.push(props.className);
        }

        props.className = classes.join(' ');
    }

    return props.namespace ? tagName : tagName.toUpperCase();
}


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

var version = __webpack_require__(2)
var isVNode = __webpack_require__(1)
var isWidget = __webpack_require__(0)
var isThunk = __webpack_require__(3)
var isVHook = __webpack_require__(4)

module.exports = VirtualNode

var noProperties = {}
var noChildren = []

function VirtualNode(tagName, properties, children, key, namespace) {
    this.tagName = tagName
    this.properties = properties || noProperties
    this.children = children || noChildren
    this.key = key != null ? String(key) : undefined
    this.namespace = (typeof namespace === "string") ? namespace : null

    var count = (children && children.length) || 0
    var descendants = 0
    var hasWidgets = false
    var hasThunks = false
    var descendantHooks = false
    var hooks

    for (var propName in properties) {
        if (properties.hasOwnProperty(propName)) {
            var property = properties[propName]
            if (isVHook(property) && property.unhook) {
                if (!hooks) {
                    hooks = {}
                }

                hooks[propName] = property
            }
        }
    }

    for (var i = 0; i < count; i++) {
        var child = children[i]
        if (isVNode(child)) {
            descendants += child.count || 0

            if (!hasWidgets && child.hasWidgets) {
                hasWidgets = true
            }

            if (!hasThunks && child.hasThunks) {
                hasThunks = true
            }

            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
                descendantHooks = true
            }
        } else if (!hasWidgets && isWidget(child)) {
            if (typeof child.destroy === "function") {
                hasWidgets = true
            }
        } else if (!hasThunks && isThunk(child)) {
            hasThunks = true;
        }
    }

    this.count = count + descendants
    this.hasWidgets = hasWidgets
    this.hasThunks = hasThunks
    this.hooks = hooks
    this.descendantHooks = descendantHooks
}

VirtualNode.prototype.version = version
VirtualNode.prototype.type = "VirtualNode"


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

var version = __webpack_require__(2)

module.exports = VirtualText

function VirtualText(text) {
    this.text = String(text)
}

VirtualText.prototype.version = version
VirtualText.prototype.type = "VirtualText"


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(8)
var isHook = __webpack_require__(4)

module.exports = diffProps

function diffProps(a, b) {
    var diff

    for (var aKey in a) {
        if (!(aKey in b)) {
            diff = diff || {}
            diff[aKey] = undefined
        }

        var aValue = a[aKey]
        var bValue = b[aKey]

        if (aValue === bValue) {
            continue
        } else if (isObject(aValue) && isObject(bValue)) {
            if (getPrototype(bValue) !== getPrototype(aValue)) {
                diff = diff || {}
                diff[aKey] = bValue
            } else if (isHook(bValue)) {
                 diff = diff || {}
                 diff[aKey] = bValue
            } else {
                var objectDiff = diffProps(aValue, bValue)
                if (objectDiff) {
                    diff = diff || {}
                    diff[aKey] = objectDiff
                }
            }
        } else {
            diff = diff || {}
            diff[aKey] = bValue
        }
    }

    for (var bKey in b) {
        if (!(bKey in a)) {
            diff = diff || {}
            diff[bKey] = b[bKey]
        }
    }

    return diff
}

function getPrototype(value) {
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(value)
  } else if (value.__proto__) {
    return value.__proto__
  } else if (value.constructor) {
    return value.constructor.prototype
  }
}


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var isArray = __webpack_require__(6)

var VPatch = __webpack_require__(12)
var isVNode = __webpack_require__(1)
var isVText = __webpack_require__(5)
var isWidget = __webpack_require__(0)
var isThunk = __webpack_require__(3)
var handleThunk = __webpack_require__(11)

var diffProps = __webpack_require__(39)

module.exports = diff

function diff(a, b) {
    var patch = { a: a }
    walk(a, b, patch, 0)
    return patch
}

function walk(a, b, patch, index) {
    if (a === b) {
        return
    }

    var apply = patch[index]
    var applyClear = false

    if (isThunk(a) || isThunk(b)) {
        thunks(a, b, patch, index)
    } else if (b == null) {

        // If a is a widget we will add a remove patch for it
        // Otherwise any child widgets/hooks must be destroyed.
        // This prevents adding two remove patches for a widget.
        if (!isWidget(a)) {
            clearState(a, patch, index)
            apply = patch[index]
        }

        apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b))
    } else if (isVNode(b)) {
        if (isVNode(a)) {
            if (a.tagName === b.tagName &&
                a.namespace === b.namespace &&
                a.key === b.key) {
                var propsPatch = diffProps(a.properties, b.properties)
                if (propsPatch) {
                    apply = appendPatch(apply,
                        new VPatch(VPatch.PROPS, a, propsPatch))
                }
                apply = diffChildren(a, b, patch, apply, index)
            } else {
                apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
                applyClear = true
            }
        } else {
            apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
            applyClear = true
        }
    } else if (isVText(b)) {
        if (!isVText(a)) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
            applyClear = true
        } else if (a.text !== b.text) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
        }
    } else if (isWidget(b)) {
        if (!isWidget(a)) {
            applyClear = true
        }

        apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b))
    }

    if (apply) {
        patch[index] = apply
    }

    if (applyClear) {
        clearState(a, patch, index)
    }
}

function diffChildren(a, b, patch, apply, index) {
    var aChildren = a.children
    var orderedSet = reorder(aChildren, b.children)
    var bChildren = orderedSet.children

    var aLen = aChildren.length
    var bLen = bChildren.length
    var len = aLen > bLen ? aLen : bLen

    for (var i = 0; i < len; i++) {
        var leftNode = aChildren[i]
        var rightNode = bChildren[i]
        index += 1

        if (!leftNode) {
            if (rightNode) {
                // Excess nodes in b need to be added
                apply = appendPatch(apply,
                    new VPatch(VPatch.INSERT, null, rightNode))
            }
        } else {
            walk(leftNode, rightNode, patch, index)
        }

        if (isVNode(leftNode) && leftNode.count) {
            index += leftNode.count
        }
    }

    if (orderedSet.moves) {
        // Reorder nodes last
        apply = appendPatch(apply, new VPatch(
            VPatch.ORDER,
            a,
            orderedSet.moves
        ))
    }

    return apply
}

function clearState(vNode, patch, index) {
    // TODO: Make this a single walk, not two
    unhook(vNode, patch, index)
    destroyWidgets(vNode, patch, index)
}

// Patch records for all destroyed widgets must be added because we need
// a DOM node reference for the destroy function
function destroyWidgets(vNode, patch, index) {
    if (isWidget(vNode)) {
        if (typeof vNode.destroy === "function") {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(VPatch.REMOVE, vNode, null)
            )
        }
    } else if (isVNode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
        var children = vNode.children
        var len = children.length
        for (var i = 0; i < len; i++) {
            var child = children[i]
            index += 1

            destroyWidgets(child, patch, index)

            if (isVNode(child) && child.count) {
                index += child.count
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

// Create a sub-patch for thunks
function thunks(a, b, patch, index) {
    var nodes = handleThunk(a, b)
    var thunkPatch = diff(nodes.a, nodes.b)
    if (hasPatches(thunkPatch)) {
        patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch)
    }
}

function hasPatches(patch) {
    for (var index in patch) {
        if (index !== "a") {
            return true
        }
    }

    return false
}

// Execute hooks when two nodes are identical
function unhook(vNode, patch, index) {
    if (isVNode(vNode)) {
        if (vNode.hooks) {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(
                    VPatch.PROPS,
                    vNode,
                    undefinedKeys(vNode.hooks)
                )
            )
        }

        if (vNode.descendantHooks || vNode.hasThunks) {
            var children = vNode.children
            var len = children.length
            for (var i = 0; i < len; i++) {
                var child = children[i]
                index += 1

                unhook(child, patch, index)

                if (isVNode(child) && child.count) {
                    index += child.count
                }
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

function undefinedKeys(obj) {
    var result = {}

    for (var key in obj) {
        result[key] = undefined
    }

    return result
}

// List diff, naive left to right reordering
function reorder(aChildren, bChildren) {
    // O(M) time, O(M) memory
    var bChildIndex = keyIndex(bChildren)
    var bKeys = bChildIndex.keys
    var bFree = bChildIndex.free

    if (bFree.length === bChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(N) time, O(N) memory
    var aChildIndex = keyIndex(aChildren)
    var aKeys = aChildIndex.keys
    var aFree = aChildIndex.free

    if (aFree.length === aChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(MAX(N, M)) memory
    var newChildren = []

    var freeIndex = 0
    var freeCount = bFree.length
    var deletedItems = 0

    // Iterate through a and match a node in b
    // O(N) time,
    for (var i = 0 ; i < aChildren.length; i++) {
        var aItem = aChildren[i]
        var itemIndex

        if (aItem.key) {
            if (bKeys.hasOwnProperty(aItem.key)) {
                // Match up the old keys
                itemIndex = bKeys[aItem.key]
                newChildren.push(bChildren[itemIndex])

            } else {
                // Remove old keyed items
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        } else {
            // Match the item in a with the next free item in b
            if (freeIndex < freeCount) {
                itemIndex = bFree[freeIndex++]
                newChildren.push(bChildren[itemIndex])
            } else {
                // There are no free items in b to match with
                // the free items in a, so the extra free nodes
                // are deleted.
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        }
    }

    var lastFreeIndex = freeIndex >= bFree.length ?
        bChildren.length :
        bFree[freeIndex]

    // Iterate through b and append any new keys
    // O(M) time
    for (var j = 0; j < bChildren.length; j++) {
        var newItem = bChildren[j]

        if (newItem.key) {
            if (!aKeys.hasOwnProperty(newItem.key)) {
                // Add any new keyed items
                // We are adding new items to the end and then sorting them
                // in place. In future we should insert new items in place.
                newChildren.push(newItem)
            }
        } else if (j >= lastFreeIndex) {
            // Add any leftover non-keyed items
            newChildren.push(newItem)
        }
    }

    var simulate = newChildren.slice()
    var simulateIndex = 0
    var removes = []
    var inserts = []
    var simulateItem

    for (var k = 0; k < bChildren.length;) {
        var wantedItem = bChildren[k]
        simulateItem = simulate[simulateIndex]

        // remove items
        while (simulateItem === null && simulate.length) {
            removes.push(remove(simulate, simulateIndex, null))
            simulateItem = simulate[simulateIndex]
        }

        if (!simulateItem || simulateItem.key !== wantedItem.key) {
            // if we need a key in this position...
            if (wantedItem.key) {
                if (simulateItem && simulateItem.key) {
                    // if an insert doesn't put this key in place, it needs to move
                    if (bKeys[simulateItem.key] !== k + 1) {
                        removes.push(remove(simulate, simulateIndex, simulateItem.key))
                        simulateItem = simulate[simulateIndex]
                        // if the remove didn't put the wanted item in place, we need to insert it
                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
                            inserts.push({key: wantedItem.key, to: k})
                        }
                        // items are matching, so skip ahead
                        else {
                            simulateIndex++
                        }
                    }
                    else {
                        inserts.push({key: wantedItem.key, to: k})
                    }
                }
                else {
                    inserts.push({key: wantedItem.key, to: k})
                }
                k++
            }
            // a key in simulate has no matching wanted key, remove it
            else if (simulateItem && simulateItem.key) {
                removes.push(remove(simulate, simulateIndex, simulateItem.key))
            }
        }
        else {
            simulateIndex++
            k++
        }
    }

    // remove all the remaining nodes from simulate
    while(simulateIndex < simulate.length) {
        simulateItem = simulate[simulateIndex]
        removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key))
    }

    // If the only moves we have are deletes then we can just
    // let the delete patch remove these items.
    if (removes.length === deletedItems && !inserts.length) {
        return {
            children: newChildren,
            moves: null
        }
    }

    return {
        children: newChildren,
        moves: {
            removes: removes,
            inserts: inserts
        }
    }
}

function remove(arr, index, key) {
    arr.splice(index, 1)

    return {
        from: index,
        key: key
    }
}

function keyIndex(children) {
    var keys = {}
    var free = []
    var length = children.length

    for (var i = 0; i < length; i++) {
        var child = children[i]

        if (child.key) {
            keys[child.key] = i
        } else {
            free.push(i)
        }
    }

    return {
        keys: keys,     // A hash of key name to index
        free: free      // An array of unkeyed item indices
    }
}

function appendPatch(apply, patch) {
    if (apply) {
        if (isArray(apply)) {
            apply.push(patch)
        } else {
            apply = [apply, patch]
        }

        return apply
    } else {
        return patch
    }
}


/***/ }),
/* 41 */
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
/* 42 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__list_data__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mal_api__ = __webpack_require__(41);
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
          resolve(data);
          console.warn('Using fake data');

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
/* 43 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 44 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shell__ = __webpack_require__(14);




__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__shell__["a" /* default */])({
  log: true
});


/***/ })
/******/ ]);