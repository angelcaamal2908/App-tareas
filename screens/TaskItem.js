import React from "react";
import { View, Text, StyleSheet, TouchableHighlight } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';

const TaskItem = ({ item, handleEditTask, handleStatusSelectionForTask, handleDeleteTask, renderStatusIcon }) => {
  const { title, description, completed, status } = item;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.status}>{completed ? "Completada" : "Pendiente"}</Text>
      <View style={styles.actionContainer}>
        <TouchableHighlight onPress={() => handleEditTask(item)} underlayColor="#DDDDDD">
          <FontAwesome5 name="edit" size={20} color="blue" style={styles.icon} />
        </TouchableHighlight>
        <TouchableHighlight onPress={() => handleStatusSelectionForTask(item)} underlayColor="#DDDDDD">
          {renderStatusIcon(status)}
        </TouchableHighlight>
        <TouchableHighlight onPress={() => handleDeleteTask(item.id)} underlayColor="#DDDDDD">
          <FontAwesome5 name="trash-alt" size={20} color="red" style={styles.icon} />
        </TouchableHighlight>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc"
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
  description: {
    fontSize: 16,
    marginTop: 5,
  },
  status: {
    fontSize: 14,
    marginTop: 5,
    color: "#888",
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  icon: {
    marginLeft: 10,
  },
});

export default TaskItem;
