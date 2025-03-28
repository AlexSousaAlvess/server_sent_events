"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import { authApi } from "@/lib/api";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub: string;
  role: string;
  exp: number;
}

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const router = useRouter();

  const handleChange = (e:any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      const { data } = await authApi.login(form);
      localStorage.setItem("token", data.token);
      const decoded = jwtDecode<JwtPayload>(data.token);
      toast.success(`Bem-vindo! Perfil: ${decoded?.role}`, {
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
        <input name="email" type="email" required onChange={handleChange} value={form.email} placeholder="Email" className="w-full p-2 border rounded-md" />
        <input name="password" type="password" required onChange={handleChange} value={form.password} placeholder="Senha" className="w-full p-2 border rounded-md" />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">Entrar</button>
      </form>
      <ToastContainer />
    </div>
  );
}
