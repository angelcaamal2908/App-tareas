import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Entypo } from '@expo/vector-icons';
import TaskList from "./TaskList";
import TaskForm from "./TaskForm"; // Importa TaskForm
import colors from '../colors';

const Home = () => {
  const navigation = useNavigation();
  const [tasks, setTasks] = useState([]);

  // Función para agregar una nueva tarea
  const addTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lista de Actividades</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Chat")}
          style={styles.chatButton}
        >
          <Entypo name="chat" size={24} color={colors.lightGray} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <TaskList tasks={tasks} />
        <TouchableOpacity
          onPress={() => navigation.navigate("TaskForm")} // Navegar a TaskForm
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>Agregar Tarea</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.black,
  },
  content: {
    flexGrow: 1,
    padding: 20,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  chatButton: {
    backgroundColor: colors.primary,
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.lightGray,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: .5,
    shadowRadius: 8,
  },
});

export default Home;
