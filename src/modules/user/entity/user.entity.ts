export class User {
  constructor(id: number, chatID: bigint) {
    this.id = id;
    this.chatID = chatID;
  }

  id: number;
  chatID: bigint;
}
