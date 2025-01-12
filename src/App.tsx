import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageLayout from './layouts/PageLayout';
import { HomePage } from './pages';

const App: React.FC = () => {
	return (
		<Router>
			<Routes>
				<Route element={<PageLayout />}>
					<Route path='/' element={<HomePage />} />
				</Route>
			</Routes>
		</Router>
	);
};

export default App;
