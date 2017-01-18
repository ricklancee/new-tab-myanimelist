'use strict';

import card from './card';
import actions from './actions';

export default async function core(services) {
  console.info('initialize with ', services);

  // Bootstrap the application
  console.info('initialize app...');
  actions(services.bus);

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

    const animeCard = card(services, node, anime);

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
