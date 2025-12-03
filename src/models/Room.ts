import { v4 as uuidv4 } from 'uuid';
import * as THREE from 'three';

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export type OpeningType = 'door' | 'window';

export interface Opening {
  id: string;
  type: OpeningType;
  wallId: string;
  distanceFromStart: number; // Distance from the start node of the wall
  width: number;
  height: number;
  sillHeight: number; // Height from floor (0 for doors usually)
}

export class Node {
  id: string;
  position: Point3D;

  constructor(position: Point3D) {
    this.id = uuidv4();
    this.position = position;
  }
}

export class Wall {
  id: string;
  startNode: Node;
  endNode: Node;
  thickness: number; // in meters
  height: number; // in meters
  openings: Opening[];

  constructor(startNode: Node, endNode: Node, thickness: number = 0.15, height: number = 2.8) {
    this.id = uuidv4();
    this.startNode = startNode;
    this.endNode = endNode;
    this.thickness = thickness;
    this.height = height;
    this.openings = [];
  }

  getLength(): number {
    return Math.sqrt(
      Math.pow(this.endNode.position.x - this.startNode.position.x, 2) +
      Math.pow(this.endNode.position.z - this.startNode.position.z, 2) // Assuming Y is up
    );
  }

  addOpening(type: OpeningType, distanceFromStart: number, width: number, height: number, sillHeight: number = 0) {
    const opening: Opening = {
      id: uuidv4(),
      type,
      wallId: this.id,
      distanceFromStart,
      width,
      height,
      sillHeight
    };
    this.openings.push(opening);
  }
}

export class Room {
  id: string;
  nodes: Node[];
  walls: Wall[];
  name: string;

  constructor(name: string = "New Room") {
    this.id = uuidv4();
    this.nodes = [];
    this.walls = [];
    this.name = name;
  }

  addNode(position: Point3D): Node {
    const node = new Node(position);
    this.nodes.push(node);

    // Automatically create wall if there's a previous node
    if (this.nodes.length > 1) {
      const prevNode = this.nodes[this.nodes.length - 2];
      this.addWall(prevNode, node);
    }

    return node;
  }

  closeLoop() {
    if (this.nodes.length > 2) {
      const firstNode = this.nodes[0];
      const lastNode = this.nodes[this.nodes.length - 1];
      this.addWall(lastNode, firstNode);
    }
  }

  addWall(start: Node, end: Node) {
    const wall = new Wall(start, end);
    this.walls.push(wall);
  }
}
