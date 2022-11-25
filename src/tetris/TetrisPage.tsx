import { Component, createEffect, createSignal, onCleanup, onMount, Show } from "solid-js";
import appStyles from '../App.module.scss';
import styles from './TetrisPage.module.scss';
import createBoard, { Pixel, PixelType, Row } from "./Board";

const TetrisPage: Component = () => {
    const {width, height, screen, onKeyDown, score, pause, reset } = createBoard();

    const renderPixel = (pixel: Pixel) => (<div classList={{
        [styles.pixel]: true, 
        [styles.p1]: pixel.type === PixelType.TAKEN,
        [styles.p3]: pixel.type === PixelType.REMOVING}} 
        style={pixel.style}>{pixel?.type}
      </div>)

    const renderRow = (row: Row) => row.pixels.map((pixel) => renderPixel(pixel));

    onMount(() => {
      document.addEventListener('keydown', onKeyDown);
    });

    onCleanup(() => {
      document.removeEventListener('keydown', onKeyDown);
      pause();
    });

    const newGame = () => {
      reset();
    }
  
    return (
      <div class={appStyles.App}>
        <header class={appStyles.header}>
          WorkInProgress | level (speed): 0 | hiscore: 0
        </header>
        <div class={styles.content}>
            <div style={styles.info}>
              <p><b>Score: {score}</b></p>
              <button onclick={newGame}>New Game</button>
            </div>
            <div class={styles.tetris} style={{
              "grid-template-columns": `repeat(${width - 1}, 1fr) minmax(0, 1fr)`
            }}>
                {screen().map((row) => renderRow(row))}
            </div>
            <div style={styles.help}>
              <p>
                Movement: arrow keys - left/right/down
              </p>
              <p>
                Rotate: arrow up
              </p>
              <p>
                Pause: p
              </p>
            </div>
        </div>
        <footer class={appStyles.footer}>
        </footer>
      </div>
    );
  };

export default TetrisPage;