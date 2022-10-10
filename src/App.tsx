import { Component, createSignal, lazy, Show } from 'solid-js';

import logo from './logo.svg';
import styles from './App.module.scss';
// import SelectMediaDevice from './SelectMediaDevices';
// import Analyzer from './Analyzer';
import Gallery, { Photo } from './Gallery';

// const Greeting = lazy(async () => {
//   // simulate delay
//   await new Promise(r => setTimeout(r, 2000))
//   return import("./Analyzer")
// });
// console.log(Greeting);

const App: Component = () => {

  const [isLoading, setLoading] = createSignal<boolean>(false);
  const [photos, setPhotos] = createSignal<Photo[]>([]);

  // const onMediaDeviceSelected = (device: MediaDeviceInfo) => {
  //   console.log(`from app: ${device}`);
  //   setMediaDevice(device);
  // }

  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <img src={logo} class={styles.logo} alt="logo" />
        <a
          class={styles.link}
          href="https://github.com/solidjs/solid"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Solid
        </a>
      </header>
      <p class={styles.content}>
        <Gallery isLoading={(loading) => setLoading(loading)} onPhotosChange={(photos)=>setPhotos(photos)}></Gallery>
        {/* <SelectMediaDevice onMediaDeviceSelected={onMediaDeviceSelected}></SelectMediaDevice> */}
        {/* <Analyzer mediaDevice={mediaDevice()}></Analyzer> */}
      </p>
      <footer class={styles.footer}>
        <Show when={isLoading()}><b>Loading...</b></Show>
        Photos loaded: {photos().length}
      </footer>
    </div>
  );
};

export default App;
