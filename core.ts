import axios from "axios";
const linkRegex =
    /(https?:\/\/github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.+?)#L(\d+))/g;
export function containsGithubLink(message: string): boolean {
    return linkRegex.test(message.replaceAll("\n", " "));
}

const linesSpan = 5;

export async function prepareReply(message: string): Promise<string> {
    const parse =
        /.*(https?:\/\/github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.+?)#L(\d+)).*/g.exec(
            message
        ); // bug: can't use linkRegex here, as it's stateful

    // const APIUrl = `https://api.github.com/repos/${parse![2]}/${parse![3]}/contents/${parse![5]}?ref=${parse![4]}`;
    const url = `https://raw.githubusercontent.com/${parse![2]}/${parse![3]}/${parse![4]}/${parse![5]}`;

    const lineNumber = parseInt(parse![6]!);

    let snippet = await axios.get(url).then((response) => {
        const lines = response.data.split("\n");
        const start = Math.max(0, lineNumber - linesSpan);
        const end = Math.min(lines.length, lineNumber + linesSpan - 1);
        const codeSnippet = lines.slice(start, end).join("\n");
        return codeSnippet;
    });
    return snippet;
}
