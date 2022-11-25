import BlockFactory from "./BlockFactory";
import { PixelType, TBlock, Tile } from "./Board";

class TilesUtils {
    private static instance: TilesUtils;

    public convertBlock = (block: Array<Array<number>>): TBlock =>
        block.map((valArray) => valArray.map(val => val === 1
            ? { type: PixelType.TAKEN } : { type: PixelType.EMPTY }));

    public getRandomByte = () => Math.floor(Math.random() * 255).toString(16);
    public getRandomColor = () => `#${this.getRandomByte()}${this.getRandomByte()}${this.getRandomByte()}`;

    public createNewTile = (block: TBlock): Tile => ({
        block,
        top: 0,
        left: 0,
        width: BlockFactory.getBlockWidth(block),
        height: block.length
    });

    public centerTile = (tile: Tile, screenWidth: number): Tile => {
        tile.left = Math.floor((screenWidth - BlockFactory.getBlockWidth(tile.block)) / 2);
        return tile;
    }

    public randomColorTile = (tile: Tile): Tile => {
        const color = this.getRandomColor();
        const style = {'background-color': color};
        const block = tile.block.map((pixels) => pixels.map(pixel => ({...pixel, style})));
        return {...tile, block};
    }

    private static createNewInstance(): TilesUtils {
        this.instance = new TilesUtils();
        return this.instance;
    }

    public static getInstance(): TilesUtils {
        return this.instance ? this.instance : this.createNewInstance();
    }
}

export default TilesUtils.getInstance();