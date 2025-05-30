import mongoose from 'mongoose';

export interface INews {
  title: string;
  category: string;
  content: string;
  link: string;
  published: Date;
}

const NewsSchema = new mongoose.Schema<INews>({
  title: { type: String, required: true },
  category: { type: String, required: true },
  content: { type: String, required: true },
  link: { type: String, required: true },
  published: { type: Date, default: Date.now },
});

export default mongoose.model<INews>('News', NewsSchema);
