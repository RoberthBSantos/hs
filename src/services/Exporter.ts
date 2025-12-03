import DxfWriter from 'dxf-writer';
import { Room, Wall } from '../models/Room';

export class Exporter {

  static exportToOBJ(room: Room): string {
    let output = `# Room Export: ${room.name}\n`;
    let vertexCount = 1;

    // Helper to add vertices
    const addVertex = (x: number, y: number, z: number) => {
      output += `v ${x.toFixed(4)} ${y.toFixed(4)} ${z.toFixed(4)}\n`;
    };

    // Helper to add face
    const addFace = (v1: number, v2: number, v3: number, v4?: number) => {
      if (v4) {
        output += `f ${v1} ${v2} ${v3} ${v4}\n`;
      } else {
        output += `f ${v1} ${v2} ${v3}\n`;
      }
    };

    // Export Walls
    // For simplicity, we export walls as simple boxes.
    // A robust implementation would handle intersections.

    room.walls.forEach(wall => {
      const start = wall.startNode.position;
      const end = wall.endNode.position;
      const height = wall.height;
      const thickness = wall.thickness;

      // Calculate perpendicular vector for thickness
      const dx = end.x - start.x;
      const dz = end.z - start.z;
      const len = Math.sqrt(dx*dx + dz*dz);
      const nx = -dz / len * thickness / 2;
      const nz = dx / len * thickness / 2;

      // 4 base corners
      const v1 = { x: start.x + nx, y: 0, z: start.z + nz };
      const v2 = { x: end.x + nx, y: 0, z: end.z + nz };
      const v3 = { x: end.x - nx, y: 0, z: end.z - nz };
      const v4 = { x: start.x - nx, y: 0, z: start.z - nz };

      // Add vertices (Base and Top)
      [v1, v2, v3, v4].forEach(v => addVertex(v.x, v.y, v.z)); // 1, 2, 3, 4
      [v1, v2, v3, v4].forEach(v => addVertex(v.x, height, v.z)); // 5, 6, 7, 8

      // Add faces (using current vertexCount offset)
      const vc = vertexCount;

      // Bottom
      addFace(vc, vc+3, vc+2, vc+1);
      // Top
      addFace(vc+4, vc+5, vc+6, vc+7);
      // Sides
      addFace(vc, vc+1, vc+5, vc+4);
      addFace(vc+1, vc+2, vc+6, vc+5);
      addFace(vc+2, vc+3, vc+7, vc+6);
      addFace(vc+3, vc, vc+4, vc+7);

      output += `g Wall_${wall.id}\n`;
      vertexCount += 8;
    });

    return output;
  }

  static exportToDXF(room: Room): string {
    const writer = new DxfWriter();
    const layerName = 'Walls';

    writer.addLayer(layerName, DxfWriter.ACI.RED, 'CONTINUOUS');
    writer.setActiveLayer(layerName);

    room.walls.forEach(wall => {
        const start = wall.startNode.position;
        const end = wall.endNode.position;
        const thickness = wall.thickness;

        // Calculate perpendicular vector for thickness representation in 2D
        const dx = end.x - start.x;
        const dz = end.z - start.z; // In 2D CAD, usually X and Y are used. We'll map Z to Y.

        // Map 3D coordinates (x, z) to 2D CAD (x, y)
        const x1 = start.x;
        const y1 = start.z; // Mapping Z to Y
        const x2 = end.x;
        const y2 = end.z; // Mapping Z to Y

        // Draw centerline
        // writer.drawLine(x1, y1, x2, y2);

        // Calculate offset for thickness lines
        const len = Math.sqrt(dx*dx + dz*dz);
        const nx = -dz / len * thickness / 2;
        const ny = dx / len * thickness / 2; // ny corresponds to nz in 3D

        // Draw outer lines representing the wall thickness
        writer.drawLine(x1 + nx, y1 + ny, x2 + nx, y2 + ny);
        writer.drawLine(x1 - nx, y1 - ny, x2 - nx, y2 - ny);

        // Close the wall caps
        writer.drawLine(x1 + nx, y1 + ny, x1 - nx, y1 - ny);
        writer.drawLine(x2 + nx, y2 + ny, x2 - nx, y2 - ny);

        // Draw openings (simple lines across)
        wall.openings.forEach(opening => {
            // Calculate opening position along the wall vector
            // This is a simplified representation
            // In a real CAD export, we would 'trim' the wall lines.
            // Here we just mark them.
            // (Implementation of precise trimming is complex for this scope)
        });
    });

    return writer.toDxfString();
  }
}
