import { createStackNavigator } from '@react-navigation/stack';
import Home from './Home';
import AddTaskScreen from './AddTaskScreen';

const Stack = createStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="AddTask" component={AddTaskScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;

