import { z } from 'zod';

export const mediaAssetSchema = z.object({
  secure_url: z.string().url('Invalid image URL'),
  public_id: z.string().default('manual_url'),
  visibility: z.enum(['PUBLIC', 'CUSTOMER_SHARED', 'ALYORA_TEAM', 'ADMIN_ONLY']).default('PUBLIC'),
  type: z.enum(['photo', 'video', 'floorplan']).default('photo'),
  caption: z.string().default(''),
});

export const propertyDocumentSchema = z.object({
  name: z.string().min(1, 'Document name is required'),
  url: z.string().url('Invalid document URL'),
  public_id: z.string().default('manual_doc'),
  file_type: z.string().default('pdf'),
  visibility: z.enum(['PUBLIC', 'CUSTOMER_SHARED', 'ALYORA_TEAM', 'ADMIN_ONLY']).default('ADMIN_ONLY'),
});

const ownerDetailsSchema = z.object({
  name: z.string().default(''),
  phone: z.string().default(''),
  email: z.string().default(''),
  notes: z.string().default(''),
});

const brokerDetailsSchema = z.object({
  name: z.string().default(''),
  phone: z.string().default(''),
  email: z.string().default(''),
  agency: z.string().default(''),
});

const specificationSchema = z.object({
  key: z.string(),
  value: z.string(),
});

export const propertySchema = z.object({
  name: z.string().min(1, 'Property name is required'),
  location: z.string().min(1, 'Location is required'),
  price: z.string().min(1, 'Price is required'),
  negotiationPrice: z.string().default(''),
  image_url: z.string().url('Invalid image URL').optional(),
  image: mediaAssetSchema.optional(),
  media: z.array(mediaAssetSchema).default([]),
  documents: z.array(propertyDocumentSchema).default([]),
  tag: z.string().default('For Sale'),
  tag_color: z.string().default('#3c70b8'),
  beds: z.string().default(''),
  baths: z.string().default(''),
  area: z.string().default(''),
  plot: z.string().default(''),
  propertyType: z.string().default(''),
  description: z.string().default(''),
  featured: z.boolean().default(false),
  status: z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'SOLD', 'ARCHIVED']).default('PUBLISHED'),
  ownerDetails: ownerDetailsSchema.optional(),
  brokerDetails: brokerDetailsSchema.optional(),
  internalNotes: z.string().default(''),
  commission: z.string().default(''),
  exactAddress: z.string().default(''),
  gpsCoordinates: z
    .object({
      lat: z.number().optional(),
      lng: z.number().optional(),
    })
    .optional(),
  amenities: z.array(z.string()).default([]),
  specifications: z.array(specificationSchema).default([]),
});

export type PropertyInput = z.infer<typeof propertySchema>;
export type PropertyDocumentInput = z.infer<typeof propertyDocumentSchema>;
