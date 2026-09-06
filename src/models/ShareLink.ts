import mongoose, { Schema, Document, Model, models, model } from 'mongoose';

export interface IShareLinkPermissions {
  showBasicDetails: boolean;
  showFullDescription: boolean;
  showAdditionalPhotos: boolean;
  showVideos: boolean;
  showFloorPlans: boolean;
  showPublicDocuments: boolean;
  showPrice: boolean;
  showExactLocation: boolean;
  showAmenities: boolean;
  showSpecifications: boolean;
  showOwnerDetails: boolean;
  [key: string]: boolean; // allow any future permission fields
}

export interface IShareLink extends Document {
  token: string;
  propertyId: mongoose.Types.ObjectId;
  createdBy: string;
  leadName?: string;
  leadPhone?: string;
  leadEmail?: string;
  salespersonId?: string;
  expiresAt?: Date;
  passcode?: string;
  isRevoked: boolean;
  permissions: IShareLinkPermissions;
  allowedDocumentIds: string[];
  allowedMediaIds: string[];
  viewsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const permissionsSchema = new Schema(
  {
    showBasicDetails: { type: Boolean, default: true },
    showFullDescription: { type: Boolean, default: true },
    showAdditionalPhotos: { type: Boolean, default: true },
    showVideos: { type: Boolean, default: true },
    showFloorPlans: { type: Boolean, default: true },
    showPublicDocuments: { type: Boolean, default: true },
    showPrice: { type: Boolean, default: true },
    showExactLocation: { type: Boolean, default: false },
    showAmenities: { type: Boolean, default: true },
    showSpecifications: { type: Boolean, default: true },
    showOwnerDetails: { type: Boolean, default: false },
  },
  { _id: false, strict: false }  // strict:false = save ALL fields even unknown ones
);

const shareLinkSchema = new Schema<IShareLink>(
  {
    token: { type: String, required: true, unique: true, index: true },
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    createdBy: { type: String, required: true },
    leadName: { type: String, default: '' },
    leadPhone: { type: String, default: '' },
    leadEmail: { type: String, default: '' },
    salespersonId: { type: String, default: '' },
    expiresAt: { type: Date },
    passcode: { type: String, default: '' },
    isRevoked: { type: Boolean, default: false },
    permissions: { type: permissionsSchema, default: () => ({}) },
    allowedDocumentIds: { type: [String], default: [] },
    allowedMediaIds: { type: [String], default: [] },
    viewsCount: { type: Number, default: 0 },
  },
  { timestamps: true, strict: false }
);

// Delete cached model on hot reload so schema changes take effect without restart
if (models.ShareLink) {
  delete (mongoose as any).models.ShareLink;
}

export const ShareLink: Model<IShareLink> = model<IShareLink>('ShareLink', shareLinkSchema);

