import { FC } from 'react';
import { Outlet } from 'react-router-dom';

const PageLayout: FC = () => {
  return (
    <div className='flex flex-col w-full h-full min-h-screen bg-slate-500 overflow-hidden'>
      <main className='flex-grow relative min-h-dvh md:min-h-screen mx-6 md:mx-20 lg:mx-28 2xl:mx-40 mb-10'>
        <Outlet />
      </main>
    </div>
  );
};

export default PageLayout;