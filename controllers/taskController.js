import TaskModel from '../models/taskModel.js';

const validateTaskData = (task, isUpdate = false) => {
  if (!isUpdate) {
    if (task.id === undefined) return 'El id de la tarea es obligatorio';
  }
  if (task.priority !== undefined) {
    if (typeof task.priority !== 'number' || task.priority < 1 || task.priority > 5) {
      return 'La prioridad debe ser un número entre 1 y 5';
    }
  }
  if (task.completed !== undefined && typeof task.completed !== 'boolean') {
    return 'El campo "completed" debe ser booleano';
  }
  return null;
};

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await TaskModel.getAll();
    res.json(tasks);
  } catch {
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const createTask = async (req, res) => {
  try {
    const validationError = validateTaskData(req.body);
    if (validationError) return res.status(400).json({ error: validationError });

    const { id, title, description, completed = false, priority } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'El título y la descripción son obligatorios' });
    }

    const newTask = { id: Number(id), title, description, completed, priority };
    const created = await TaskModel.create(newTask);
    res.status(201).json(created);
  } catch (err) {
    if (err.message === 'El id de la tarea ya existe') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const updateTask = async (req, res) => {
  try {
    const id = req.params.id;
    const { completed } = req.body;

    if (completed === undefined) {
      return res.status(400).json({ error: 'El campo "completed" es obligatorio' });
    }

    if (typeof completed !== 'boolean') {
      return res.status(400).json({ error: 'El campo "completed" debe ser booleano' });
    }

    const updated = await TaskModel.update(id, { completed });
    if (!updated) {
      return res.status(404).json({ error: 'La tarea no fue encontrada' });
    }

    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await TaskModel.delete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'La tarea no fue encontrada' });
    }
    res.status(200).json({ message: 'Tarea eliminada correctamente' });
  } catch {
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const getSummary = async (req, res) => {
  try {
    const summary = await TaskModel.getSummary();
    res.json(summary);
  } catch {
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const searchByTitle = async (req, res) => {
  try {
    const { title } = req.query;

    if (!title) {
      return res.status(400).json({ error: 'Falta el parámetro "title"' });
    }

    const result = await TaskModel.searchByTitle(title);
    res.json(result);
  } catch {
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
