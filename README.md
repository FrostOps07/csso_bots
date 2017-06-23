# ChainsawSuit Bot

A bot in dev for the ChainsawSuit Original Discord server!

# Getting Started

This guide assumes you already have Node JS installed on your machine and know how to use the command line.

- Run `npm install` to download all required packages.
- Duplicate `client_key.json.skel` and rename it to `client_key.json`.
- Add your bot's credentials to  `client_key.json`.
- Run `node index.js` in your console. If you see "I am ready!" in your console, you are good to go!

# To Do

- Check if a user has permission to use a command before allowing it
- Automatically post new episodes to their respective channel (and general) when they are uploaded.
- Merge `feeds.js` and `feeds-dev.js`. Switch each feed's "channel" field to an array of channels. This way we can include both dev and prod channels.
- Create `db.js` model. This way we can import the entire database at the top of each file instead of importing each file individually.
- Create functions in `db.js` for commonly used information (i.e. find out if users can use commands, what feeds a channel can call `!new` for, etc)
- Create table: `db/channels.json`
- Create table: `db/dyk.json`
