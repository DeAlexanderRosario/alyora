import { z } from 'zod';
import { mediaAssetSchema } from './property.schema';

export const locationSchema = z.object({
  name: z.string().min(1, 'Location name is required'),
  sub: z.string().default(''),
  image_url: z.string().url('Invalid image URL').optional(),
  image: mediaAssetSchema.optional(),
});

export type LocationInput = z.infer<typeof locationSchema>;
