import { Component } from 'solid-js';

import { Link, Route, Routes, useNavigate } from '@solidjs/router';
import GalleryPage from './GalleryPage';
import TetrisPage from './tetris/TetrisPage';

const App: Component = () => {

  const navigate = useNavigate();

  navigate(`${import.meta.env.BASE_URL}/tetris`);

  return (
      <Routes>
        <Route path={`${import.meta.env.BASE_URL}/gallery`} element={<GalleryPage />} />
        <Route path={`${import.meta.env.BASE_URL}/tetris`} element={<TetrisPage />} />
        <Route path='/test' element={<div> test test </div>} />
      </Routes>
  );
};

export default App;
