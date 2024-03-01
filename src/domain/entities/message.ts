export class Message {
  username: string;
  message: string;
  room: string;

  constructor(username: string, message: string, room: string) {
    this.username = username;
    this.message = message;
    this.room = room;
  }
}
