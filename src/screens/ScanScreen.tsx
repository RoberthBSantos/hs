import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Room, Node } from '../models/Room';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Scan: undefined;
  Result: { roomData: string }; // Passing as JSON string
};

type ScanScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Scan'>;

const ScanScreen = () => {
  const navigation = useNavigation<ScanScreenNavigationProp>();
  const [scanning, setScanning] = useState(false);
  const [room, setRoom] = useState<Room | null>(null);

  // Simulation logic
  const startScanSimulation = () => {
    setScanning(true);
    const newRoom = new Room("Living Room");

    // Simulate detecting corners over time
    // Square room 4x4 meters
    setTimeout(() => { newRoom.addNode({ x: 0, y: 0, z: 0 }); }, 500);
    setTimeout(() => { newRoom.addNode({ x: 4, y: 0, z: 0 }); }, 1500);
    setTimeout(() => { newRoom.addNode({ x: 4, y: 0, z: 4 }); }, 2500);
    setTimeout(() => { newRoom.addNode({ x: 0, y: 0, z: 4 }); }, 3500);

    setTimeout(() => {
        newRoom.closeLoop();

        // Add a door to the first wall
        if (newRoom.walls.length > 0) {
            newRoom.walls[0].addOpening('door', 2, 0.9, 2.1);
        }
        // Add a window to the second wall
         if (newRoom.walls.length > 1) {
            newRoom.walls[1].addOpening('window', 2, 1.2, 1.2, 1.0);
        }

        setScanning(false);
        setRoom(newRoom);

        // Navigate to results
        // We serialize the object because passing complex classes via nav params can be tricky
        // Ideally we would use a Global Store (Context/Redux/Zustand)
        // But for this PoC, JSON stringify works (methods are lost, need reconstruction)
        // Actually, let's just use a global variable or simple pass for this PoC.
        // Wait, JSON.stringify removes methods.
        // I will create a static method in Room to hydrate from JSON or just recreate it in the next screen.
        // For simplicity, I'll pass the JSON and parse it in ResultScreen.

        // Serializing only data properties
        const serialized = JSON.stringify(newRoom);
        navigation.navigate('Result', { roomData: serialized });

    }, 4500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.cameraPlaceholder}>
        <Text style={styles.cameraText}>
          {scanning ? "Scanning... (Simulating AR)" : "Camera View Placeholder"}
        </Text>
        {scanning && <Text style={styles.scanningText}>Detecting Corners...</Text>}
      </View>

      <View style={styles.controls}>
        {!scanning && (
          <TouchableOpacity style={styles.button} onPress={startScanSimulation}>
            <Text style={styles.buttonText}>Start Room Scan</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
  },
  cameraText: {
    color: 'white',
    fontSize: 18,
  },
  scanningText: {
    color: '#00ff00',
    marginTop: 20,
    fontSize: 16,
  },
  controls: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  button: {
    backgroundColor: 'white',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default ScanScreen;
