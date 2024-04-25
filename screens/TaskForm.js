 import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Dimensions, Alert } from "react-native";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { database, auth } from '../config/firebase';
import { MaterialIcons } from '@expo/vector-icons'; 
import DateTimePickerModal from "react-native-modal-datetime-picker";

const TaskForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isStartDatePickerVisible, setIsStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setIsEndDatePickerVisible] = useState(false);

  const handleStartDateConfirm = (date) => {
    setStartDate(date);
    setIsStartDatePickerVisible(false);
  };

  const handleEndDateConfirm = (date) => {
    setEndDate(date);
    setIsEndDatePickerVisible(false);
  };

  const handleAddTask = async () => {
    if (title && description && startDate && endDate) {
      try {
        // Guardar la tarea en Firebase
        const docRef = await addDoc(collection(database, 'tasks'), {
          title, // Título de la tarea
          description, // Descripción de la tarea
          status: "en proceso", // Estado predeterminado "En proceso"
          startDate, // Fecha de inicio
          endDate, // Fecha límite
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
        setStartDate(null);
        setEndDate(null);
      } catch (error) {
        console.error("Error al agregar la tarea: ", error);
      }
    } else {
      // Mostrar mensaje de error si los campos están vacíos
      Alert.alert("Campos vacíos", "Por favor, complete todos los campos y seleccione las fechas.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <MaterialIcons name="title" size={24} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Título"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#666"
        />
      </View>
      <View style={styles.inputContainer}>
        <MaterialIcons name="description" size={24} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Descripción"
          value={description}
          onChangeText={setDescription}
          placeholderTextColor="#666"
          multiline={true}
          numberOfLines={4}
        />
      </View>
      <View style={styles.inputContainer}>
        <MaterialIcons name="date-range" size={24} color="#666" style={styles.icon} />
        <Button title="Seleccionar Fecha de Inicio" onPress={() => setIsStartDatePickerVisible(true)} color="#007bff" />
        <DateTimePickerModal
          isVisible={isStartDatePickerVisible}
          mode="datetime"
          onConfirm={handleStartDateConfirm}
          onCancel={() => setIsStartDatePickerVisible(false)}
        />
      </View>
      <View style={styles.inputContainer}>
        <MaterialIcons name="date-range" size={24} color="#666" style={styles.icon} />
        <Button title="Seleccionar Fecha Límite" onPress={() => setIsEndDatePickerVisible(true)} color="#007bff" />
        <DateTimePickerModal
          isVisible={isEndDatePickerVisible}
          mode="datetime"
          onConfirm={handleEndDateConfirm}
          onCancel={() => setIsEndDatePickerVisible(false)}
        />
      </View>
      <Button title="Agregar Tarea" onPress={handleAddTask} color="#007bff" />
    </View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: width * 0.8,
    alignSelf: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    color: "#333",
  },
  icon: {
    marginRight: 10,
  },
});

export default TaskForm;