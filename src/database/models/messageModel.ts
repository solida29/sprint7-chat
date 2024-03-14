import { Schema, model } from 'mongoose';

interface IMessage {
  username: string;
  message: string;
  room: string;
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>({
  username: {
    type: String,
    required: true,
    trim: true, // Elimina los espacios en blanco al principio y al final
    minlength: 1 // El mensaje debe tener al menos 1 carácter
  },
  message: {
    type: String,
    required: true, // El mensaje es obligatorio
    trim: true, // Elimina los espacios en blanco al principio y al final
    minlength: 1 // El mensaje debe tener al menos 1 carácter
  },
  room: {
    type: String,
    trim: true // Elimina los espacios en blanco al principio y al final
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now()
  }
});

export const MessageModel = model('Message', messageSchema);
