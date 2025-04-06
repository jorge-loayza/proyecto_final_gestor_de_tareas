/* eslint-disable no-console */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

import API from "../api/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/auth/login", { email, password });

      login(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Credenciales inválidas");
      console.log(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="flex justify-center">
          <h1 className="text-2xl font-bold text-center">Iniciar Sesión</h1>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardBody className="space-y-4">
            <Input
              isRequired
              label="Correo electrónico"
              placeholder="tucorreo@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              isRequired
              label="Contraseña"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </CardBody>

          <CardFooter className="flex justify-end">
            <Button fullWidth color="primary" type="submit">
              Ingresar
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
