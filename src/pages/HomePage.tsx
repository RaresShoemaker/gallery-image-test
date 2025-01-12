import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchMedia, selectFilteredMedia, selectMediaStatus } from '../features/media/mediaSlice';
import GalleryCard from '../components/GalleryCard';

const HomePage: FC = () => {
	const dispatch = useAppDispatch();
	const media = useAppSelector(selectFilteredMedia);
	const status = useAppSelector(selectMediaStatus);

	useEffect(() => {
		if (status === 'idle') {
			dispatch(fetchMedia());
		}
	}, [status, dispatch]);

	return (
		<div className='py-8'>
			<h1 className='text-4xl font-bold text-white mb-8'>Welcome to Gallery</h1>

			{status === 'loading' && (
				<div className='flex justify-center items-center h-64'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500' />
				</div>
			)}

			{status === 'failed' && (
				<div className='text-red-500 text-center'>Failed to load media items. Please try again later.</div>
			)}

			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
				{media.map((item) => (
					<GalleryCard key={item.objectId} item={item} />
				))}
			</div>
		</div>
	);
};

export default HomePage;
