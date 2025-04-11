import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";

import { useAuth } from "../context/AuthContext";

interface Props {
  userName: string;
  onNewTask: () => void;
}

const Navbar = ({ userName, onNewTask }: Props) => {
  const { logout } = useAuth();

  return (
    <NextUINavbar className="shadow-md">
      <NavbarContent justify="start">
        <NavbarItem className="font-semibold text-lg">
          Bienvenido, <strong>{userName}</strong>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button color="primary" onPress={onNewTask}>
            Nuevo Task
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button color="danger" variant="flat" onPress={logout}>
            Logout
          </Button>
        </NavbarItem>
      </NavbarContent>
    </NextUINavbar>
  );
};

export default Navbar;
