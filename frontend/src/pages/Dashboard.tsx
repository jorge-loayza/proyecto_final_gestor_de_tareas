/* eslint-disable no-console */
import { useEffect, useState } from 'react';

import API from '@/api/api';
import Navbar from '@/components/NavBar';
import NewTaskModal from '@/components/NewTaskModal';
import TaskCard from '@/components/TaskCard';
import TaskFilters from '@/components/TasksFilter';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'pendiente' | 'en progreso' | 'completada';
  dueDate: string;
}

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userName, setUserName] = useState('Usuario');
  const [filter, setFilter] = useState('todas');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const token = localStorage.getItem('token');

  const fetchUser = async () => {
    try {
      const res = await API.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserName(res.data.name);
    } catch (err) {
      console.error('Error al obtener usuario:', err);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTasks(res.data || []);
    } catch (err) {
      console.error('Error al obtener tareas:', err);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await API.patch(
        `/tasks/${id}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      fetchTasks();
    } catch (err) {
      console.error('Error al cambiar estado de tarea:', err);
    }
  };

  const handleCreateTask = async (taskData: Omit<Task, '_id'>) => {
    try {
      await API.post('/tasks', taskData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (err) {
      console.error('Error al crear tarea:', err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await API.delete(`/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (err) {
      console.error('Error al eliminar tarea:', err);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchTasks();
  }, []);

  const filteredTasks =
    filter === 'todas' ? tasks : tasks.filter((t) => t.status === filter);

  return (
    <div className="p-4">
      <Navbar userName={userName} onNewTask={() => setIsModalOpen(true)} />
      <TaskFilters filter={filter} setFilter={setFilter} />
      <NewTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateTask}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onDelete={handleDeleteTask}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
