import { Component, createSignal, For, onMount } from "solid-js";
import styles from './Gallery.module.scss';

interface Photo {
    thumbnailUrl?: string;
    title?: string;
}

const Gallery: Component = () => {
    const [photos, setPhotos] = createSignal<Photo[]>([]);

    onMount(async () => {
        const res = await fetch(`https://jsonplaceholder.typicode.com/photos?_limit=20`);
        const respJson = await res.json();
        setPhotos((respJson as Photo[]).map((p) => ({...p, thumbnailUrl: `https://source.unsplash.com/random/320x240?q=${Number.parseInt(1000000 * Math.random())}`})));
    });

    return (<>
        <h2>Photo album</h2>

        <div class={styles.photos}>
            <For each={photos()} fallback={<p>Loading...</p>}>{(photo) =>
                <figure class={styles.figure}>
                    <img src={photo.thumbnailUrl} alt={photo.title} />
                    <figcaption>{photo.title}</figcaption>
                </figure>
            }</For>
        </div>
    </>);
}

export default Gallery;