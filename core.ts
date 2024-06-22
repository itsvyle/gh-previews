const linkRegex = /(https?:\/\/github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.+?)#L(\d+))/g;
export function containsGithubLink(message: string): boolean {
    return linkRegex.test(message);
}