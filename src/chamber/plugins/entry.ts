type Point = { x: number, y: number };
type Cell = { position: Point, color: Color };
type Color = 'red' | 'black';
type Food = { position: Point, saturation: number };

const CELL_SIZE = 12;

export class Entry {
    public render (context: CanvasRenderingContext2D, width: number, height: number) {
        let cells = [
            { position: { x: 10, y: 10 }, color: 'red' },
            { position: { x: 10, y: 11 }, color: 'black' },
        ] as Cell[];

        for (let cell of cells) {
            context.beginPath();
            context.rect(cell.position.x * CELL_SIZE, cell.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            context.fillStyle = cell.color;
            context.fill();
        }

        let food = [
            { position: { x: 20, y: 10 }, saturation: 1 },
            { position: { x: 20, y: 11 }, saturation: 1 },
        ] as Food[];

        for (let item of food) {
            context.beginPath();
            context.rect(item.position.x * CELL_SIZE, item.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            context.fillStyle = 'green'
            context.fill();
        }
    }
}
