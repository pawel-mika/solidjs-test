import { Component, createEffect, createSignal, For, mergeProps, onMount, Show } from "solid-js";
import styles from './Gallery.module.scss';

export interface Photo {
    thumbnailUrl?: string;
    title?: string;
}

interface GalleryProperties {
    onPhotosChange: (photos: Photo[]) => void;
    isLoading: (loading: boolean) => void;
}

const Gallery: Component<GalleryProperties> = (props: GalleryProperties) => {
    let container: HTMLDivElement | undefined;
    const [isLoading, setLoading] = createSignal<boolean>(false);
    const [photos, setPhotos] = createSignal<Photo[]>([]);
    const [page, setPage] = createSignal<number>(0);

    props = mergeProps({onPhotosChange: () => {throw('unimplemented')}, isLoading: () => {throw('unimplemented')}}, props);

    createEffect(() => props.onPhotosChange(photos()));

    createEffect(() => props.isLoading(isLoading()));

    const fetchPhotos = async (_page: string, _limit: string = '100') => {
        setLoading(true);
        const params = new URLSearchParams({_page, _limit});
        const res = await fetch(`https://jsonplaceholder.typicode.com/photos?`  + params);
        const respJson = await res.json();
        const newPhotos = (respJson as Photo[])
            .map((p) => ({ ...p, thumbnailUrl: `https://source.unsplash.com/random/320x240/?q=${(Math.random() + 1).toString(36).substring(2)}` }));
        setPhotos([...photos(), ...newPhotos]);
        setLoading(false);
    }

    const handleScroll = (e: Event) => {
        if (container!.scrollTop + container!.clientHeight >= container!.scrollHeight) {
            setPage(page() + 1)
            fetchPhotos(page() as unknown as string);
          }
    }

    const handleClick = (p: Photo) => {
        console.log(p);
    }

    onMount(async () => {
        fetchPhotos(page() as unknown as string);
        handleScroll({} as Event);
    });

    return (<div class={styles.container} onScroll={handleScroll} ref={container!}>
        <Show when={isLoading()}>
            <div class={styles.loader}>
                <div class={styles.ring}></div>
            </div>
        </Show>
        <h2>Photo album</h2>
        <div class={styles.photos}>
            <For each={photos()} fallback={<p>...</p>}>{(photo) =>
                <figure class={styles.figure} onClick={(e) => handleClick(photo)}>
                    <img src={photo.thumbnailUrl} alt={photo.title}/>
                    <figcaption>{photo.title}</figcaption>
                </figure>
            }</For>
        </div>
    </div>);
}

export default Gallery;