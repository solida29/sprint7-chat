import { Schema, model } from 'mongoose';

interface IUser {
  username: string;
  password: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true, // Elimina los espacios en blanco al principio y al final
    minlength: 1 // El mensaje debe tener al menos 1 carácter
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now()
  }
});

export const UserModel = model('User', userSchema);
