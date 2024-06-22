const linkRegex =
    /(https?:\/\/github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.+?)#L(\d+))/g;
export function containsGithubLink(message: string): boolean {
    return linkRegex.test(message.replaceAll("\n", " "));
}

export function prepareReply(message: string): string {
    const matches = message.match(linkRegex);
    if (!matches) {
        return "";
    }
    const links = matches.map((match) => {
        return match
            .replace(
                /https?:\/\/github\.com\//,
                "https://raw.githubusercontent.com/"
            )
            .replace("/blob/", "/");
    });
    return `Found ${matches.length} GitHub link(s): ${links.join(", ")}`;
}
