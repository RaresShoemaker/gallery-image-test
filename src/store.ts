import { configureStore } from '@reduxjs/toolkit';
import mediaReducer from './features/media/mediaSlice';

const store = configureStore({
	reducer: {
		media: mediaReducer,
	}
});

export type ApplicationState = ReturnType<typeof store.getState>;
export type ApplicationDispatch = typeof store.dispatch;

export default store;
