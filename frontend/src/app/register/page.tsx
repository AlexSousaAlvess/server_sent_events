"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import { authApi } from "@/lib/api";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const router = useRouter();

  const handleChange = (e:any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      const payload = { ...form, role: "CLIENTE" };
      const { data } = await authApi.register(payload);
      localStorage.setItem("token", data.token);
      toast.success("Conta criada com sucesso!", {
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
        <input name="name" type="text" required onChange={handleChange} value={form.name} placeholder="Nome" className="w-full p-2 border rounded-md" />
        <input name="email" type="email" required onChange={handleChange} value={form.email} placeholder="Email" className="w-full p-2 border rounded-md" />
        <input name="password" type="password" required onChange={handleChange} value={form.password} placeholder="Senha" className="w-full p-2 border rounded-md" />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">Registrar</button>
      </form>
      <ToastContainer />
    </div>
  );
}