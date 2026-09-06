import mongoose, { Schema, Document, Model, models, model } from 'mongoose';
import { IMediaAsset } from './Property';

export interface ILocation extends Document {
  name: string;
  sub: string;
  image: IMediaAsset;
  image_url: string;
  createdAt: Date;
  updatedAt: Date;
}

const mediaAssetSchema = new Schema<IMediaAsset>(
  {
    secure_url: { type: String, required: true },
    public_id: { type: String, required: true, default: 'manual' },
  },
  { _id: false }
);

const locationSchema = new Schema<ILocation>(
  {
    name: { type: String, required: true },
    sub: { type: String, default: '' },
    image: { type: mediaAssetSchema, required: true },
    image_url: { type: String, required: true },
  },
  { timestamps: true }
);

export const Location: Model<ILocation> = models.Location || model<ILocation>('Location', locationSchema);
