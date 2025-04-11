/* eslint-disable no-console */
import { useCallback, useEffect, useState } from "react";

import API from "@/api/api";
import Navbar from "@/components/NavBar";
import NewTaskModal from "@/components/NewTaskModal";
import TaskCard from "@/components/TaskCard";
import TaskFilters from "@/components/TasksFilter";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: "pendiente" | "en progreso" | "completada";
  dueDate: string;
}

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userName, setUserName] = useState("Usuario");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterDueDate, setFilterDueDate] = useState("");

  const [filterStatus, setFilterStatus] = useState<
    "todas" | "pendiente" | "en progreso" | "completada"
  >("todas");
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("token");

  const fetchUser = async () => {
    try {
      const res = await API.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserName(res.data.name);
    } catch (err) {
      console.error("Error al obtener usuario:", err);
    }
  };

  const fetchTasks = useCallback(
    async (
      search: string = "",
      status: "todas" | "pendiente" | "en progreso" | "completada" = "todas",
      dueDate: string = "",
    ) => {
      try {
        const params = new URLSearchParams();

        if (search) {
          params.append("search", search);
        }
        if (status !== "todas") {
          params.append("status", status);
        }
        if (dueDate) {
          params.append("dueDate", dueDate);
        }

        const res = await API.get(`/tasks?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTasks(res.data || []);
      } catch (err) {
        console.error("Error al obtener tareas:", err);
      }
    },
    [token],
  );

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await API.patch(
        `/tasks/${id}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      fetchTasks(searchQuery, filterStatus);
    } catch (err) {
      console.error("Error al cambiar estado de tarea:", err);
    }
  };

  const handleCreateTask = async (taskData: Omit<Task, "_id">) => {
    try {
      await API.post("/tasks", taskData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks(searchQuery, filterStatus);
    } catch (err) {
      console.error("Error al crear tarea:", err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await API.delete(`/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (err) {
      console.error("Error al eliminar tarea:", err);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    fetchTasks(value, filterStatus);
  };

  const handleFilterChange = (
    status: "todas" | "pendiente" | "en progreso" | "completada",
  ) => {
    setFilterStatus(status);
    fetchTasks(searchQuery, status, filterDueDate);
  };

  const handleDueDateChange = (value: string) => {
    setFilterDueDate(value);
    fetchTasks(searchQuery, filterStatus, value);
  };

  useEffect(() => {
    fetchUser();
    fetchTasks();
  }, []);

  return (
    <div className="flex flex-col gap-4 min-h-dvh dark text-foreground bg-background">
      <Navbar userName={userName} onNewTask={() => setIsModalOpen(true)} />
      <div className="flex flex-col gap-2 mx-12">
        <TaskFilters
          filterDueDate={filterDueDate}
          filterStatus={filterStatus}
          searchQuery={searchQuery}
          setFilterDueDate={handleDueDateChange}
          setFilterStatus={handleFilterChange}
          setSearchQuery={handleSearchChange}
        />
        <NewTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateTask}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
