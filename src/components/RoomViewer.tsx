import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Room, Wall, Opening } from '../models/Room';

interface RoomViewerProps {
  room: Room;
}

const WallMesh: React.FC<{ wall: Wall }> = ({ wall }) => {
  const length = wall.getLength();
  const height = wall.height;
  const thickness = wall.thickness;

  // Calculate position (midpoint between nodes)
  const midX = (wall.startNode.position.x + wall.endNode.position.x) / 2;
  const midZ = (wall.startNode.position.z + wall.endNode.position.z) / 2;
  const midY = height / 2; // Center vertically

  // Calculate rotation
  const dx = wall.endNode.position.x - wall.startNode.position.x;
  const dz = wall.endNode.position.z - wall.startNode.position.z;
  const angle = Math.atan2(dz, dx);

  // In a real app, we would use CSG (Constructive Solid Geometry) to subtract openings.
  // For this viewer, we will simplify by rendering the wall as a solid block.
  // If there are openings, we could render them as different colored boxes for visualization.

  return (
    <group position={[midX, midY, midZ]} rotation={[0, -angle, 0]}>
      <mesh>
        <boxGeometry args={[length, height, thickness]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>

      {wall.openings.map((opening) => (
        <mesh
          key={opening.id}
          position={[
            opening.distanceFromStart - length / 2 + opening.width / 2,
            opening.sillHeight + opening.height / 2 - height / 2,
            0
          ]}
        >
          <boxGeometry args={[opening.width, opening.height, thickness * 1.1]} />
          <meshStandardMaterial color={opening.type === 'door' ? '#8B4513' : '#87CEEB'} transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
};

const FloorMesh: React.FC<{ room: Room }> = ({ room }) => {
  if (room.nodes.length < 3) return null;

  // Create a shape from the nodes
  const shape = new THREE.Shape();

  // Use the first node as origin for drawing the shape
  shape.moveTo(room.nodes[0].position.x, room.nodes[0].position.z);

  for (let i = 1; i < room.nodes.length; i++) {
    shape.lineTo(room.nodes[i].position.x, room.nodes[i].position.z);
  }
  // Close the shape
  shape.lineTo(room.nodes[0].position.x, room.nodes[0].position.z);

  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <shapeGeometry args={[shape]} />
      <meshStandardMaterial color="#f0f0f0" side={THREE.DoubleSide} />
    </mesh>
  );
};

export const RoomViewer: React.FC<RoomViewerProps> = ({ room }) => {
  return (
    <Canvas style={{ flex: 1, backgroundColor: '#1a1a1a' }}>
      <PerspectiveCamera makeDefault position={[0, 10, 10]} />
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      <group>
        {room.walls.map((wall) => (
          <WallMesh key={wall.id} wall={wall} />
        ))}
        <FloorMesh room={room} />
      </group>

      <gridHelper args={[20, 20]} />
    </Canvas>
  );
};
