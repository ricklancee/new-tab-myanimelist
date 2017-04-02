'use strict';

export default function card({ toHtml, bus, date }, refElement, anime) {
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

  const formatCountdown = function() {
    if (!anime.airing) return;

    const airDate = anime.airing.time;
    const airs = date(airDate);
    const today = date();

    if (airs.isBetween(today.startOf('day'), today.endOf('day'))) {
      return 'Airs today ' + airs.from(today);;
    }

    if(airs.diff(today, 'days') === 6) {
      return 'Aired today';
    }

    const dayOfTheWeek = airs.format("dddd");

    return 'Airs '+ dayOfTheWeek + 's (' + airs.from(today, true) +' left)';
  };

  const airedToday = function() {

  };

  const cardTemplate = function(anime) {
    const template = `
      <div class="card card--showTitleOnHover isStatus-${anime.status}" data-id="${anime.id}">
        <div class="card__title">
          <p data-ref="title">${ anime.title }</p>
        </div>
        <div class="card__airing${ anime.airing ? ' isShown' : ''}" data-ref="airing">${ anime.airing ? formatCountdown() : '' }</div>
        <figure class="card__image-container">
          <a href="https://myanimelist.net/anime/${anime.id}" target="_blank" class="card__link">
            <img data-ref="image" src="${anime.image}" alt="${anime.title}">
          </a>
        </figure>
        <div class="card__controls">
          <div class="card__status-buttons">
            <button class="card__complete-button" data-ref="complete">Complete</button>
          </div>
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
    if (state.currentEpisode === anime.episodeCount) {
      showCompleteButton();
      return;
    }

    if (state.currentEpisode === anime.episodeCount -1)
      elements.episodeCount.classList.add('completed');

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
    if (state.airing) {
      const updateTimer = function() {
        elements.airing.classList.add('isShown');
        elements.airing.textContent = formatCountdown(state.airing.time);
      };

      setInterval(updateTimer, 1000 * 60);
      updateTimer();

      if (state.airing.next_episode) {
        if (state.airing.next_episode - 1 !== anime.currentEpisode)
          elements.episodeCount.classList.add('next-episode');

        elements.episodeCount.textContent = state.airing.next_episode - 1;
        anime.episodeCount = state.airing.next_episode - 1;
      }

    }
  };

  const showCompleteButton = function() {

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
    elements.airing = rootNode.querySelector('[data-ref="airing"]');

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
    console.log('card is updated!', newState);
    updateState(newState);
    updateCard();
  });

  return {
    state,
    updateCard,
    render
  };
};
