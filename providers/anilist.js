'use strict';

export default function anilist(storage) {
  const clientId = 'aardappeltaart-cmqds';
  const clientSecret = 'X9X9Hok53RIFmFT0iuXHa9GlE08eq';

  const base = 'https://anilist.co/api/';
  let token = null;

  const constructUriParams = function(params) {
    const query = Object.keys(params)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
        .join('&');

    return query;
  }

  const fetchClientCredentialsToken = function() {
    const authEndpoint = 'auth/access_token';

    const params = {
      grant_type: "client_credentials",
      client_id:  clientId,
      client_secret:  clientSecret
    };


    const queryParams = constructUriParams(params);

    return fetch(base + authEndpoint + '?' + queryParams, { method: "POST" })
      .then(response => response.json())
      .then(bearerToken => {
        token = bearerToken;

        if (token.errors) {
          return Promise.reject('fetchClientCredentialsToken failed', token);
        }

        cacheToken(token);
        return Promise.resolve(bearerToken);
      });
  };

  const cacheToken = function(token) {
    storage.setItem('app.aniToken', JSON.stringify(token));
  };

  const getToken = function() {
    if (!token) {
      const cachedToken = storage.getItem('app.aniToken');

      if (cachedToken)
        return JSON.parse(cachedToken);

      return null;
    }

    return token;
  };

  const getClientCredentialsToken = function() {
    token = getToken();

    if (!token || Date.now() > token.expires + token.expires_in) {
      console.info('getClientCredentialsToken: Refreshing token...');
      return fetchClientCredentialsToken();
    }

    return Promise.resolve(token);
  };

  const formatTitle = (title) => {
    return title.replace(/\s+/g, '')
          .replace('-', '')
          .replace('_', '')
          .replace(':', '')
          .replace(/'|"/, '')
          .toLowerCase();
  };

  const getAiringDatesByTitles = function(titles) {
    return getClientCredentialsToken().then(token => {

      const date = new Date();
      const queryParams = constructUriParams({
        year: date.getFullYear(),
        status: "Currently Airing",
        airing_data: "true",
        full_page: "true"
      });

      return fetch(base + 'browse/anime?' + queryParams, {
        headers: new Headers({
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Bearer ${token.access_token}`
        })
      })
      .then(response => response.json())
      .then(result => {
        let found = [];
        titles = titles.map(formatTitle);

        result.forEach(anime => {
          if (
            titles.indexOf(formatTitle(anime.title_romaji)) !== -1 ||
            titles.indexOf(formatTitle(anime.title_english)) !== -1 ||
            titles.indexOf(formatTitle(anime.title_japanese)) !== -1
          ) {
            const index = titles.findIndex(title => title === formatTitle(anime.title_romaji));
            return found.push({ index, airing: anime.airing });
          }

          const synonyms = anime.synonyms.map(formatTitle);
          for (let synonym of synonyms) {
            if (titles.indexOf(synonym) !== -1) {
              const index = titles.findIndex(title => title === synonym);
              return found.push({ index, airing:anime.airing });
            }
          }
        });

        return Promise.resolve(found);
      });
    });
  };

  return {
    getAiringDatesByTitles
  }
}
