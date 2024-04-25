// AddTaskScreen.js
import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Dimensions, Alert } from "react-native";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { database, auth } from '../config/firebase';

const AddTaskScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleAddTask = async () => {
    if (title && description) {
      try {
        // Guardar la tarea en Firebase
        const docRef = await addDoc(collection(database, 'tasks'), {
          title, // Título de la tarea
          description, // Descripción de la tarea
          status: "en proceso", // Estado predeterminado "En proceso"
          createdAt: serverTimestamp(), // Fecha de creación
          user: {
            _id: auth.currentUser.uid, // ID del usuario
            email: auth.currentUser.email, // Email del usuario
            displayName: auth.currentUser.displayName // Nombre del usuario
          }
        });

        // Mostrar mensaje de tarea registrada
        Alert.alert("Tarea registrada", "La tarea se ha registrado exitosamente.");

        // Limpiar el formulario después de agregar la tarea
        setTitle("");
        setDescription("");

        // Navegar de vuelta al inicio
        navigation.navigate("Home");
      } catch (error) {
        console.error("Error al agregar la tarea: ", error);
      }
    } else {
      // Mostrar mensaje de error si los campos están vacíos
      Alert.alert("Campos vacíos", "Por favor, complete todos los campos.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
      />
      <Button title="Agregar Tarea" onPress={handleAddTask} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  input: {
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
});

export default AddTaskScreen;

