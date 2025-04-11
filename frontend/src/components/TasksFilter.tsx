import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";

interface Props {
  filterStatus: "todas" | "pendiente" | "en progreso" | "completada";
  setFilterStatus: (
    value: "todas" | "pendiente" | "en progreso" | "completada"
  ) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filterDueDate: string;
  setFilterDueDate: (value: string) => void;
}

const TaskFilters = ({
  filterStatus,
  setFilterStatus,
  searchQuery,
  setSearchQuery,
  filterDueDate,
  setFilterDueDate,
}: Props) => {
  const statusOptions: (
    | "todas"
    | "pendiente"
    | "en progreso"
    | "completada"
  )[] = ["todas", "pendiente", "en progreso", "completada"];

  return (
    <div className="mb-4 flex items-center gap-4 justify-center">
      <Input
        className="max-w-xs"
        label="Buscar tareas"
        placeholder="Ingrese término de búsqueda"
        type="text"
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <Select
        className="max-w-xs"
        label="Filtrar por estado"
        selectedKeys={[filterStatus]}
        onSelectionChange={(keys) => {
          const selectedStatus = Array.from(keys)[0] as
            | "todas"
            | "pendiente"
            | "en progreso"
            | "completada"
            | undefined;

          if (selectedStatus) {
            setFilterStatus(selectedStatus);
          }
        }}
      >
        {statusOptions.map((status) => (
          <SelectItem key={status}>{status}</SelectItem>
        ))}
      </Select>
      <Input
        className="max-w-xs"
        label="Filtrar por fecha"
        type="date"
        value={filterDueDate}
        onValueChange={setFilterDueDate}
      />
    </div>
  );
};

export default TaskFilters;
