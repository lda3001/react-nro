import mongoose from 'mongoose';

export interface IFeature {
  title: string;
  description: string;
  image: string;
  order: number;
}

const FeatureSchema = new mongoose.Schema<IFeature>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  order: { type: Number, default: 0 },
});

export default mongoose.model<IFeature>('Feature', FeatureSchema);
