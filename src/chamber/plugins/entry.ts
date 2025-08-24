const rand = (f, t) => Math.floor(Math.random() * (t - f)) + f;

type Point = { x: number, y: number };
type Cell = { position: Point, color: Color, brain: any, saturation: number };
type Color = 'red' | 'black';
type Food = { position: Point, saturation: number };

const CELL_SIZE = 12;

const createSimpleBrain = () => {
    return {
        nodes: [
            { role: 'input_food_left', power: 0 }, // 0
            { role: 'input_food_right', power: 0 }, // 1
            { role: 'input_food_top', power: 0 }, // 2
            { role: 'input_food_bottom', power: 0 }, // 3
            { power: 0 }, // 4
            { power: 0 }, // 5
            { role: 'output_move_left', power: 0 }, // 6
            { role: 'output_move_right', power: 0 }, // 7
            { role: 'output_move_top', power: 0 }, // 8
            { role: 'output_move_bottom', power: 0 }, // 9
        ],
        connections: [
            { from: 0, to: 6, power: 1 },
            { from: 1, to: 7, power: 1 },
            { from: 2, to: 8, power: 1 },
            { from: 3, to: 9, power: 1 },
        ],
    };
};

const tickBrain = (brain, inputs) => {
    for (let node of brain.nodes) {
        if (node.role?.startsWith('input_')) {
            node.power = inputs[node.role.slice(6)] ?? 0;
        }
    }

    for (let i = 0; i < brain.nodes.length; ++i) {
        const node = brain.nodes[i];
        const incoming_connections = brain.connections.filter((c) => c.to === i);
        const sum = incoming_connections.length > 0 ? (
            incoming_connections
                .reduce((acc, connection) => acc + (brain.nodes[connection.from]?.power ?? 0) * connection.power, 0) 
                / incoming_connections.length
        ) : 0;

        node.power = (node.power * 0.6) + sum;
        // node.power = sum;
    }

    return brain.nodes
        .filter((node) => node.role?.startsWith('output_'))
        .reduce((acc, node) => ({ ...acc, [node.role.slice(7)]: node.power }), {});
};

let cells = [
    { position: { x: 10, y: 10 }, color: 'red', brain: createSimpleBrain(), saturation: 9 },
    { position: { x: 10, y: 11 }, color: 'black', brain: createSimpleBrain(), saturation: 9 },
] as Cell[];

let food = [
    { position: { x: 20, y: 10 }, saturation: 1 },
    { position: { x: 20, y: 11 }, saturation: 1 },
] as Food[];

const point_same = (a, b) => a.x === b.x && a.y === b.y;
const point_add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y });

const rand_dir = () => {
    if (Math.random() < .25) {
        return { x: 1, y: 0 };
    } else if (Math.random() < .33) {
        return { x: -1, y: 0 };
    } else if (Math.random() < .5) {
        return { x: 0, y: 1 };
    } else {
        return { x: 0, y: -1 };
    }
};

// const cloneBrain = (brain) => {
//     let newBrain = { ...brain };

//     // Duplicate powered nodes and duplicate connections

//     return newBrain;
// };

