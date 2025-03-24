"use client";

import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";

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
  const [notificationsLoaded, setNotificationsLoaded] = useState(false);

  useEffect(() => {
    // 1. Buscar notificações salvas no backend
    fetch("http://localhost:8087/notifications")
      .then((res) => res.json())
      .then((data: INotification[]) => {
        data.forEach((notification) => {
          toast(notification.content);
        });
        setNotificationsLoaded(true);
      })
      .catch((err) => {
        console.error("Erro ao carregar notificações:", err);
      });

    // 2. Iniciar conexão SSE para eventos em tempo real
    const eventSource = new EventSource(
      "http://localhost:8087/person/subscribe"
    );

    eventSource.addEventListener("new-person", (event) => {
      const data = JSON.parse(event.data);
      console.log("Nova pessoa adicionada:", data);
      toast("Nova pessoa cadastrada: " + data.firstName);
    });

    eventSource.onerror = (err) => {
      console.error("Erro SSE:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <>
      <h3>Notificações de novas pessoas</h3>
      <ToastContainer />
    </>
  );
}
