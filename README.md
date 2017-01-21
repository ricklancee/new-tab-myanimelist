# MyAnimeList extension for chrome

This chrome extension replaces your new tab window with your list from myanimelist.net.

![](http://i.imgur.com/1TLAdjf.jpg)
![](http://i.imgur.com/PlCqird.jpg)

#### Features
- Display your anime list from myanimelist.net in new tabs
- Ability to change watched episodes
- List is cached locally so it's pretty fast to load.

#### Planned Features
- Change status of anime.
- Add settings for customization (backgrounds, colors Etc)
- Sort by airing. Shows which watching shows air next.
- Manga support

### Motivation
I personally am too lazy to go to myanimelist.net and update anime on my list. This is one step faster. Also it quickly shows me what shows i am watching and when the next episode airs (this is a planned feature)

### Install the extension (unpacked)

Clone or download this repository. Go to chrome://extensions/ and enable developer mode. Click "Load unpacked extension..." and select the repository folder you just downloaded. Open a new tab and login to your mal account.

### Build Source files

1. Install dependencies with `npm install`
2. Build the app files with `npm run build`

To watch for changes run `npm run watch`. Zip the app with `npm run zip`.

*A disclaimer:* Because this application runs in your browser locally on your pc your username and passwords are stored in localStorage as plain text. Meaning, anyone using your computer can retrieve your password IF you are logged in and IF they check localStorage. This is propably not a huge issue unless you're really paranoid about someone going trough the trouble of using your pc and retrieving your stored password and changing your list --- and you're propably already logged into mal so... Sadly there is no way around this since myanimelist.net doesn't use OAuth or any other form of token based api authentication. Another option is using a remote server to store the passwords, which i really don't want to do since this requires hosting a server and storing myanimelist passwords on it which propably is even less secure. So yeah... if you're paranoid, don't use this.

