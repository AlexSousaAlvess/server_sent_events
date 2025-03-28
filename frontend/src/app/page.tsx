"use client";

import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { productApi, purchaseApi, notificationApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface JwtPayload {
  sub: string;
  role: "CLIENTE" | "OPERADOR" | "SUPERVISOR" | "GERENTE";
  exp: number;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
    else {
      const decoded = jwtDecode<JwtPayload>(token);
      setRole(decoded.role);
    }
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const { data } = await productApi.list();
    setProducts(data);
  };

  const handleBuy = async (id: number) => {
    try {
      await purchaseApi.buy(id);
      toast.success("Compra realizada com sucesso!");
    } catch (err) {
      toast.error("Erro ao realizar compra");
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Produtos Disponíveis</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((product) => (
          <li
            key={product.id}
            className="border rounded-md p-4 shadow-sm bg-white"
          >
            <h2 className="font-semibold text-lg">{product.name}</h2>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-blue-700 font-bold">R$ {product.price.toFixed(2)}</p>
            {role === "CLIENTE" && (
              <button
                onClick={() => handleBuy(product.id)}
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Comprar
              </button>
            )}
          </li>
        ))}
      </ul>
      <ToastContainer />
    </main>
  );
}