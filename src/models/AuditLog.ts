import mongoose, { Schema, Document, Model, models, model } from 'mongoose';

export interface IAuditLog extends Document {
  shareLinkId?: mongoose.Types.ObjectId;
  propertyId: mongoose.Types.ObjectId;
  action: 'LINK_CREATED' | 'LINK_VIEWED' | 'DOCUMENT_VIEWED' | 'DOCUMENT_DOWNLOADED' | 'LINK_REVOKED' | 'INQUIRY_SUBMITTED';
  ipAddress?: string;
  userAgent?: string;
  documentName?: string;
  performedBy?: string;
  notes?: string;
  createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    shareLinkId: { type: Schema.Types.ObjectId, ref: 'ShareLink' },
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    action: {
      type: String,
      enum: ['LINK_CREATED', 'LINK_VIEWED', 'DOCUMENT_VIEWED', 'DOCUMENT_DOWNLOADED', 'LINK_REVOKED', 'INQUIRY_SUBMITTED'],
      required: true,
    },
    ipAddress: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    documentName: { type: String, default: '' },
    performedBy: { type: String, default: 'CUSTOMER' },
    notes: { type: String, default: '' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const AuditLog: Model<IAuditLog> = models.AuditLog || model<IAuditLog>('AuditLog', auditLogSchema);