const cloneBrain = (brain, mutationRate = 1) => {
    // 1. Deep clone the original brain
    const newNodes = brain.nodes.map(node => ({ ...node }));
    const newConnections = brain.connections.map(conn => ({ ...conn }));
    let newBrain = { nodes: newNodes, connections: newConnections };

    // 2. Apply mutations
    if (Math.random() < mutationRate) {
        // Choose a random type of mutation
        const mutationType = Math.random();

        if (mutationType < 0.6) {
            // Mutation Type 1: Modify the power of a random connection (most common)
            const randomConnIndex = Math.floor(Math.random() * newBrain.connections.length);
            // Change the weight by adding a value between -0.5 and 0.5
            newBrain.connections[randomConnIndex].power += (Math.random() - 0.5);
            console.log("Mutated connection power:", randomConnIndex);
        } else if (mutationType < 0.8 && newBrain.nodes.length < 15) { // Limit total nodes
            // Mutation Type 2: Add a new node
            const newNode = { power: 0 };
            newBrain.nodes.push(newNode);
            console.log("Added new node:", newBrain.nodes.length - 1);
        } else if (mutationType < 1.0) {
            // Mutation Type 3: Add a new connection
            // Pick any two random nodes (can be input, hidden, or output)
            const fromIndex = Math.floor(Math.random() * newBrain.nodes.length);
            const toIndex = Math.floor(Math.random() * newBrain.nodes.length);

            // Optional: Don't allow connections to input nodes or from output nodes if you want.
            // if (newBrain.nodes[toIndex].role?.startsWith('input')) continue;
            // if (newBrain.nodes[fromIndex].role?.startsWith('output')) continue;

            // Check if this connection already exists to avoid duplicates
            const connectionExists = newBrain.connections.some(conn =>
                conn.from === fromIndex && conn.to === toIndex
            );

            if (!connectionExists) {
                newBrain.connections.push({
                    from: fromIndex,
                    to: toIndex,
                    power: (Math.random() - 0.5) * 2 // Random power between -1 and 1
                });
                console.log("Added new connection from", fromIndex, "to", toIndex);
            }
        }
    }

    return newBrain;
};

const cloneCell = (cell, saturation) => {
    return {
        ...cell,
        position: point_add(cell.position, rand_dir()),
        saturation,
        brain: cloneBrain(cell.brain),
    }
};

export class Entry {
    public render (context: CanvasRenderingContext2D, width: number, height: number) {
        for (let cell of cells) {
            const inputs = {
                food_right: food.find((f) => point_same(f.position, point_add(cell.position, { x: 1, y: 0 }))) ? 1 : 0,
                food_left: food.find((f) => point_same(f.position, point_add(cell.position, { x: -1, y: 0 }))) ? 1 : 0,
                food_top: food.find((f) => point_same(f.position, point_add(cell.position, { x: 0, y: -1 }))) ? 1 : 0,
                food_bottom: food.find((f) => point_same(f.position, point_add(cell.position, { x: 0, y: 1 }))) ? 1 : 0,
            };

            const outputs = tickBrain(cell.brain, inputs);

            if (outputs.move_right > 0.5) {
                cell.position = point_add(cell.position, { x: 1, y: 0 });
                cell.saturation -= 0.5;
            } else 

            if (outputs.move_left > 0.5) {
                cell.position = point_add(cell.position, { x: -1, y: 0 });
                cell.saturation -= 0.5;
            } else 

            if (outputs.move_top > 0.5) {
                cell.position = point_add(cell.position, { x: 0, y: -1 });
                cell.saturation -= 0.5;
            } else 

            if (outputs.move_bottom > 0.5) {
                cell.position = point_add(cell.position, { x: 0, y: 1 });
                cell.saturation -= 0.5;
            }

            
            const saturation_add = food.filter((f) => point_same(cell.position, f.position)).length;
            food = food.filter((f) => !point_same(cell.position, f.position));

            cell.saturation += saturation_add;
            cell.saturation -= 0.01;

            if (cell.saturation > 10) {
                cell.saturation = 0;

                cells.push(cloneCell(cell, 5));
                cells.push(cloneCell(cell, 5));
            }
        }

        cells = cells.filter((c) => c.saturation > 0);

        for (let i = 0; i < 3; ++i) {
        // if (Math.random() > .5) {
            const position = { x: rand(0, 40), y: rand(0, 40) };

            food.push({ position, saturation: 1 });
        }
        // }

        for (let item of food) {
            context.beginPath();
            context.rect(item.position.x * CELL_SIZE, item.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            context.fillStyle = 'green'
            context.fill();
        }

        for (let cell of cells) {
            context.beginPath();
            context.rect(cell.position.x * CELL_SIZE, cell.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            context.fillStyle = cell.color;
            context.fill();
        }
    }
}
