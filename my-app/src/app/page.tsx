"use client";

import "react-toastify/dist/ReactToastify.css";

import { ToastContainer, toast } from "react-toastify";

import { useEffect } from "react";

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
                      closeToast(); // Fecha o toast manualmente
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
      })
      .catch((err) => {
        console.error("Erro ao carregar notificações:", err);
      });

    // 2. SSE: Novas pessoas em tempo real
    const eventSource = new EventSource(
      "http://localhost:8087/person/subscribe"
    );

    eventSource.addEventListener("new-person", (event) => {
      const data = JSON.parse(event.data);

      // Exibe o toast com botão de confirmar
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
