import { Request, Response } from 'express';
import { Task } from '../models/Task';
import { AuthRequest } from '../types/express';

export const createTask = async (req: AuthRequest, res: Response) => {
  const { title, description, status, dueDate } = req.body;
  try {
    const task = new Task({
      title,
      description,
      status,
      dueDate,
      user: req.userId,
    });
    await task.save();
    res.status(201).json({ message: 'Tarea creada exitosamente', task });
  } catch (err) {
    res.status(500).json({ message: 'Error al crear tarea' });
  }
};

export const getTasks = async (req: AuthRequest, res: Response) => {
  const { status, search, dueDate } = req.query;
  const query: any = { user: req.userId };

  if (status) query.status = status;
  if (search) {
    const regex = new RegExp(search.toString(), 'i');
    query.$or = [{ title: regex }, { description: regex }];
  }

  if (dueDate) {
    query.dueDate = new Date(dueDate as string);
  }

  try {
    const tasks = await Task.find(query).sort({ dueDate: 1 });
    res.json(tasks);
  } catch {
    res.status(500).json({ message: 'Error al obtener tareas' });
  }
};

export const getTaskById = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.userId });
    if (!task) {
      res.status(404).json({ message: 'Tarea no encontrada' });
      return;
    }
    res.json(task);
  } catch {
    res.status(500).json({ message: 'Error al obtener la tarea' });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, status, dueDate } = req.body;

    const task = await Task.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!task) {
      res.status(404).json({ message: 'Tarea no encontrada' });
      return;
    }

    if (title) {
      task.title = title;
    }

    if (description) {
      task.description = description;
    }

    if (dueDate) {
      task.dueDate = dueDate;
    }

    const currentStatus = task.status;

    if (status) {
      if (
        (status === 'en progreso' && currentStatus !== 'pendiente') ||
        ((currentStatus === 'en progreso' || currentStatus === 'completada') &&
          status === 'pendiente') ||
        (currentStatus === 'completada' && status !== 'completada') ||
        (status === 'completada' && currentStatus !== 'en progreso')
      ) {
        res
          .status(400)
          .json({ message: `No se puede cambiar la tarea a ${status}` });
        return;
      }

      task.status = status;
    }

    const result = await task.save();

    res
      .status(200)
      .json({ message: 'Tarea actualizada exitosamente', task: result });

  } catch(error) {
console.log(error);

    res.status(500).json({ message: 'Error al actualizar la tarea' });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.userId,
    });
    if (!task) {
      res.status(404).json({ message: 'Tarea no encontrada' });
      return;
    }
    if (task.status !== 'completada') {
      res.status(400).json({
        message: 'Solo se puede eliminar la tarea si esta completada',
      });
      return;
    }
    await Task.deleteOne({ _id: task.id });

    res.json({ message: 'Tarea eliminada' });
  } catch {
    res.status(500).json({ message: 'Error al eliminar la tarea' });
  }
};
