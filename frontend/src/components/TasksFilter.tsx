import { Select, SelectItem } from "@heroui/select";

interface Props {
  filter: string;
  setFilter: (value: string) => void;
}

const TaskFilters = ({ filter, setFilter }: Props) => {
  const statusOptions = ["todas", "pendiente", "en progreso", "completada"];

  return (
    <div className="mb-4 max-w-xs">
      <Select
        label="Filtrar por estado"
        selectedKeys={[filter]}
        onChange={(e) => setFilter(e.target.value)}
      >
        {statusOptions.map((status) => (
          <SelectItem key={status}>{status}</SelectItem>
        ))}
      </Select>
    </div>
  );
};

export default TaskFilters;
