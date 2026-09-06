import { v2 as cloudinary } from 'cloudinary';
import { env } from './env';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryAsset {
  secure_url: string;
  public_id: string;
  name?: string;
  file_type?: string;
}

export async function uploadBufferToCloudinary(buffer: Buffer, folder = 'alyora', resourceType: 'image' | 'raw' | 'auto' = 'image'): Promise<CloudinaryAsset> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error('Upload to Cloudinary failed'));
        }
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          file_type: result.format || 'file',
        });
      }
    );
    stream.end(buffer);
  });
}

export async function deleteFromCloudinary(public_id: string): Promise<void> {
  if (!public_id) return;
  await cloudinary.uploader.destroy(public_id);
}

export { cloudinary };
