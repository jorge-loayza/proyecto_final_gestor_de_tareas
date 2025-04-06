import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { MoreVertical } from "lucide-react";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: "pendiente" | "en progreso" | "completada";
  dueDate: string;
}

interface Props {
  task: Task;
  onStatusChange: (id: string, newStatus: string) => void;
  onDelete: (id: string) => void;
}

const TaskCard = ({ task, onStatusChange, onDelete }: Props) => {
  const statusColors: Record<
    string,
    | "warning"
    | "success"
    | "primary"
    | "default"
    | "secondary"
    | "danger"
    | undefined
  > = {
    pendiente: "warning",
    "en progreso": "primary",
    completada: "success",
  };

  const availableStatuses = [
    "pendiente",
    "en progreso",
    "completada",
    "delete",
  ].filter((s) => s !== task.status);

  return (
    <Card className="w-full" shadow="sm">
      <CardHeader className="justify-between">
        <div className="font-bold text-lg">{task.title}</div>
        <Dropdown>
          <DropdownTrigger>
            <Button isIconOnly size="sm" variant="light">
              <MoreVertical size={20} />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Opciones de tarea">
            {availableStatuses.map((status) => {
              if (status !== "delete") {
                return (
                  <DropdownItem
                    key={status}
                    onPress={() => onStatusChange(task._id, status)}
                  >
                    Cambiar a &quot;{status}&quot;
                  </DropdownItem>
                );
              } else {
                return (
                  <DropdownItem
                    key={"delete"}
                    className="text-danger"
                    color="danger"
                    onPress={() => onDelete(task._id)}
                  >
                    Eliminar tarea
                  </DropdownItem>
                );
              }
            })}

            {/* <DropdownItem
              key={'delete'}
              className="text-danger"
              color="danger"
              onPress={() => onDelete(task._id)}
            >
              Eliminar tarea
            </DropdownItem> */}
          </DropdownMenu>
        </Dropdown>
      </CardHeader>
      <CardBody className="text-sm text-gray-600">{task.description}</CardBody>
      <CardFooter className="flex justify-between items-center text-sm text-gray-500">
        <Chip color={statusColors[task.status]}>{task.status}</Chip>
        <span>{new Date(task.dueDate).toLocaleDateString()}</span>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
