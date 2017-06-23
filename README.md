# ChainsawSuit Bot

A bot in dev for the ChainsawSuit Original Discord server!

# Getting Started

This guide assumes you already have Node JS installed on your machine and know how to use the command line.

- Run `npm install` to download all required packages.
- Duplicate `client_key.json.skel` and rename it to `client_key.json`.
- Add your bot's credentials to  `client_key.json`.
- Run `node index.js` in your console. If you see "I am ready!" in your console, you are good to go!

# To Do

- `css-bot.js`, line 28: Figure out how to get the user's role id! (may require parsing the IDs of all the roles a user has. So far I can only find the `hasRole()` function)
- Check if a user has permission to use a command before allowing it
- Automatically post new episodes to their respective channel (and general) when they are uploaded.
- Create functions in `db.js` for commonly used information (i.e. find out if users can use commands, what feeds a channel can call `!new` for, etc)
- Create table: `db/channels.json`
- Create table: `db/dyk.json`
