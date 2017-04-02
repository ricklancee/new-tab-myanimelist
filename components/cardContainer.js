'use strict';

export default function cardContainer(services, card, refSelector, list) {
  let rootNode = null;
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

  const getSeasonByMonth = function(month) {
    const seasonsByIndex = Object.keys(seasons);
    let index = 0;

    console.log(month);

    for (let season in seasons) {
      if (month >= seasons[season] && month < seasons[seasonsByIndex[index + 1]])
        return season;
      index++;
    }
    return false;
  }

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
      rootNode.classList.add('isEmpty');
      console.warn('! nothing found... show empty state!');
      return;
    }
    rootNode.classList.remove('isEmpty');

    const stateToLoad = getStateToLoad();
    renderCardsToRootNode(stateToLoad);
    reCalcContainerHeight();
  };

  const renderNextStatePartial = function() {
    if (renderedCards.length >= state.length) {
      console.info('Completely rendered state to DOM.');
      return;
    }

    const stateToLoad = getStateToLoad();
    renderCardsToRootNode(stateToLoad);
    reCalcContainerHeight();
  };

  const renderCardsToRootNode = function(data) {
    data.forEach(anime => {
      const node = document.createElement('li');
      const animeCard = card(services, node, anime);
      animeCard.render();
      renderedCards.push({ instance: animeCard, id: animeCard.state.id, node});
    });

    // Append all cards to dom after creating the cards
    // this prevents a read, write, read, write cycle
    renderedCards.forEach(({node}) => rootNode.appendChild(node));
  };

  const getStateToLoad = function() {
    const loaded = renderedCards.length;
    const slicedState = state.slice(loaded, loaded + loadLimit);
    return slicedState;
  };

  const reCalcContainerHeight = function() {
    containerHeight = rootNode.offsetTop + rootNode.offsetHeight;
  };

  const updateState = function(newState) {
    console.info('updateState: Updating to new state.');
    data = newState.slice();

    const sortedData = sortData(data);
    const filteredData = filterData(sortedData);

    state = filteredData;
  };

  const register = function() {
    if (rootNode)
      throw new Error('register(): rootNode already set, cannot register component');

    rootNode = document.querySelector(refSelector);

    window.addEventListener('scroll', handleLoadingOfNextStateOnScroll, { passive: true });
    window.addEventListener('resize', () => { windowHeight = window.innerHeight }, { passive: true });

    let status = 'watching';
    let season = 'all';
    let year = 'all';

    // Container event handlers.
    const filterStatusElements = document.querySelectorAll('[data-filter-status]');
    const filterCurrentSeason = document.querySelector('[data-filter-season="current"]');
    const filterAllSeasons = document.querySelector('[data-filter-season="all"]');

    const now = new Date();
    const currentSeason = getSeasonByMonth(now.getMonth());
    const currentYear = now.getFullYear();

    filterCurrentSeason.setAttribute('data-season', currentSeason);
    filterCurrentSeason.setAttribute('data-year', currentYear);
    filterCurrentSeason.textContent = currentSeason.charAt(0).toUpperCase() +
      currentSeason.slice(1) + ' ' + currentYear;

    document.querySelector('[data-filter-status="'+ status +'"]').classList.add('active');
    filterAllSeasons.classList.add('active');
    const handleFilterCurrentSeasonClick = function(event) {
      filterAllSeasons.classList.remove('active');
      event.target.classList.add('active');

      season = currentSeason;
      year = currentYear;

      filter(status, season, year);
      render();
    };

    const handleFilterAllSeasonsClick = function(event) {
      filterCurrentSeason.classList.remove('active');
      event.target.classList.add('active');

      season = 'all';
      year = 'all';

      filter(status, season, year);
      render();
    };

    const handleFilterStatusClick = function(event) {
      status = event.target.getAttribute('data-filter-status');

      filterStatusElements.forEach(el => el.classList.remove('active'));
      event.target.classList.add('active');

      filter(status, season, year);
      render();
    };

    filterStatusElements.forEach(el => el.addEventListener('click', handleFilterStatusClick));
    filterCurrentSeason.addEventListener('click', handleFilterCurrentSeasonClick);
    filterAllSeasons.addEventListener('click', handleFilterAllSeasonsClick);

    filter(status, season, year);
    render();
  };

  return {
    register,
    filter,
    state,
    updateState,
    render,
    renderNextStatePartial
  };
};
