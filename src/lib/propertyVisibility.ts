import { IProperty } from '@/models/Property';
import { IShareLink } from '@/models/ShareLink';

/**
 * Filter property data for PUBLIC view (website visitors).
 * Removes all private owner/broker info, internal notes, negotiation price, commission,
 * exact address/GPS (unless made public), and media/docs that are not explicitly PUBLIC.
 */
export function filterPublicProperty(property: any) {
  const obj = typeof property.toObject === 'function' ? property.toObject() : JSON.parse(JSON.stringify(property));

  // Strip strictly private confidential fields
  delete obj.ownerDetails;
  delete obj.brokerDetails;
  delete obj.internalNotes;
  delete obj.commission;
  delete obj.negotiationPrice;
  delete obj.exactAddress;
  delete obj.gpsCoordinates;

  // Filter media array to PUBLIC items only
  // Treat missing/undefined visibility as PUBLIC (default behavior)
  if (Array.isArray(obj.media)) {
    obj.media = obj.media.filter((m: any) => !m.visibility || m.visibility === 'PUBLIC');
  } else {
    obj.media = [];
  }

  // Filter documents array to PUBLIC items only
  // Treat missing/undefined visibility as PUBLIC (default behavior)
  if (Array.isArray(obj.documents)) {
    obj.documents = obj.documents.filter((d: any) => !d.visibility || d.visibility === 'PUBLIC');
  } else {
    obj.documents = [];
  }

  return obj;
}

/**
 * Filter property data for CUSTOMER_SHARED view based on ShareLink permissions.
 * IMPORTANT: undefined permission = SHOW (default open). Only explicit false = hide.
 */
export function filterSharedProperty(property: any, shareLink: IShareLink) {
  const obj = typeof property.toObject === 'function' ? property.toObject() : JSON.parse(JSON.stringify(property));
  const perms: any = shareLink.permissions || {};
  const allowedDocIds = new Set((shareLink.allowedDocumentIds || []).map(String));
  const allowedMediaIds = new Set((shareLink.allowedMediaIds || []).map(String));

  // Private administrative info — only show if explicitly true
  if (perms.showOwnerDetails !== true) {
    delete obj.ownerDetails;
    delete obj.brokerDetails;
  }

  // Always strip truly internal fields (never exposed to customers)
  delete obj.internalNotes;
  delete obj.commission;
  delete obj.negotiationPrice;

  // Exact location — hidden by default unless explicitly true
  if (perms.showExactLocation !== true) {
    delete obj.exactAddress;
    delete obj.gpsCoordinates;
  }

  // Price — show unless explicitly false
  if (perms.showPrice === false) {
    delete obj.price;
  }

  // Full Description — show unless explicitly false
  if (perms.showFullDescription === false) {
    delete obj.description;
  }

  // Basic details — show unless explicitly false
  if (perms.showBasicDetails === false) {
    delete obj.beds;
    delete obj.baths;
    delete obj.area;
    delete obj.plot;
    delete obj.propertyType;
    delete obj.tag;
  }

  // Amenities — show unless explicitly false
  if (perms.showAmenities === false) {
    delete obj.amenities;
  }

  // Specifications — show unless explicitly false
  if (perms.showSpecifications === false) {
    delete obj.specifications;
  }

  // Media filtering — show unless the specific type permission is explicitly false
  if (Array.isArray(obj.media)) {
    obj.media = obj.media.filter((m: any) => {
      const mediaId = m._id ? m._id.toString() : m.id;

      // Explicitly granted individual media always allowed
      if (mediaId && allowedMediaIds.has(mediaId)) return true;

      // Strip admin/team-only media always
      if (m.visibility === 'ADMIN_ONLY' || m.visibility === 'ALYORA_TEAM') return false;

      // Check per-type permissions — only hide if explicitly false
      if (m.type === 'video' && perms.showVideos === false) return false;
      if (m.type === 'floorplan' && perms.showFloorPlans === false) return false;
      if ((m.type === 'photo' || !m.type) && perms.showAdditionalPhotos === false) return false;

      // Allow public or customer-shared media
      if (m.visibility === 'PUBLIC' || m.visibility === 'CUSTOMER_SHARED') return true;

      return false;
    });
  } else {
    obj.media = [];
  }

  // Document filtering — show public docs unless explicitly false
  if (Array.isArray(obj.documents)) {
    obj.documents = obj.documents.filter((d: any) => {
      const docId = d._id ? d._id.toString() : d.id;

      // Explicitly granted document always allowed
      if (docId && allowedDocIds.has(docId)) return true;

      // Strip admin/team-only documents always
      if (d.visibility === 'ADMIN_ONLY' || d.visibility === 'ALYORA_TEAM') return false;

      // Public and Customer-shared documents shown unless showPublicDocuments explicitly false
      if (perms.showPublicDocuments !== false && (d.visibility === 'PUBLIC' || d.visibility === 'CUSTOMER_SHARED')) return true;

      return false;
    });
  } else {
    obj.documents = [];
  }

  return obj;
}

