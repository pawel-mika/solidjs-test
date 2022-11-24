import { Accessor, createSignal } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import BlockFactory from "./BlockFactory";

export enum PixelType {
    EMPTY,
    TAKEN,
    MOVING,
    REMOVING,
    ANCHORED
}

export type TBlock = Array<Array<Pixel>>;
export type TScreen = Array<Row>;

export interface Pixel {
    type: PixelType;
    style?: JSX.CSSProperties;
}

export interface Tile {
    block: TBlock;
    top: number;
    left: number;
    width: number;
    height: number;
    possibleTop?: number;
    possibleLeft?: number;
}

export interface Row {
    pixels: Array<Pixel>;
}

export interface Board {
    width: number;
    height: number;
    screen: Accessor<Array<Row>>;
    onKeyDown: (e: KeyboardEvent) => void;
    reset: () => void;
    pause: () => void;
    start: () => void;
    score: Accessor<number>;
}

const createBoard = (): Board => {
    const GAME_TICK = 1000;
    const BOARD_WIDTH = 10;
    const BOARD_HEIGHT = 20;
    // const TILE_SPEED = 1000;    // drop 1 pixel every 1000ms

    const convertBlock = (block: Array<Array<number>>): TBlock =>
        block.map((valArray) => valArray.map(val => val === 1
            ? { type: PixelType.TAKEN } : { type: PixelType.EMPTY }));

    const createNewTile = (block: TBlock): Tile => ({
        block,
        top: 0,
        left: 0,
        width: BlockFactory.getBlockWidth(block),
        height: block.length
    });

    const gameState = {
        gameInterval: 0,
        isPaused: false,
        score: 0,
    };

    let tile = createNewTile(convertBlock(BlockFactory.getRandomBlock()));

    const createRow = (width = BOARD_WIDTH, type = PixelType.EMPTY): Row => ({ pixels: Array<Pixel>(width).fill({ type }) });
    const createNewScreen = (height = BOARD_HEIGHT) => Array<Row>(height).fill(createRow());

    let screen: TScreen;

    const [actualScreen, setActualScreen] = createSignal<TScreen>(createNewScreen());
    const [score, setScore] = createSignal<number>(0);

    const onKeyDown = (e: KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowDown':
                tile.possibleTop = tile.top + 1;
                break;
            case 'ArrowRight':
                tile.possibleLeft = tile.left + tile.width < BOARD_WIDTH
                    ? tile.left + 1 : BOARD_WIDTH - tile.width;
                console.log(tile.possibleLeft);
                break;
            case 'ArrowLeft':
                tile.possibleLeft = tile.left > 0 ? tile.left - 1 : 0;
                break;
            case 'ArrowUp':
                tile.block = BlockFactory.rotateBlockCW(tile.block) as TBlock;
                tile.width = BlockFactory.getBlockWidth(tile.block);
                tile.height = tile.block.length;
                tile.left = tile.left + tile.width > BOARD_WIDTH
                    ? BOARD_WIDTH - tile.width : tile.left;
                break
            case 'p':
            case 'P':
                gameState.isPaused = !gameState.isPaused;
            default:
                break;
        }
        drawScreen();
    }

    const mainLoop = () => {
        if (gameState.isPaused) {
            return;
        }
        tile.possibleTop = tile.top + 1;
        drawScreen();
    }

    const drawScreen = () => {
        screen = clearFullLines(screen);

        // check for game over
        if(tile.top === 0 && detectCollision(tile, screen)) {
            gameOver();
        }

        // check left <-> right movement collision 
        const possibleDXTile = {...tile};
        possibleDXTile.left = possibleDXTile.possibleLeft !== undefined ? possibleDXTile.possibleLeft : possibleDXTile.left;
        if(!detectCollision(possibleDXTile, screen)) {
            tile.left = possibleDXTile.left;
            console.log(`no collision to left/right`, tile);
        }

        tile.top = tile.possibleTop !== undefined ? tile.possibleTop : tile.top;

        // detect if tile at the board end
        if (tile.top + tile.height >= BOARD_HEIGHT) {
            screen = mixinTileToScreen(tile, screen);
            tile = createNewTile(convertBlock(BlockFactory.getRandomBlock()));
        }
        
        // detect down movement collision
        const possibleDYTile = {...tile};
        possibleDYTile.top += 1;
        if(detectCollision(possibleDYTile, screen)) {
            screen = mixinTileToScreen(tile, screen);
            tile = createNewTile(convertBlock(BlockFactory.getRandomBlock()));
        }

        screen = markFullLines(screen);

        setActualScreen(getActualScreen());

        delete tile.possibleLeft;
        delete tile.possibleTop;
    }

    const gameOver = () => {
        reset();
    }

    const markFullLines = (screen: TScreen): TScreen => {
        return screen.map((row, index)=> {
            const taken = row.pixels.filter(({type}) => type !== PixelType.EMPTY).length;
            if(taken === BOARD_WIDTH) {
                const nrow = createRow(BOARD_WIDTH, PixelType.REMOVING);
                return nrow;
            }
            return row;
        });
    }

    const clearFullLines = (screen: TScreen): TScreen => {
        const clearedScreen = screen.filter((row, index)=> {
            const taken = row.pixels.filter(({type}) => type !== PixelType.EMPTY).length;
            return taken !== BOARD_WIDTH;
        });
        const diff = screen.length - clearedScreen.length;
        if(diff > 0) {
            gameState.score += 100 * diff * diff * 0.5;
            setScore(gameState.score);
            return [...Array<Row>(diff).fill(createRow()), ...clearedScreen];
        }
        return screen;
    };

    const detectCollision = (tile: Tile, screen: TScreen): boolean => {
        const block = tile.block;
        let collision = false;
        console.log(`detectCollision`, tile);
        for (let row = 0; row < block.length; row++) {
            for (let col = 0; col < block[row].length; col++) {
                if (block[row][col].type != PixelType.EMPTY) {
                    // console.log(row, tile.top, col, screen[row + tile.top].pixels[col + tile.left]);
                    if(screen[row + tile.top].pixels[col + tile.left].type !== PixelType.EMPTY) {
                        console.log(`collision`, tile);
                        collision = true;
                    }
                }
            }
        }
        return collision;
    }

    const mixinTileToScreen = (theTile: Tile, screen: TScreen): TScreen => {
        return screen.map(
            (row, rowIndex) => {
                const pixels = row.pixels.map(
                    (pixel, pindex) => {
                        const ty = rowIndex - theTile.top;
                        const tx = pindex - theTile.left;
                        const tpixel = theTile.block[ty]?.[tx];
                        const npixel = tpixel && tpixel.type !== PixelType.EMPTY ? tpixel : row.pixels[pindex];
                        return npixel;
                    });
                return { ...row, pixels };
            });
    }

    const reset = () => {
        pause();
        clearInterval(gameState.gameInterval);
        gameState.score = 0;
        setScore(0);
        screen = createNewScreen();
        tile = createNewTile(convertBlock(BlockFactory.getRandomBlock()));
        setActualScreen(getActualScreen());
        start();
    };

    const pause = () => {
        gameState.isPaused = true;
    };

    const start = () => {
        gameState.gameInterval = setInterval(mainLoop, GAME_TICK);
        gameState.isPaused = false;
    };

    const getActualScreen = (): Array<Row> => {
        return mixinTileToScreen(tile, screen);
    }

    reset();

    console.log(screen!);

    return {
        width: BOARD_WIDTH,
        height: BOARD_HEIGHT,
        screen: actualScreen,
        score: score,
        onKeyDown,
        reset,
        pause,
        start
    }
}

export default createBoard;