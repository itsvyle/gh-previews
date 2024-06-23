import "dotenv/config";
import axios from "axios";
import { assert } from "console";
import type { MessageReplyOptions } from "discord.js";
import { ButtonBuilder, ActionRowBuilder, ButtonStyle } from "discord.js";
const linkRegex =
    /https?:\/\/github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.+)#L(\d+)(?:-L(\d+))?/;
export function containsGithubLink(message: string): boolean {
    return message.includes("github.com") && linkRegex.test(message);
}

function leftPad(num: number, size: number): string {
    let s = String(num);
    while (s.length < size) s = "0" + s;
    return s;
}

const GITHUB_PAT = process.env.GITHUB_PAT;

const axiosOpts = { headers: {} };
if (GITHUB_PAT) {
    axiosOpts["headers"] = {
        Authorization: `Bearer ${GITHUB_PAT}`,
    };
}

const linesSpan = 10;

const M_OWNER = 1;
const M_REPO = 2;
const M_REF = 3;
const M_PATH = 4;
const M_LINE = 5;
const M_ENDLINE = 6;
export async function prepareReply(
    message: string
): Promise<MessageReplyOptions> {
    const parse = linkRegex.exec(message); // bug: can't use linkRegex here, as it's stateful
    if (!parse) return { content: "Invalid GitHub link" };
    const path = parse[M_PATH]!;

    const url = `https://api.github.com/repos/${parse![M_OWNER]}/${parse![M_REPO]}/contents/${path}?ref=${parse![M_REF]}`;
    // const url = `https://raw.githubusercontent.com/${parse[M_OWNER]}/${parse[M_REPO]}/${parse[M_REF]}/${path}`;

    const lineNumber = parseInt(parse[M_LINE]!);
    const endLineNumber = parse[M_ENDLINE]
        ? parseInt(parse[M_ENDLINE]!)
        : lineNumber;

    const response = await axios.get(url, axiosOpts);

    // Parse the response
    if (response.status !== 200) {
        throw new Error(`Failed to fetch ${url}`);
    }
    const data = response.data;
    assert(data, "No data in response");
    assert(data.encoding === "base64", "Expected base64 encoding");
    assert(data.content, "No content in response");

    const content = Buffer.from(data.content, "base64").toString("utf-8");
    let lines = content.split("\n");
    const start = Math.max(0, lineNumber - linesSpan);
    const end = Math.min(
        lines.length,
        lineNumber + linesSpan - 1 + (endLineNumber - lineNumber)
    );
    const maxLineNumberLength = String(lines.length).length;
    const selectedLinePrefix = new Array(maxLineNumberLength)
        .fill(">")
        .join("");
    lines = lines.map((line: string, index: number) => {
        if (
            index === lineNumber - 1 ||
            (endLineNumber !== lineNumber &&
                lineNumber <= index &&
                index < endLineNumber)
        ) {
            return `${selectedLinePrefix}  ${line}`;
        }
        return `${leftPad(index + 1, maxLineNumberLength)}  ${line}`;
    });
    let snippet = lines.slice(start, end).join("\n");

    if (!path) {
        throw new Error("Couldn't find path in the URL");
    }
    const extension = path.split(".").pop();
    snippet = `\`\`\`${extension}\n${snippet}\n\`\`\``;

    const html_url = `https://github.com/${parse[M_OWNER]}/${parse[M_REPO]}/blob/${parse[M_REF]}/${parse[M_PATH]}#L${lineNumber}`;
    let res = `Snippet from **/${path}**:#L${lineNumber}\n\n${snippet}`;

    if (res.length > 2000) {
        res = `Snippet from **/${path}**:#L${lineNumber}\n\nSnippet is too long to display`;
    }

    const viewOnGithub = new ButtonBuilder()
        .setLabel("View on GitHub")
        .setStyle(ButtonStyle.Link)
        .setURL(html_url);

    const row = new ActionRowBuilder().addComponents(viewOnGithub);

    return {
        content: res,
        allowedMentions: {
            repliedUser: false,
        },
        // @ts-expect-error
        components: [row],
    };
}
