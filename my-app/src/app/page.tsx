"use client";

import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";

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
  const [personData, setPersonData] = useState<IPerson[]>([]);

  useEffect(() => {
    // 1. Buscar notificações não lidas
    fetch("http://localhost:8087/notifications/unread")
      .then((res) => res.json())
      .then((data: INotification[]) => {
        data.forEach((notification) => {
          toast(
            ({ closeToast }) => (
              <div>
                {notification.content}
                <br />
                <button
                  onClick={() => {
                    fetch(
                      `http://localhost:8087/notifications/${notification.id}/read`,
                      {
                        method: "PATCH",
                      }
                    ).then(() => {
                      closeToast();
                      // Atualizar lista de pessoas após confirmação
                      loadPersons();
                    });
                  }}
                  style={{
                    marginTop: "8px",
                    background: "#4caf50",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Confirmar
                </button>
              </div>
            ),
            { autoClose: false }
          );
        });
      });

    // 2. SSE em tempo real
    const eventSource = new EventSource(
      "http://localhost:8087/person/subscribe"
    );

    eventSource.addEventListener("new-person", (event) => {
      const data = JSON.parse(event.data);
      toast(
        ({ closeToast }) => (
          <div>
            Nova pessoa cadastrada: {data.firstName}
            <br />
            <button
              onClick={() => {
                fetch("http://localhost:8087/notifications/unread")
                  .then((res) => res.json())
                  .then((notifications: INotification[]) => {
                    const last = notifications[notifications.length - 1];
                    if (last) {
                      fetch(
                        `http://localhost:8087/notifications/${last.id}/read`,
                        {
                          method: "PATCH",
                        }
                      ).then(() => {
                        closeToast();
                        loadPersons();
                      });
                    }
                  });
              }}
              style={{
                marginTop: "8px",
                background: "#4caf50",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Confirmar
            </button>
          </div>
        ),
        { autoClose: false }
      );
    });

    eventSource.onerror = (err) => {
      console.error("Erro SSE:", err);
      eventSource.close();
    };

    // 3. Buscar lista de pessoas cadastradas
    loadPersons();

    return () => {
      eventSource.close();
    };
  }, []);

  const loadPersons = () => {
    fetch("http://localhost:8087/person")
      .then((res) => res.json())
      .then((data: IPerson[]) => {
        setPersonData(data);
      });
  };

  return (
    <>
      <h3>Notificações de novas pessoas</h3>
      <ToastContainer />

      <h4 style={{ marginTop: "2rem" }}>Lista de Pessoas Cadastradas:</h4>
      <ul>
        {personData.map((person) => (
          <li key={person.id}>
            {person.firstName} {person.lastName} - {person.email}
          </li>
        ))}
      </ul>
    </>
  );
}
