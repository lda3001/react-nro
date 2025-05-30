import mongoose from 'mongoose';

export interface ICharacter {
  name: string;
  description: string;
  image: string;
  skills: Array<{
    name: string;
    description: string;
    icon: string;
  }>;
}

const CharacterSchema = new mongoose.Schema<ICharacter>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  skills: [
    {
      name: { type: String, required: true },
      description: { type: String, required: true },
      icon: { type: String, required: true },
    },
  ],
});

export default mongoose.model<ICharacter>('Character', CharacterSchema);
