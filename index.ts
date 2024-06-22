import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";
import { containsGithubLink, prepareReply } from "core";

const discordToken = process.env.DISCORD_TOKEN;
if (!discordToken) {
    throw new Error("Missing Discord client ID or token");
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.on("ready", () => {
    console.log(`Logged in as ${client.user!.tag}!`);
});

client.on("messageCreate", (message) => {
    if (message.author.bot) return;
    if (containsGithubLink(message.content)) {
        prepareReply(message.content)
            .then(async (r) => {
                if (!r) return;
                message
                    .reply({
                        content: r,
                        allowedMentions: {
                            repliedUser: false,
                        },
                    })
                    .catch(console.error);
            })
            .catch((e) => {
                console.error(e);
                message
                    .reply({
                        content: "Error fetching code snippet",
                        allowedMentions: {
                            repliedUser: false,
                        },
                    })
                    .catch(console.error);
            });
    }
});

client.login(discordToken);
