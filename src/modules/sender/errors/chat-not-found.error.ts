export class ChatNotFoundError extends Error {
  constructor(chatID: number) {
    super(`chat not found with ID ${chatID}`);
  }
}
