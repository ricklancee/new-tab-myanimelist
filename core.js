'use strict';

import card from './card';
import cardContainer from './cardContainer';
import actions from './actions';

export default async function core(services) {
  console.info('initialize with ', services);

  const provider = services.providers.mal;

  // Bootstrap the application
  console.info('initialize app...');
  actions(services.bus, provider);

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
  const container = cardContainer(services, card, containerEl, list);

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
