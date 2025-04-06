import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Select, SelectItem } from "@heroui/select";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (task: any) => void;
}

const statusOptions = ["pendiente", "en progreso", "completada"];

const NewTaskModal = ({ isOpen, onClose, onCreate }: Props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pendiente");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = () => {
    onCreate({ title, description, status, dueDate });
    onClose();
    setTitle("");
    setDescription("");
    setStatus("pendiente");
    setDueDate("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Crear Nueva Tarea</ModalHeader>
        <ModalBody>
          <Input
            label="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            label="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Select
            label="Estado"
            selectedKeys={[status]}
            onChange={(e) => setStatus(e.target.value)}
          >
            {statusOptions.map((s) => (
              <SelectItem key={s}>{s}</SelectItem>
            ))}
          </Select>
          <Input
            label="Fecha de entrega"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Cancelar
          </Button>
          <Button color="primary" onPress={handleSubmit}>
            Crear
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NewTaskModal;
