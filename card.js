'use strict';

export default function card({ toHtml, bus }, refElement, anime) {
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
