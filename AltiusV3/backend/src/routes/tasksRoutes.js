const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const {
  getTasksByStudent,
  createTask,
  updateTask,
  deleteTask,
  getTaskById,
  getPendingTasksByTeacher,
  getTeacherStats
} = require('../services/tasksMongo');

// Get tasks for a student
router.get('/student/:studentId', async (req, res) => {
  try {
    const tasks = await getTasksByStudent(req.params.studentId);
    res.json(tasks);
  } catch (error) {
    console.error('Error getting student tasks:', error);
    res.status(500).json({ error: 'Error getting tasks' });
  }
});

// Create new task
router.post('/', async (req, res) => {
  try {
    const task = await createTask(req.body);
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Error creating task' });
  }
});

// Update task
router.put('/:id', async (req, res) => {
  try {
    const result = await updateTask(req.params.id, req.body);
    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Error updating task' });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const result = await deleteTask(req.params.id);
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Error deleting task' });
  }
});

// Get task by ID
router.get('/:id', async (req, res) => {
  try {
    const task = await getTaskById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    console.error('Error getting task:', error);
    res.status(500).json({ error: 'Error getting task' });
  }
});

// Submit task
router.post('/:id/submit', async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await getTaskById(taskId);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const update = {
      hasSubmission: true,
      submissionDate: new Date(),
      submission: req.body
    };

    await updateTask(taskId, update);
    res.json({ message: 'Task submitted successfully' });
  } catch (error) {
    console.error('Error submitting task:', error);
    res.status(500).json({ error: 'Error submitting task' });
  }
});

// Get pending tasks for teacher
router.get('/teacher/:teacherId/pending', async (req, res) => {
  try {
    const tasks = await getPendingTasksByTeacher(req.params.teacherId);
    res.json(tasks);
  } catch (error) {
    console.error('Error getting pending tasks:', error);
    res.status(500).json({ error: 'Error getting pending tasks' });
  }
});

// Get teacher statistics
router.get('/teacher/:teacherId/stats', async (req, res) => {
  try {
    const stats = await getTeacherStats(req.params.teacherId);
    res.json(stats);
  } catch (error) {
    console.error('Error getting teacher stats:', error);
    res.status(500).json({ error: 'Error getting teacher stats' });
  }
});

module.exports = router;