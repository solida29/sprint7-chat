import { IMessage } from '../domain/IMessage';
import { MessageModel } from './models/messageModel';

export const saveMessage = (msg: IMessage) => {
  const { username, message, room } = msg;

  const newMessage = new MessageModel({
    username: username,
    message: message,
    room: room
  });

  newMessage.save().catch((err) => {
    console.log(err);
  });
};
