import { z } from 'zod';

export const inquirySchema = z.object({
  name: z.string().min(1, 'Name is required').default('Interested Visitor'),
  email: z.string().optional().default(''),
  phone: z.string().optional().default(''),
  message: z.string().optional().default('Interested in this property.'),
  property_name: z.string().optional().default(''),
  propertyName: z.string().optional().default(''),
  propertyId: z.string().optional().default(''),
  source: z.string().optional().default(''),
  salespersonId: z.string().optional().default(''),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
