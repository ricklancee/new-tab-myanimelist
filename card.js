'use strict';

export default function card({toHtml, bus}, refElement, anime) {
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
