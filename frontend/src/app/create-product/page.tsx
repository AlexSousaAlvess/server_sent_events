"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { productApi } from "@/lib/api";
import { ToastContainer, toast } from "react-toastify";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

const schema = z.object({
  name: z.string().min(3),
  description: z.string().min(5),
  price: z.coerce.number().positive(),
});

type ProductForm = z.infer<typeof schema>;

export default function CreateProductPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");
  
    const decoded = jwtDecode<any>(token);
    const allowedRoles = ["OPERADOR", "SUPERVISOR", "GERENTE"];
  
    if (!allowedRoles.includes(decoded.role)) {
      router.push("/");
    }
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ProductForm) => {
    try {
      await productApi.create(data);
      toast.success("Produto cadastrado com sucesso!");
      reset();
    } catch {
      toast.error("Erro ao cadastrar produto");
    }
  };

  return (
    <main className="max-w-md mx-auto mt-10 p-6 rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">Cadastrar Produto</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm">Nome</label>
          <input {...register("name")} className="w-full p-2 border rounded" />
          {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm">Descrição</label>
          <input {...register("description")} className="w-full p-2 border rounded" />
          {errors.description && <p className="text-red-600 text-sm">{errors.description.message}</p>}
        </div>
        <div>
          <label className="block text-sm">Preço</label>
          <input
            type="number"
            step="0.01"
            {...register("price")}
            className="w-full p-2 border rounded"
          />
          {errors.price && <p className="text-red-600 text-sm">{errors.price.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          {isSubmitting ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
      <ToastContainer />
    </main>
  );
}