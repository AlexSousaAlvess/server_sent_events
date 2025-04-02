"use client";

import "react-toastify/dist/ReactToastify.css";

import { ToastContainer, toast } from "react-toastify";
import { notificationApi, productApi, purchaseApi } from "@/lib/api";
import { useCallback, useEffect, useState } from "react";

import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

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

interface INotification {
  id: number;
  type: string;
  content: string;
  createdAt: string;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [role, setRole] = useState<JwtPayload["role"] | null>(null);
  const router = useRouter();

  const loadUser = () => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      setRole(decoded.role);
    } catch (err) {
      console.error("Token inválido");
      localStorage.removeItem("token");
      router.push("/login");
    }
  };

  const loadProducts = useCallback(async () => {
    try {
      const { data } = await productApi.list();
      setProducts(data);
    } catch (err) {
      toast.error("Erro ao carregar produtos");
    }
  }, []);

  const handleBuy = async (id: number) => {
    try {
      await purchaseApi.buy(id);
      toast.success("Compra realizada com sucesso!");
    } catch (err) {
      toast.error("Erro ao realizar compra");
    }
  };

  const handleMarkAsRead = async (id: number, closeToast: () => void) => {
    try {
      await notificationApi.markRead(id);
      closeToast();
    } catch {
      toast.error("Erro ao confirmar notificação");
    }
  };

  const showNotification = (content: string, id: number) => {
    toast(
      ({ closeToast }) => (
        <div className="text-sm">
          <p className="text-gray-800">{content}</p>
          <button
            onClick={() => handleMarkAsRead(id, closeToast)}
            className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Confirmar
          </button>
        </div>
      ),
      { autoClose: false }
    );
  };

  const setupSSE = () => {
    const eventSource = new EventSource(
      "http://localhost:8080/notifications/subscribe"
    );

    eventSource.addEventListener("new-notification", (event) => {
      const data: INotification = JSON.parse(event.data);
      if (data.type === role) {
        showNotification(data.content, data.id);
      }
    });

    eventSource.onerror = (err) => {
      console.error("Erro no SSE:", err);
      eventSource.close();
    };

    return eventSource;
  };

  useEffect(() => {
    loadUser();
    loadProducts();

    notificationApi.unread().then(({ data }) => {
      data.forEach((n: INotification) => {
        if (n.type === role) {
          showNotification(n.content, n.id);
        }
      });
    });

    const eventSource = setupSSE();
    return () => eventSource.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadProducts, role]);

  if (!role) return null;

  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Produtos Disponíveis</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((product) => (
          <li key={product.id} className="border rounded-md p-4 shadow-sm">
            <h2 className="font-semibold text-lg">{product.name}</h2>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-blue-700 font-bold">
              R$ {product.price.toFixed(2)}
            </p>
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
      {/* <ToastContainer /> */}
    </main>
  );
}
