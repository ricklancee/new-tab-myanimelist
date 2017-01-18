'use strict';

export default function card({ virtualDom, bus }, refElement, anime) {
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
