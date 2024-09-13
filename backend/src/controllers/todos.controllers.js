import { database } from "../db/database.js";

export const getAllTodosCtrl = (req, res) => {
  const userId = req.user.id; // Obtener el ID del usuario autenticado

  // Filtrar las tareas que corresponden al usuario autenticado
  const userTodos = database.todos.filter((todo) => todo.owner === userId);

  // Enviar solo las tareas del usuario autenticado
  res.json({ todos: userTodos });
};

//ELIMINAR TAREAS
export const deleteTodosCtrl = (req, res) => {
  const { id } = req.params;

  // Encontrar la tarea
  const taskIndex = database.todos.findIndex((task) => task.id == id);
  if (taskIndex === -1) {
    return res.status(404).json({ message: "Tarea no encontrada" });
  }

  const task = database.todos[taskIndex];

  if (task.owner !== req.user.id) {
    return res
      .status(403)
      .json({ message: "No tienes permiso para eliminar esta tarea" });
  }

  database.todos.splice(taskIndex, 1);

  res.json({ message: "Tarea eliminada correctamente" });
};

export const updateTodosCtrl = (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  const task = database.todos.find((task) => task.id == id);

  console.log(task);

  if (!task) {
    return res.status(404).json({ message: "Tarea no encontrada" });
  }

  if (task.owner !== req.user.id) {
    return res
      .status(403)
      .json({ message: "No tienes permiso para editar esta tarea" });
  }

  task.title = title || task.title;
  task.completed = completed || task.completed;

  res.json({ message: "Tarea actualizada correctamente", task });
};
