import { Room } from './Room';
import { Exporter } from '../services/Exporter';

describe('Room Logic', () => {
  it('should correctly calculate wall dimensions and nodes', () => {
    const room = new Room("Test Room");

    // Add Nodes (Square 4x4)
    room.addNode({ x: 0, y: 0, z: 0 });
    room.addNode({ x: 4, y: 0, z: 0 });
    room.addNode({ x: 4, y: 0, z: 4 });
    room.addNode({ x: 0, y: 0, z: 4 });

    room.closeLoop();

    expect(room.nodes.length).toBe(4);
    expect(room.walls.length).toBe(4);
    expect(room.walls[0].getLength()).toBeCloseTo(4);
  });
});

describe('Exporter Logic', () => {
    it('should generate valid OBJ output', () => {
        const room = new Room("Test Room");
        room.addNode({ x: 0, y: 0, z: 0 });
        room.addNode({ x: 4, y: 0, z: 0 });
        room.closeLoop(); // Makes a double wall but fine for testing export structure

        const objData = Exporter.exportToOBJ(room);
        expect(objData).toContain("# Room Export: Test Room");
        expect(objData).toContain("v ");
        expect(objData).toContain("f ");
    });

    it('should generate valid DXF output', () => {
        const room = new Room("Test Room");
        room.addNode({ x: 0, y: 0, z: 0 });
        room.addNode({ x: 4, y: 0, z: 0 });
        room.closeLoop();

        const dxfData = Exporter.exportToDXF(room);
        expect(dxfData).toContain("SECTION");
        expect(dxfData).toContain("Walls");
    });
});
