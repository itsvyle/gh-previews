# gh-previews

A discord bot to preview code from github code links directly in discord

Objective is to match this kind of link: https://github.com/itsvyle/gh-previews/blob/74f1ef26acfec41574d84b335fce0ee431a424af/README.md#L2

This is useful for code review and sharing code snippets in discord, as it makes asking questions about code snippets easier, without the need for screenshots everywhere.

## Usage

Create a `.env` file in the root directory with the following content:

```
DISCORD_TOKEN=your_discord_bot_token
```

Then, run `yarn install` and `yarn start` to start the bot.

You will of course need yarn, node, and a discord bot created with the token obtained
