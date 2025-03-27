"use client";

import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState, useCallback } from "react";
import "react-toastify/dist/ReactToastify.css";
import { personApi, notificationApi } from "@/lib/api";
import { useRouter } from "next/navigation";

interface IPerson {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface INotification {
  id: number;
  type: string;
  content: string;
  createdAt: string;
}

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const [personData, setPersonData] = useState<IPerson[]>([]);

  const loadPersons = useCallback(async () => {
    try {
      const { data } = await personApi.get<IPerson[]>("/person");
      setPersonData(data);
    } catch (err) {
      console.error("Erro ao carregar pessoas:", err);
    }
  }, []);

  const handleMarkAsRead = async (
    notificationId: number,
    closeToast: () => void
  ) => {
    try {
      await notificationApi.patch(`/notifications/${notificationId}/read`);
      closeToast();
      loadPersons();
    } catch (err) {
      console.error("Erro ao marcar notificação como lida:", err);
    }
  };

  const renderToast = (text: string, notificationId: number) => {
    toast(
      ({ closeToast }) => (
        <div className="text-sm">
          <p className="text-gray-800">{text}</p>
          <button
            onClick={() => handleMarkAsRead(notificationId, closeToast)}
            className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Confirmar
          </button>
        </div>
      ),
      { autoClose: false }
    );
  };

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const { data } = await notificationApi.get<INotification[]>("/notifications/unread");
        data.forEach((n) => renderToast(n.content, n.id));
      } catch (err) {
        console.error("Erro ao buscar notificações:", err);
      }
    };

    fetchUnread();

    const eventSource = new EventSource("http://localhost:8088/notifications/subscribe");

    eventSource.addEventListener("new-notification", (event) => {
      const data = JSON.parse(event.data) as INotification;
      renderToast(data.content, data.id);
    });

    eventSource.onerror = (err) => {
      console.error("Erro SSE:", err);
      eventSource.close();
    };

    loadPersons();

    return () => {
      eventSource.close();
    };
  }, [loadPersons]);

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Notificações de novas pessoas</h1>
      <ToastContainer />

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Lista de Pessoas Cadastradas:</h2>
        <ul className="space-y-3">
          {personData.map((person) => (
            <li
              key={person.id}
              className="border border-gray-300 rounded-md p-4 bg-white shadow-sm"
            >
              <p className="text-gray-900 font-medium">
                {person.firstName} {person.lastName}
              </p>
              <p className="text-gray-500 text-sm">{person.email}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
