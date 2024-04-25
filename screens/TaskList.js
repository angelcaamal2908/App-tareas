import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, Alert } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { collection, onSnapshot, deleteDoc, doc, orderBy, query, updateDoc } from 'firebase/firestore';
import { database } from '../config/firebase';
import { FontAwesome5 } from '@expo/vector-icons';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(null);

  // Arrays separados para cada estado de tarea
  const [completedTasks, setCompletedTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [notCompletedTasks, setNotCompletedTasks] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(database, 'tasks'), orderBy('createdAt', 'desc')),
      (querySnapshot) => {
        const taskData = [];
        const completed = [];
        const inProgress = [];
        const notCompleted = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.createdAt) {
            data.createdAt = data.createdAt.toDate();
          }
          if (data.startDate) {
            data.startDate = data.startDate.toDate();
          }
          if (data.endDate) {
            data.endDate = data.endDate.toDate();
          }
          taskData.push({
            id: doc.id,
            ...data,
          });
          // Clasificar las tareas según su estado
          switch (data.status) {
            case "completado":
              completed.push({ id: doc.id, ...data });
              break;
            case "en proceso":
              inProgress.push({ id: doc.id, ...data });
              break;
            case "no completado":
              notCompleted.push({ id: doc.id, ...data });
              break;
            default:
              break;
          }
        });
        setTasks(taskData);
        setCompletedTasks(completed);
        setInProgressTasks(inProgress);
        setNotCompletedTasks(notCompleted);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const handleDeleteTask = async (taskId) => {
    try {
      Alert.alert(
        "Confirmar eliminación",
        "¿Estás seguro de que quieres eliminar esta tarea?",
        [
          {
            text: "Cancelar",
            style: "cancel"
          },
          {
            text: "Eliminar",
            onPress: async () => {
              await deleteDoc(doc(database, 'tasks', taskId));
            }
          }
        ]
      );
    } catch (error) {
      console.error("Error al eliminar la tarea: ", error);
    }
  };

  const handleEditTitleAndDescription = (task) => {
    setSelectedTask(task);
    setEditedTitle(task.title);
    setEditedDescription(task.description);
    setEditModalVisible(true);
  };

  const handleUpdateTitleAndDescription = async () => {
    try {
      await updateDoc(doc(database, 'tasks', selectedTask.id), {
        title: editedTitle,
        description: editedDescription,
      });
      setEditModalVisible(false);
    } catch (error) {
      console.error("Error al actualizar el título y la descripción de la tarea: ", error);
    }
  };

  const handleEditStatus = (task) => {
    setSelectedTask(task);
    setSelectedStatus(task.status);
    setStatusModalVisible(true);
  };

  const handleUpdateStatus = async () => {
    try {
      await updateDoc(doc(database, 'tasks', selectedTask.id), {
        status: selectedStatus,
      });
      setStatusModalVisible(false);
    } catch (error) {
      console.error("Error al actualizar el estado de la tarea: ", error);
    }
  };

  const handleStatusSelection = (status) => {
    setSelectedStatus(status);
  };

  const renderStatusIcon = (status) => {
    switch (status) {
      case "completado":
        return <FontAwesome5 name="check-circle" size={20} color="green" style={styles.icon} />;
      case "en proceso":
        return <FontAwesome5 name="clock" size={20} color="orange" style={styles.icon} />;
      case "no completado":
        return <FontAwesome5 name="times-circle" size={20} color="red" style={styles.icon} />;
      default:
        return null;
    }
  };

  const renderEditModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => {
          setEditModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              value={editedTitle}
              onChangeText={setEditedTitle}
              placeholder="Título"
            />
            <TextInput
              style={styles.input}
              value={editedDescription}
              onChangeText={setEditedDescription}
              placeholder="Descripción"
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={handleUpdateTitleAndDescription}>
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderStatusModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={statusModalVisible}
        onRequestClose={() => {
          setStatusModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity onPress={() => handleStatusSelection("completado")}>
              <Text style={[styles.statusOption, selectedStatus === "completado" && styles.selectedStatusOption]}>Completado</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleStatusSelection("en proceso")}>
              <Text style={[styles.statusOption, selectedStatus === "en proceso" && styles.selectedStatusOption]}>En proceso</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleStatusSelection("no completado")}>
              <Text style={[styles.statusOption, selectedStatus === "no completado" && styles.selectedStatusOption]}>No completado</Text>
            </TouchableOpacity>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={handleUpdateStatus}>
                <Text style={styles.buttonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => setStatusModalVisible(false)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const TaskItem = ({ item }) => (
    <View style={styles.taskItem}>
      <View style={styles.taskInfo}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        {item.createdAt && (
          <Text style={styles.createdAt}>Creado: {item.createdAt.toLocaleString()}</Text>
        )}
        {item.startDate && (
          <Text style={styles.startDate}>Inicio: {item.startDate.toLocaleString()}</Text>
        )}
        {item.endDate && (
          <Text style={styles.endDate}>Fin: {item.endDate.toLocaleString()}</Text>
        )}
      </View>
      <View style={styles.actionContainer}>
        <TouchableOpacity onPress={() => handleEditTitleAndDescription(item)}>
          <FontAwesome5 name="edit" size={20} color="blue" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleEditStatus(item)}>
          {renderStatusIcon(item.status)}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
          <FontAwesome5 name="trash-alt" size={20} color="red" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Completadas</Text>
      <FlatList
        data={completedTasks}
        renderItem={({ item }) => (
          <TaskItem item={item} />
        )}
        keyExtractor={(item) => item.id}
      />

      <Text style={styles.sectionTitle}>En Proceso</Text>
      <FlatList
        data={inProgressTasks}
        renderItem={({ item }) => (
          <TaskItem item={item} />
        )}
        keyExtractor={(item) => item.id}
      />

      <Text style={styles.sectionTitle}>No Completadas</Text>
      <FlatList
        data={notCompletedTasks}
        renderItem={({ item }) => (
          <TaskItem item={item} />
        )}
        keyExtractor={(item) => item.id}
      />

      {renderEditModal()}
      {renderStatusModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  taskItem: {
    backgroundColor: "#fff",
    marginBottom: 10,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderRadius: 20,
  },
  taskInfo: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    color: "#555",
  },
  createdAt: {
    fontSize: 14,
    color: "#999",
  },
  startDate: {
    fontSize: 14,
    color: "#999",
  },
  endDate: {
    fontSize: 14,
    color: "#999",
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginLeft: 10,
  },
  buttonContainer: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "#007bff", // Color azul, puedes cambiarlo según tu preferencia
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  statusOption: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    width: "100%",
  },
  selectedStatusOption: {
    backgroundColor: "#e0e0e0",
  },
});

export default TaskList;
