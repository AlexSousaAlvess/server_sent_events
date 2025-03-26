"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const authApi = axios.create({
  baseURL: "http://localhost:8089/auth",
});

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "OPERADOR",
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await authApi.post("/register", form);
      localStorage.setItem("token", data.token);
      toast.success("Usuário registrado com sucesso!", {
        onClose: () => router.push("/"),
      });
    } catch (err) {
      console.error(err);
      toast.error("Erro ao registrar usuário.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Criar Conta</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Nome</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Senha</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Perfil</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="OPERADOR">Operador</option>
            <option value="SUPERVISOR">Supervisor</option>
            <option value="GERENTE">Gerente</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        >
          Registrar
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}