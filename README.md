# MyAnimeList in a new tab for chrome

This chrome extension replaces your new tab window with your list from myanimelist.net. [Demo](https://ricklancee.github.io/new-tab-myanimelist/)

![New Tab MyAnimeList - MyAnimeList screen](https://i.imgur.com/JYn9OPl.jpg)

Update shows to you MAL and see airing dates (countdown)

![New Tab MyAnimeList - Complete shows](http://i.imgur.com/hMOUomi.jpg)

Complete shows that are finished 

![New Tab MyAnimeList - Seasonal shows screen](https://i.imgur.com/RdSNU7T.jpg)

See all airing shows this season

![New Tab MyAnimeList - Login screen](https://i.imgur.com/OqkOZrG.jpg)

#### Features
- Display your anime list from myanimelist.net in a chrome new tab
- Show currently airing shows from this season 
- Change watched episodes and complete shows when finished watching
  - Sets the finished date when you complete a show
  - Sets the start date when you start watching a show

#### Planned Features
- Add settings for customization
  - backgrounds
  - colors
  - link direction
  - etc

### Manually install the extension (unpacked)

1. [Download](https://github.com/ricklancee/new-tab-myanimelist/archive/master.zip) and unpack the zip files somewhere save.
2. Go to the chrome extension settings by typing in chrome://extensions/ in your address bar.
3. Check the checkbox 'enable developer mode' and click "Load unpacked extension..."
4. Select the `build/` folder inside the unpacked zip.
5. Open a new tab and login to your mal account.

### Motivation
I am way too lazy to go to myanimelist.net and update anime on my list. This is one step faster. Also it quickly shows me what shows i am watching and when the next episode airs

### Build Source files

1. Install dependencies with `npm install`
3. Create a `.env` file in the project root fill it with [AniList client credentials](https://anilist-api.readthedocs.io/en/latest/introduction.html#creating-a-client) (see below)
2. Build the app files with `npm run build`

```sh
# .env
REACT_APP_ANI_LIST_CLIENT_ID=your-ani-list-client-id
REACT_APP_ANI_LIST_CLIENT_SECRET=your-ani-list-client-secret
```
**Development**  

Install dependencies and run `npm run start`. The app is served to http://localhost:3000. You propabably want to disable web security temporarily because request to MAL won't work in localhost because of CORS. For mac: `open -a Google\ Chrome --args --disable-web-security --user-data-dir`. 
