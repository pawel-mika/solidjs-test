import { Component, createEffect, createSignal, onCleanup, onMount, Show } from "solid-js";
import appStyles from '../App.module.scss';
import styles from './TetrisPage.module.scss';
import createBoard, { Pixel, PixelType, Row } from "./Board";

const TetrisPage: Component = () => {
    const {width, height, screen, onKeyDown, pause, reset, gameState } = createBoard();

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
            <Show when={gameState().isGameOver}>
              <div class={styles.gameOver}><span>Game Over</span></div>
            </Show>
            <Show when={gameState().isPaused}>
              <div class={styles.paused}><span>Paused</span></div>
            </Show>
            <div class={styles.info}>
              <p><b>Score: {gameState().score}</b></p>
              <Show when={gameState().isGameOver}>
                <button onclick={newGame}>New Game</button>
              </Show>
            </div>
            <div class={styles.tetris} style={{
              "grid-template-columns": `repeat(${width - 1}, 1fr) minmax(0, 1fr)`
            }}>
                {screen().map((row) => renderRow(row))}
            </div>
            <div class={styles.help}>
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