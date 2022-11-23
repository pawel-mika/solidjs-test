import { Accessor, createSignal } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import BlockFactory from "./BlockFactory";

export enum PixelType {
    EMPTY,
    TAKEN,
    MOVING,
    REMOVING
}

type TBlock = Array<Array<Pixel>>;
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
}

export interface Row {
    tiles: Array<Pixel>;
}

export interface Board {
    width: number;
    height: number;
    screen: Accessor<Array<Row>>;
    onKeyDown: (e: KeyboardEvent) => void;
    reset: () => void;
    pause: () => void;
    start: () => void;
}


const createBoard = (): Board => {
    const GAME_TICK = 1000 / 25;  // let's aim 25FPS;)
    const BOARD_WIDTH = 10;
    const BOARD_HEIGHT = 20;
    const TILE_SPEED = 1000;    // drop 1 pixel every 1000ms

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
        isPaused: false
    };

    // const tile = {
    //     tile: convertBlock(BlockFactory.getRandomBlock()),
    //     top: 0,
    //     left: 0,
    // }

    let tile = createNewTile(convertBlock(BlockFactory.getRandomBlock()));

    const createRow = (width = BOARD_WIDTH) => ({ tiles: Array<Pixel>(width).fill({ type: PixelType.MOVING }) });

    const createNewScreen = (height = BOARD_HEIGHT) => Array<Row>(height).fill(createRow());

    const screen: Array<Row> = createNewScreen();
    
    const [actualScreen, setActualScreen] = createSignal(screen);

    const onKeyDown = (e: KeyboardEvent) => {
        console.log(e);
        // tile.tile = convertBlock(BlockFactory.getRandomBlock());
        setActualScreen(getActualScreen());
        console.log(actualScreen());
        switch(e.key) {
            case 'ArrowDown':
                tile.top+=1;
                break;
            case 'ArrowRight':
                tile.left = tile.left + tile.width <= BOARD_WIDTH
                    ? tile.left + 1 : BOARD_WIDTH - tile.width;
                break;
            case 'ArrowLeft':
                tile.left = tile.left > 0 ? tile.left - 1 : 0;
                break;
            case 'ArrowUp': 
                // tile.block = BlockFactory.rotateBlockCW(tile.block);
                break
            default:
                break;
            }

        console.log(tile);

        if(tile.top + tile.height > BOARD_HEIGHT) {
            tile = createNewTile(convertBlock(BlockFactory.getRandomBlock()));
        }
    }

    const mainLoop = () => {
        const theTile = tile.block;
        const newTop = tile.top + 1;
        const newLeft = tile.left;
        for (let row = 0; row < theTile.length; row++) {
            for (let col = 0; theTile[row].length; col++) {
                if (theTile[col][row]) {
                    // if(screen[row + ])
                }
            }
        }
    }

    const reset = () => { };
    const pause = () => { };
    const start = () => {
        gameState.gameInterval = setInterval(mainLoop, GAME_TICK);
    };

    const getActualScreen = (): Array<Row> => {
        return screen.map(
            (row, rowIndex) => {
                const tiles = row.tiles.map(
                    (pixel, pindex) => {
                        const ty = rowIndex - tile.top;
                        const tx = pindex - tile.left;
                        // console.log(currentTile.tile[ty]?.[tx]);
                        const npixel = tile.block[ty]?.[tx] || row.tiles[pindex];
                        return npixel;
                    });
                return {...row, tiles};
            });
    }

    setActualScreen(getActualScreen());

    console.log(screen);

    return {
        width: BOARD_WIDTH,
        height: BOARD_HEIGHT,
        screen: actualScreen,
        onKeyDown,
        reset,
        pause,
        start
    }
}

export default createBoard;