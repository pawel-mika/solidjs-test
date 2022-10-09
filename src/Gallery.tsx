import { Component, createSignal, For, onMount } from "solid-js";
import styles from './Gallery.module.scss';

interface Photo {
    thumbnailUrl?: string;
    title?: string;
}

const Gallery: Component = () => {
    let container: HTMLDivElement;
    const [photos, setPhotos] = createSignal<Photo[]>([]);
    const [page, setPage] = createSignal<number>(0);

    const fetchPhotos = async (_page: string, _limit: string = '32') => {
        const params = new URLSearchParams({_page, _limit});
        const res = await fetch(`https://jsonplaceholder.typicode.com/photos?`  + params);
        const respJson = await res.json();
        const newPhotos = (respJson as Photo[])
            .map((p) => ({ ...p, thumbnailUrl: `https://source.unsplash.com/random/320x240?q=${Number.parseInt(1000000 * Math.random())}` }));
        setPhotos([...photos(), ...newPhotos]);
    }

    const handleScroll = (e: Event) => {
        if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
            setPage(page() + 1)
            fetchPhotos(page() as unknown as string);
          }
    }

    onMount(async () => {
        fetchPhotos(page() as unknown as string);
        handleScroll({} as Event);
    });

    return (<div class={styles.container} onScroll={handleScroll} ref={container}>
        <h2>Photo album</h2>
        <div class={styles.photos}>
            <For each={photos()} fallback={<p>Loading...</p>}>{(photo) =>
                <figure class={styles.figure}>
                    <img src={photo.thumbnailUrl} alt={photo.title} />
                    <figcaption>{photo.title}</figcaption>
                </figure>
            }</For>
        </div>
    </div>);
}

export default Gallery;