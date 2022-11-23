import { Component } from 'solid-js';

import { Link, Route, Routes } from '@solidjs/router';
import GalleryPage from './GalleryPage';
import TetrisPage from './tetris/TetrisPage';

const App: Component = () => {
  return (
      <Routes>
        <Route path={`${import.meta.env.BASE_URL}/gallery`} element={<GalleryPage />} />
        <Route path={`${import.meta.env.BASE_URL}/tetris`} element={<TetrisPage />} />
        <Route path='/test' element={<div> test test </div>} />
      </Routes>
  );
};

export default App;
