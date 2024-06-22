import axios from "axios";
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

const linesSpan = 10;

const M_OWNER = 1;
const M_REPO = 2;
const M_REF = 3;
const M_PATH = 4;
const M_LINE = 5;
const M_ENDLINE = 6;
export async function prepareReply(message: string): Promise<string> {
    const parse = linkRegex.exec(message); // bug: can't use linkRegex here, as it's stateful
    if (!parse) return "Invalid GitHub link";
    // const APIUrl = `https://api.github.com/repos/${parse![2]}/${parse![3]}/contents/${parse![5]}?ref=${parse![4]}`;
    const path = parse[M_PATH]!;

    const url = `https://raw.githubusercontent.com/${parse[M_OWNER]}/${parse[M_REPO]}/${parse[M_REF]}/${path}`;

    const lineNumber = parseInt(parse[M_LINE]!);
    const endLineNumber = parse[M_ENDLINE]
        ? parseInt(parse[M_ENDLINE]!)
        : lineNumber;
    console.log(lineNumber, endLineNumber);

    let snippet = await axios.get(url).then((response) => {
        let lines = response.data.split("\n");
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

        const codeSnippet = lines.slice(start, end).join("\n");
        return codeSnippet;
    });

    if (!path) {
        throw new Error("Couldn't find path in the URL");
    }
    const extension = path.split(".").pop();
    snippet = `\`\`\`${extension}\n${snippet}\n\`\`\``;

    const html_url = `<https://github.com/${parse[M_OWNER]}/${parse[M_REPO]}/blob/${parse[M_REF]}/${parse[M_PATH]}#L${lineNumber}>`;
    let res = `Snippet from [/${path}](${html_url})\n\n${snippet}`;

    return res;
}
