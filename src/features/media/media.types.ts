export interface MediaItem {
  objectId: string;
  category: string[];
  mediaFile: string;
  mediaAlt: string;
  authorName: string;
  title: string;
  isPublic: boolean;
  description: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaState {
  items: MediaItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  selectedCategories: string[];
}

export interface UploadMediaPayload {
  file: File;
  title: string;
  description: string;
  category: string[];
  mediaAlt: string;
  authorName: string;
  location: string;
  isPublic: boolean;
}