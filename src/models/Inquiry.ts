import mongoose, { Schema, Document, Model, models, model } from 'mongoose';

export interface IInquiry extends Document {
  name: string;
  email: string;
  phone: string;
  message: string;
  property_name: string;
  createdAt: Date;
  updatedAt: Date;
}

const inquirySchema = new Schema<IInquiry>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    message: { type: String, required: true },
    property_name: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Inquiry: Model<IInquiry> = models.Inquiry || model<IInquiry>('Inquiry', inquirySchema);
