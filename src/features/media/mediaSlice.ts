import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import Parse from '../../utils/ParseConfig';
import { MediaItem, MediaState, UploadMediaPayload } from './media.types';
import { ApplicationState } from '../../store';

const initialState: MediaState = {
  items: [] as MediaItem[], 
  status: 'idle',
  error: null,
  selectedCategories: [],
};

export const fetchMedia = createAsyncThunk(
  'media/fetchMedia',
  async (): Promise<MediaItem[]> => { 
    const query = new Parse.Query('Media');
    const results = await query.find();
    
    return results.map(item => ({
      objectId: item.id,
      category: item.get('category'),
      mediaFile: item.get('mediaFile')?.url() || null, // Convert Parse.File to its URL
      mediaAlt: item.get('mediaAlt'),
      authorName: item.get('authorName'),
      title: item.get('title'),
      isPublic: item.get('isPublic'),
      description: item.get('description'),
      location: item.get('location'),
      createdAt: item.get('createdAt')?.toISOString(),
      updatedAt: item.get('updatedAt')?.toISOString(),
    }));
  }
);

export const uploadMedia = createAsyncThunk(
  'media/uploadMedia',
  async (payload: UploadMediaPayload) => {
    const parseFile = new Parse.File(payload.file.name, payload.file);
    await parseFile.save();

    const MediaClass = Parse.Object.extend('Media');
    const mediaObject = new MediaClass();

    mediaObject.set('mediaFile', parseFile);
    mediaObject.set('title', payload.title);
    mediaObject.set('description', payload.description);
    mediaObject.set('category', payload.category);
    mediaObject.set('mediaAlt', payload.mediaAlt);
    mediaObject.set('authorName', payload.authorName);
    mediaObject.set('location', payload.location);
    mediaObject.set('isPublic', payload.isPublic);

    const result = await mediaObject.save();

    return {
      objectId: result.id,
      ...result.attributes
    } as MediaItem;
  }
)

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    setSelectedCategories: (state, action: PayloadAction<string[]>) => {
      state.selectedCategories = action.payload;
    },
    addCategory: (state, action: PayloadAction<string>) => {
      if (!state.selectedCategories.includes(action.payload)) {
        state.selectedCategories.push(action.payload);
      }
    },
    removeCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategories = state.selectedCategories.filter(
        category => category !== action.payload
      );
    },
    clearCategories: (state) => {
      state.selectedCategories = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedia.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMedia.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchMedia.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch media';
      })
      .addCase(uploadMedia.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(uploadMedia.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
        state.error = null;
      })
      .addCase(uploadMedia.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to upload media';
      });
  },
});

export const { 
  setSelectedCategories, 
  addCategory, 
  removeCategory, 
  clearCategories 
} = mediaSlice.actions;

export const selectAllMedia = (state: { media: ApplicationState }) => state.media.media.items;
export const selectMediaStatus = (state: { media: MediaState }) => state.media.status;
export const selectMediaError = (state: { media: ApplicationState }) => state.media.media.error;
export const selectSelectedCategories = (state: { media: ApplicationState }) => 
  state.media.media.selectedCategories;

export const selectFilteredMedia = (state: { media: MediaState }): MediaItem[] => {
  const { items, selectedCategories } = state.media;
  if (selectedCategories.length === 0) return items;
  
  return items.filter(item => 
    item.category.some(category => selectedCategories.includes(category))
  );
};

export default mediaSlice.reducer;