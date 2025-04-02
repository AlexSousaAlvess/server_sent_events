// components/NotificationModal.tsx
"use client";

import { useEffect, useState } from "react";

import { notificationApi } from "@/lib/api";

interface Notification {
  id: number;
  type: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export default function NotificationModal({
  onClose,
  role,
}: {
  onClose: () => void;
  role: string;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    notificationApi.unread().then(({ data }) => setNotifications(data));
  }, []);

  const markAsRead = async (id: number) => {
    await notificationApi.markRead(id);
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-blue-500 p-4 rounded shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Notificações</h2>
          <button onClick={onClose} className="text-red-500 font-bold">
            X
          </button>
        </div>

        {notifications.length === 0 ? (
          <p className="text-gray-500">Nenhuma nova notificação</p>
        ) : (
          <ul className="space-y-3 max-h-80 overflow-y-auto">
            {notifications.map((n) => (
              <li key={n.id} className="border bg-white p-2 rounded shadow-sm">
                <p className="text-sm text-gray-800">{n.content}</p>
                <button
                  onClick={() => markAsRead(n.id)}
                  className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Confirmar leitura
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
