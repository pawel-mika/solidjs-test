import { Component } from 'solid-js';

import { Link, Route, Routes, useNavigate } from '@solidjs/router';
import GalleryPage from './GalleryPage';
import TetrisPage from './tetris/TetrisPage';

const App: Component = () => {

  const navigate = useNavigate();
  const baseUrl = import.meta.env.BASE_URL;

  navigate(baseUrl.concat('tetris'));

  return (
      <Routes>
        <Route path={baseUrl.concat('gallery')} element={<GalleryPage />} />
        <Route path={baseUrl.concat('tetris')} element={<TetrisPage />} />
        <Route path={baseUrl.concat('test')} element={<div> test test </div>} />
      </Routes>
  );
};

export default App;
