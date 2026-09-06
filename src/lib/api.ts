export interface MediaAsset {
  id?: string;
  secure_url: string;
  public_id: string;
  visibility?: 'PUBLIC' | 'CUSTOMER_SHARED' | 'ALYORA_TEAM' | 'ADMIN_ONLY';
  type?: 'photo' | 'video' | 'floorplan';
  caption?: string;
}

export interface PropertyDocument {
  id?: string;
  name: string;
  url: string;
  public_id: string;
  file_type: string;
  visibility?: 'PUBLIC' | 'CUSTOMER_SHARED' | 'ALYORA_TEAM' | 'ADMIN_ONLY';
}

export type Property = {
  _id: string;
  id: string;
  name: string;
  location: string;
  price: string;
  negotiationPrice?: string;
  image: MediaAsset;
  image_url: string;
  media?: MediaAsset[];
  documents: PropertyDocument[];
  tag: string;
  tag_color: string;
  beds: string;
  baths: string;
  area: string;
  plot: string;
  propertyType: string;
  description: string;
  featured: boolean;
  status?: string;
  ownerDetails?: { name?: string; phone?: string; email?: string; notes?: string };
  brokerDetails?: { name?: string; phone?: string; email?: string; agency?: string };
  internalNotes?: string;
  commission?: string;
  exactAddress?: string;
  gpsCoordinates?: { lat?: number; lng?: number };
  amenities?: string[];
  specifications?: { key: string; value: string }[];
  createdAt: string;
};

export type Location = {
  _id: string;
  id: string;
  name: string;
  sub: string;
  image: MediaAsset;
  image_url: string;
  createdAt: string;
};

export type Inquiry = {
  _id: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  property_name: string;
  createdAt: string;
};

function getToken(): string | null {
  try { return localStorage.getItem('alyora_token'); } catch { return null; }
}

function setToken(token: string) {
  try { localStorage.setItem('alyora_token', token); } catch { }
}

function clearToken() {
  try { localStorage.removeItem('alyora_token'); } catch { }
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function normalise<T extends { _id?: string; id?: string }>(doc: T): T {
  if (doc && doc._id && !doc.id) (doc as any).id = doc._id;
  return doc;
}

function normaliseList<T extends { _id?: string; id?: string }>(docs: T[]): T[] {
  return (docs || []).map(normalise);
}

async function get<T>(path: string, auth = false): Promise<T> {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...(auth ? authHeaders() : {}) },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.json();
}

async function post<T>(path: string, data: unknown, auth = false): Promise<T> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(auth ? authHeaders() : {}) },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.json();
}

async function put<T>(path: string, data: unknown): Promise<T> {
  const res = await fetch(path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.json();
}

async function del(path: string): Promise<void> {
  const res = await fetch(path, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
}

const memoryCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 60000; // 60s cache

function invalidateCache() {
  memoryCache.clear();
}

async function getCached<T>(path: string, auth = false): Promise<T> {
  const cacheKey = `${path}_${auth ? 'auth' : 'public'}`;
  const hit = memoryCache.get(cacheKey);
  const now = Date.now();

  if (hit && (now - hit.timestamp < CACHE_TTL_MS)) {
    // Background revalidate
    get<T>(path, auth).then((fresh) => {
      memoryCache.set(cacheKey, { data: fresh, timestamp: Date.now() });
    }).catch(() => { });
    return hit.data as T;
  }

  const fresh = await get<T>(path, auth);
  memoryCache.set(cacheKey, { data: fresh, timestamp: now });
  return fresh;
}

export const api = {
  async login(email: string, password: string) {
    const data = await post<{ token: string; user: { id: string; email: string } }>('/api/auth/login', { email, password });
    setToken(data.token);
    invalidateCache();
    return data;
  },

  async signup(email: string, password: string) {
    const data = await post<{ token: string; user: { id: string; email: string } }>('/api/auth/signup', { email, password });
    setToken(data.token);
    invalidateCache();
    return data;
  },

  async getMe() {
    return get<{ user: { id: string; email: string } }>('/api/auth/me', true);
  },

  logout() {
    clearToken();
    invalidateCache();
  },

  isLoggedIn() {
    return !!getToken();
  },

  getToken,

  async getProperties(): Promise<Property[]> {
    const data = await getCached<Property[]>('/api/properties');
    return normaliseList(data);
  },

  async getProperty(id: string): Promise<Property> {
    const data = await getCached<Property>(`/api/properties/${id}`);
    return normalise(data);
  },

  async createProperty(form: Partial<Property>) {
    const data = await post<Property>('/api/properties', form, true);
    invalidateCache();
    return normalise(data);
  },

  async updateProperty(id: string, form: Partial<Property>) {
    const data = await put<Property>(`/api/properties/${id}`, form);
    invalidateCache();
    return normalise(data);
  },

  async deleteProperty(id: string) {
    await del(`/api/properties/${id}`);
    invalidateCache();
  },

  async getLocations(): Promise<Location[]> {
    const data = await getCached<Location[]>('/api/locations');
    return normaliseList(data);
  },

  async createLocation(form: Partial<Location>) {
    const data = await post<Location>('/api/locations', form, true);
    return normalise(data);
  },

  async updateLocation(id: string, form: Partial<Location>) {
    const data = await put<Location>(`/api/locations/${id}`, form);
    return normalise(data);
  },

  async deleteLocation(id: string) {
    return del(`/api/locations/${id}`);
  },

  async getInquiries(): Promise<Inquiry[]> {
    const data = await get<Inquiry[]>('/api/inquiries', true);
    return normaliseList(data);
  },

  async submitInquiry(form: { name: string; email: string; phone?: string; message: string; property_name?: string }) {
    return post<Inquiry>('/api/inquiries', form);
  },

  async deleteInquiry(id: string) {
    return del(`/api/inquiries/${id}`);
  },

  async getStats() {
    return get<{ properties: number; locations: number; inquiries: number; featured: number; recentInquiries: Inquiry[] }>('/api/stats', true);
  },

  async getShareLinks() {
    return get<any[]>('/api/shared', true);
  },

  async toggleRevokeShareLink(token: string, action?: 'revoke' | 'restore') {
    return post<{ success: boolean; isRevoked: boolean; message: string }>(
      `/api/shared/${token}/revoke`,
      { action },
      true
    );
  },

  async deleteShareLink(id: string) {
    return del(`/api/shared?id=${id}`);
  },

  async uploadImage(file: File): Promise<MediaAsset> {
    const formData = new FormData();
    formData.append('image', file);
    const token = getToken();
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || 'Upload failed');
    }
    const data: MediaAsset = await res.json();
    return data;
  },
};
