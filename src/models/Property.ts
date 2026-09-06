import mongoose, { Schema, Document, Model, models, model } from 'mongoose';

export type VisibilityLevel = 'PUBLIC' | 'CUSTOMER_SHARED' | 'ALYORA_TEAM' | 'ADMIN_ONLY';

export interface IMediaAsset {
  id?: string;
  secure_url: string;
  public_id: string;
  visibility: VisibilityLevel;
  type?: 'photo' | 'video' | 'floorplan';
  caption?: string;
}

export interface IPropertyDocument {
  id?: string;
  name: string;
  url: string;
  public_id: string;
  file_type: string;
  visibility: VisibilityLevel;
  verificationStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED';
  version?: string;
  notes?: string;
}

export interface IOwnerDetails {
  name?: string;
  phone?: string;
  email?: string;
  notes?: string;
}

export interface IBrokerDetails {
  name?: string;
  phone?: string;
  email?: string;
  agency?: string;
}

export interface IPropertySpecification {
  key: string;
  value: string;
}

export interface IProperty extends Document {
  name: string;
  location: string;
  price: string;
  negotiationPrice?: string;
  image: IMediaAsset;
  image_url: string;
  media: IMediaAsset[];
  documents: IPropertyDocument[];
  tag: string;
  tag_color: string;
  beds: string;
  baths: string;
  area: string;
  plot: string;
  propertyType: string;
  description: string;
  featured: boolean;
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'SOLD' | 'ARCHIVED';

  // Custom public features
  amenities: string[];
  specifications: IPropertySpecification[];

  // Private & Confidential Fields
  ownerDetails?: IOwnerDetails;
  brokerDetails?: IBrokerDetails;
  internalNotes?: string;
  commission?: string;
  exactAddress?: string;
  gpsCoordinates?: { lat?: number; lng?: number };

  createdAt: Date;
  updatedAt: Date;
}

const mediaAssetSchema = new Schema<IMediaAsset>(
  {
    secure_url: { type: String, required: true },
    public_id: { type: String, required: true, default: 'manual' },
    visibility: {
      type: String,
      enum: ['PUBLIC', 'CUSTOMER_SHARED', 'ALYORA_TEAM', 'ADMIN_ONLY'],
      default: 'PUBLIC',
    },
    type: { type: String, enum: ['photo', 'video', 'floorplan'], default: 'photo' },
    caption: { type: String, default: '' },
  },
  { _id: true }
);

const propertyDocumentSchema = new Schema<IPropertyDocument>(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    public_id: { type: String, required: true, default: 'manual' },
    file_type: { type: String, default: 'pdf' },
    visibility: {
      type: String,
      enum: ['PUBLIC', 'CUSTOMER_SHARED', 'ALYORA_TEAM', 'ADMIN_ONLY'],
      default: 'ADMIN_ONLY',
    },
    verificationStatus: { type: String, enum: ['PENDING', 'VERIFIED', 'REJECTED'], default: 'PENDING' },
    version: { type: String, default: '1.0' },
    notes: { type: String, default: '' },
  },
  { _id: true }
);

const ownerDetailsSchema = new Schema<IOwnerDetails>(
  {
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { _id: false }
);

const brokerDetailsSchema = new Schema<IBrokerDetails>(
  {
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    agency: { type: String, default: '' },
  },
  { _id: false }
);

const specificationSchema = new Schema<IPropertySpecification>(
  {
    key: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const propertySchema = new Schema<IProperty>(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: String, required: true },
    negotiationPrice: { type: String, default: '' },
    image: { type: mediaAssetSchema, required: true },
    image_url: { type: String, required: true },
    media: { type: [mediaAssetSchema], default: [] },
    documents: { type: [propertyDocumentSchema], default: [] },
    tag: { type: String, default: 'For Sale' },
    tag_color: { type: String, default: '#3c70b8' },
    beds: { type: String, default: '' },
    baths: { type: String, default: '' },
    area: { type: String, default: '' },
    plot: { type: String, default: '' },
    propertyType: { type: String, default: '' },
    description: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['DRAFT', 'REVIEW', 'PUBLISHED', 'SOLD', 'ARCHIVED'],
      default: 'PUBLISHED',
    },
    amenities: { type: [String], default: [] },
    specifications: { type: [specificationSchema], default: [] },
    ownerDetails: { type: ownerDetailsSchema },
    brokerDetails: { type: brokerDetailsSchema },
    internalNotes: { type: String, default: '' },
    commission: { type: String, default: '' },
    exactAddress: { type: String, default: '' },
    gpsCoordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  { timestamps: true, strict: false }
);

// Force model re-registration on hot reload so schema changes always take effect
if (mongoose.models.Property) {
  delete (mongoose as any).models.Property;
}

export const Property: Model<IProperty> = model<IProperty>('Property', propertySchema);
