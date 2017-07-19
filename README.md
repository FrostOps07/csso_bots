# ChainsawSuit Bot

A bot in dev for the ChainsawSuit Original Discord server!

# Getting Started

This guide assumes you already have Node JS installed on your machine and know how to use the command line.

- Run `npm install` to download all required packages.
- Duplicate `client_key.json.skel` and rename it to `client_key.json`.
- Add your bot's credentials to  `client_key.json`.
- Run `node index.js` in your console. If you see "I am ready!" in your console, you are good to go!

# Updating the bot

- SSH in to the server the bot is stored on
- `cd csso_bot` to enter bot directory
- `git pull` to grab updates
- `forever stopall` to end all background processes
- `forever start index.js` to start the bot again

# Dev reference

- Running from EC2: http://shiffman.net/a2z/bot-ec2/

# To Do

- Automatically post new episodes to their respective channel (and general/spamhalla/etc) when they are uploaded and detected in their RSS feed.
- Create `/db/channels.json` to make the above to-do easier
- For `!commands`, show a list of the roles that can access each command
- New command: `!random`, like `!new`, but, uh, random.
