import { z } from 'zod';

export const inquirySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().default(''),
  message: z.string().min(1, 'Message is required'),
  property_name: z.string().default(''),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
