import { Component, createEffect, createSignal, onCleanup, onMount, Show } from "solid-js";
import appStyles from '../App.module.scss';
import styles from './TetrisPage.module.scss';
import createBoard, { Pixel, PixelType, Row } from "./Board";

const TetrisPage: Component = () => {
    const {width, height, screen, onKeyDown} = createBoard();

    const renderPixel = (pixel: Pixel) => (<div classList={{
        [styles.pixel]: true, 
        [styles.p1]: pixel.type === PixelType.TAKEN}} 
        style={pixel.style}>{pixel?.type}
      </div>)

    const renderRow = (row: Row) => row.tiles.map((pixel) => renderPixel(pixel));

    onMount(() => {
      document.addEventListener('keydown', onKeyDown);
    });

    onCleanup(() => {
      document.removeEventListener('keydown', onKeyDown);
    });
  
    return (
      <div class={appStyles.App}>
        <header class={appStyles.header}>
          ***WIP*** | score: 0 | level (speed): 0 | hiscore: 0 | <b>Movement: Arrow keys</b>
        </header>
        <div class={appStyles.content}>
            <div class={styles.tetris} style={{
              "grid-template-columns": `repeat(${width - 1}, 1fr) minmax(0, 1fr)`
            }}>
                {screen().map((row) => renderRow(row))}
            </div>
        </div>
        <footer class={appStyles.footer}>
        </footer>
      </div>
    );
  };

export default TetrisPage;