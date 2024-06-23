# gh-previews

A discord bot to preview code from github code links directly in discord

Objective is to match this kind of link: github.com/itsvyle/gh-previews/blob/74f1ef26acfec41574d84b335fce0ee431a424af/README.md#L2

This is useful for code review and sharing code snippets in discord, as it makes asking questions about code snippets easier, without the need for screenshots everywhere.

## Usage

Create a `.env` file in the root directory with the following content:

```
DISCORD_TOKEN=your_discord_bot_token
GITHUB_PAT=<a github PAT to access private repos, this is optional>
```

Then, run `yarn install` and `yarn start` to start the bot.

You will of course need yarn, node, and a discord bot created with the token obtained

You can also use the dockerfile to build and run the bot in a container; just mount an `--env-file` with the same content as the `.env` file, or pass the environment variables directly.

When adding the bot to your server, make sure to give it the following permissions:

-   Send Messages
-   Read messages/channels
-   Read messages history - this is essential as you need to be able to read the message history to reply to a message
-   OPTIONAL: manage messages - this will let the bot delete the embed that shows up in the original embed

Discord developper portal screenshot:
![image](https://github.com/itsvyle/gh-previews/assets/65409906/ad977498-203d-4093-82cb-a38be9bb367e)

## Example

### Copying links

This can be done in github:
![Screenshot 2024-06-23 113644](https://github.com/itsvyle/gh-previews/assets/65409906/b9150a34-b6df-4b10-91d8-81efe216bb55)

This can also be done directly in VSCode:
![Screenshot 2024-06-23 113911](https://github.com/itsvyle/gh-previews/assets/65409906/98dcb2b9-d67c-4ab9-b7f5-d2abdc5673ee)

### Display snippets

Once the link is copied, just put it in a discord message, and the bot will answer automatically!
![image](https://github.com/itsvyle/gh-previews/assets/65409906/5097e19f-5a60-4da3-8f51-67dedc91e45c)

## Roadmap:

-   Add authentication, so that it can access code from private repositories ON REPOS I DONT OWN
-   Add support for knowing who edited the file last, etc.
-   Add support for not having a line number
