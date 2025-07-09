import TaskModel from '../models/taskModel.js';

const taskManager = new TaskModel();

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
    return 'El campo debe ser booleano';
  }
  return null;
};

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await taskManager.getAll();
    res.json(tasks);
  } catch (err) {
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
    const created = await taskManager.create(newTask);
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
      return res.status(400).json({ error: 'El campo es obligatorio' });
    }

    if (typeof completed !== 'boolean') {
      return res.status(400).json({ error: 'El campo debe ser booleano' });
    }

    const updated = await taskManager.update(id, { completed });
    if (!updated) {
      return res.status(404).json({ error: 'La tarea no fue encontrada' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await taskManager.delete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'La tarea no fue encontrada' });
    }
    res.status(200).json({ message: 'Tarea eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const getSummary = async (req, res) => {
  try {
    const summary = await taskManager.getSummary();
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

