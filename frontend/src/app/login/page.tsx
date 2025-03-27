"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const authApi = axios.create({
  baseURL: "http://localhost:8089/auth",
});

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await authApi.post("/login", form);
      localStorage.setItem("token", data.token);
      toast.success("Login realizado com sucesso!", {
        onClose: () => router.push("/"),
      });
    } catch (err) {
      console.error(err);
      toast.error("Credenciais inválidas.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Entrar</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        >
          Entrar
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}
