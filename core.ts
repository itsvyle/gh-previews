const linkRegex =
    /(https?:\/\/github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.+?)#L(\d+))/g;
export function containsGithubLink(message: string): boolean {
    return linkRegex.test(message.replaceAll("\n", " "));
}

export function prepareReply(message: string): string {
    const parse =
        /.*(https?:\/\/github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.+?)#L(\d+)).*/g.exec(
            message
        ); // bug: can't use linkRegex here, as it's stateful

    // const APIUrl = `https://api.github.com/repos/${parse![2]}/${parse![3]}/contents/${parse![5]}?ref=${parse![4]}`;
    const url = `https://raw.githubusercontent.com/${parse![2]}/${parse![3]}/${parse![4]}/${parse![5]}`;
    return url;

    return "";
}
