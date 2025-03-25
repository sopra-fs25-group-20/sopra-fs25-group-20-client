export type ChatMessage = {
    nickname: string;
    message: string;
};

export function isChatMessage(data: any): data is ChatMessage {
    return (
        typeof data === "object" &&
        data !== null &&
        typeof data.nickname === "string" &&
        typeof data.message === "string"
    );
}