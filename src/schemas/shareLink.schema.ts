import { z } from 'zod';

export const shareLinkPermissionsSchema = z.object({
  showBasicDetails: z.boolean().default(true),
  showFullDescription: z.boolean().default(true),
  showAdditionalPhotos: z.boolean().default(true),
  showVideos: z.boolean().default(true),
  showFloorPlans: z.boolean().default(true),
  showPublicDocuments: z.boolean().default(true),
  showPrice: z.boolean().default(true),
  showExactLocation: z.boolean().default(false),
  showAmenities: z.boolean().default(true),
  showSpecifications: z.boolean().default(true),
  showOwnerDetails: z.boolean().default(false),
});

const defaultPermissions = {
  showBasicDetails: true,
  showFullDescription: true,
  showAdditionalPhotos: true,
  showVideos: true,
  showFloorPlans: true,
  showPublicDocuments: true,
  showPrice: true,
  showExactLocation: false,
  showAmenities: true,
  showSpecifications: true,
  showOwnerDetails: false,
};

export const createShareLinkSchema = z.object({
  propertyId: z.string().min(1, 'Property ID is required'),
  createdBy: z.string().default('admin'),
  leadName: z.string().optional().default(''),
  leadPhone: z.string().optional().default(''),
  leadEmail: z.string().optional().default(''),
  salespersonId: z.string().optional().default(''),
  expiresInDays: z.number().optional(),
  passcode: z.string().optional().default(''),
  permissions: shareLinkPermissionsSchema.default(defaultPermissions),
  allowedDocumentIds: z.array(z.string()).default([]),
  allowedMediaIds: z.array(z.string()).default([]),
});

export const accessShareLinkSchema = z.object({
  passcode: z.string().optional(),
});
