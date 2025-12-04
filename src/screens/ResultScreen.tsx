import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Room, Node, Wall, Opening } from '../models/Room';
import { RoomViewer } from '../components/RoomViewer';
import { Exporter } from '../services/Exporter';
// Usamos a API legacy porque writeAsStringAsync da raiz foi descontinuado no SDK 54
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

type RootStackParamList = {
  Scan: undefined;
  Result: { roomData: string };
};

type ResultScreenRouteProp = RouteProp<RootStackParamList, 'Result'>;

const ResultScreen = () => {
  const route = useRoute<ResultScreenRouteProp>();
  const [room, setRoom] = useState<Room | null>(null);

  useEffect(() => {
    if (route.params?.roomData) {
      try {
        const data = JSON.parse(route.params.roomData);
        // Reconstruct the Room object with methods
        const newRoom = new Room(data.name);

        const nodeMap = new Map<string, Node>();
        data.nodes.forEach((n: any) => {
            const newNode = new Node(n.position);
            newNode.id = n.id;
            newRoom.nodes.push(newNode);
            nodeMap.set(n.id, newNode);
        });

        data.walls.forEach((w: any) => {
             const start = nodeMap.get(w.startNode.id);
             const end = nodeMap.get(w.endNode.id);
             if (start && end) {
                 const newWall = new Wall(start, end, w.thickness, w.height);
                 newWall.id = w.id;
                 if (w.openings) {
                    w.openings.forEach((o: any) => {
                        newWall.openings.push({ ...o });
                    });
                 }
                 newRoom.walls.push(newWall);
             }
        });

        setRoom(newRoom);
      } catch (e) {
        console.error("Failed to parse room data", e);
      }
    }
  }, [route.params?.roomData]);

  const saveAndShareFile = async (content: string, filename: string, mimeType: string) => {
      try {
        if (Platform.OS === 'web') {
            console.log(`[Web Simulation] Download would start for ${filename}`);
            Alert.alert("Web Export", "Check console for output data.");
            return;
        }

        const fileUri = FileSystem.documentDirectory + filename;
        // Em SDKs mais novos, o encoding padrão já é UTF-8, então não precisamos
        // usar FileSystem.EncodingType (que pode ser undefined dependendo da versão).
        await FileSystem.writeAsStringAsync(fileUri, content);

        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri, { mimeType, dialogTitle: `Export ${filename}` });
        } else {
            Alert.alert("Saved", `File saved to ${fileUri}`);
        }
      } catch (error) {
          console.error("Export Error", error);
          Alert.alert("Error", "Failed to export file.");
      }
  };

  const handleExportOBJ = async () => {
    if (!room) return;
    const objContent = Exporter.exportToOBJ(room);
    await saveAndShareFile(objContent, `${room.name.replace(/\s/g, '_')}.obj`, 'text/plain');
  };

  const handleExportDXF = async () => {
    if (!room) return;
    const dxfContent = Exporter.exportToDXF(room);
    await saveAndShareFile(dxfContent, `${room.name.replace(/\s/g, '_')}.dxf`, 'application/dxf');
  };

  if (!room) return <View style={styles.loading}><Text>Loading Model...</Text></View>;

  return (
    <View style={styles.container}>
      <View style={styles.viewerContainer}>
        <RoomViewer room={room} />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title}>{room.name}</Text>
        <Text>Area: {(room.walls.reduce((acc, w) => acc + w.getLength(), 0) * 2.8).toFixed(2)} m² (approx wall surface)</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.button} onPress={handleExportOBJ}>
          <Text style={styles.buttonText}>Export to OBJ (SketchUp)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={handleExportDXF}>
          <Text style={styles.buttonText}>Export to DXF (AutoCAD)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewerContainer: {
    flex: 2,
    backgroundColor: '#eee',
  },
  infoContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  actions: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonSecondary: {
    backgroundColor: '#5856D6',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  }
});

export default ResultScreen;
