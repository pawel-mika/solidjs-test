import { Component, createSignal, Show } from "solid-js";
import appStyles from './App.module.scss';
import Gallery, { Photo } from "./Gallery";
import logo from './logo.svg';

const GalleryPage: Component = () => {
    const [isLoading, setLoading] = createSignal<boolean>(false);
    const [photos, setPhotos] = createSignal<Photo[]>([]);
  
    return (
      <div class={appStyles.App}>
        <header class={appStyles.header}>
          <img src={logo} class={appStyles.logo} alt="logo" />
          <a
            class={appStyles.link}
            href="https://github.com/solidjs/solid"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn Solid
          </a>
        </header>
  
        <p class={appStyles.content}>
          <Gallery isLoading={(loading) => setLoading(loading)} onPhotosChange={(photos)=>setPhotos(photos)}></Gallery>
        </p>
        <footer class={appStyles.footer}>
          <Show when={isLoading()}><b>Loading...</b></Show>
          Photos loaded: {photos().length}
        </footer>
      </div>
    );
  };

export default GalleryPage;