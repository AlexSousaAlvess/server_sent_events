"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { personApi } from "@/lib/api";
import { ToastContainer, toast } from "react-toastify";

const schema = z.object({
  firstName: z.string().min(2, "Nome precisa ter no mínimo 2 caracteres"),
  lastName: z.string().min(2, "Sobrenome precisa ter no mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
});

type FormData = z.infer<typeof schema>;

export default function CreatePersonPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await personApi.post("/person", data);
      toast.success("Pessoa cadastrada com sucesso!");
      reset();
    } catch (err) {
      console.error("Erro ao cadastrar:", err);
      toast.error("Erro ao cadastrar pessoa");
    }
  };

  return (
    <main className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Cadastrar Pessoa</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
          <input
            {...register("firstName")}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:outline-none"
            placeholder="Digite o nome"
          />
          {errors.firstName && (
            <p className="text-red-600 text-sm mt-1">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sobrenome</label>
          <input
            {...register("lastName")}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:outline-none"
            placeholder="Digite o sobrenome"
          />
          {errors.lastName && (
            <p className="text-red-600 text-sm mt-1">{errors.lastName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            {...register("email")}
            type="email"
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:outline-none"
            placeholder="Digite o email"
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          {isSubmitting ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>

      <ToastContainer />
    </main>
  );
}
