import { containsGithubLink, prepareReply } from "./core";

type Msg = {
    message: string;
    hasPreviewLink: boolean;
};
const messages: Msg[] = [
    {
        message:
            "https://github.com/itsvyle/gh-previews/blob/b51069e3457ae1952336d7b4e4e51118ef889934/package.json#L8",
        hasPreviewLink: true,
    },
    {
        message:
            "https://github.com/itsvyle/gh-previews/blob/b51069e3457ae1952336d7b4e4e51118ef889934/package.json#L1-L8",
        hasPreviewLink: true,
    },
    {
        message:
            "https://github.com/itsvyle/gh-previews/blob/b51069e3457ae1952336d7b4e4e51118ef889934/package.json#L",
        hasPreviewLink: false,
    },
    {
        message:
            "Sup, I have made changes to the package.json; can you tell me why it's not working on line 8?\nhttps://github.com/itsvyle/gh-previews/blob/b51069e3457ae1952336d7b4e4e51118ef889934/package.json#L8",
        hasPreviewLink: true,
    },
];

for (const msg of messages) {
    if (containsGithubLink(msg.message) !== msg.hasPreviewLink) {
        console.error(
            `Test failed for message: '${msg.message}', expected ${
                msg.hasPreviewLink ? "true" : "false"
            }`
        );
        continue;
    }
    prepareReply(msg.message)
        .then((reply) => {
            if (!reply && msg.hasPreviewLink) {
                console.error(
                    `Test failed for message: '${msg.message}', expected a reply, got '${reply}'`
                );
            } else if (
                reply &&
                !msg.hasPreviewLink &&
                !reply.includes("Invalid")
            ) {
                console.error(
                    `Test failed for message: '${msg.message}', expected no reply but got '${reply}'`
                );
            }
        })
        .catch((err) => {
            console.error(`Test failed for message: '${msg.message}'`);
            console.error(err);
        });
}

export {};
