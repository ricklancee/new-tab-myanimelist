'use strict';

export default function cardContainer(services, card, refElement, list) {
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
