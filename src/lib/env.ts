import { z } from 'zod';

const envSchema = z.object({
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  JWT_SECRET: z.string().default('fallback_jwt_secret_key_12345'),
});

export const env = typeof window === 'undefined'
  ? envSchema.parse({
    MONGODB_URI: process.env.MONGODB_URI,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    JWT_SECRET: process.env.JWT_SECRET || 'fallback_jwt_secret_key_12345',
  })
  : ({} as z.infer<typeof envSchema>);

export const COMPANY_CONFIG = {
  name: process.env.NEXT_PUBLIC_ALYORA_NAME || 'ALYORA',
  whatsappNumber: process.env.NEXT_PUBLIC_ALYORA_WHATSAPP_NUMBER || '919947616989',
  phone: process.env.NEXT_PUBLIC_ALYORA_PHONE || '+91 99476 16989',
  email: process.env.NEXT_PUBLIC_ALYORA_EMAIL || 'hello@alyora.in',
  address: process.env.NEXT_PUBLIC_ALYORA_ADDRESS || 'Kochi, Kerala, India',
};

