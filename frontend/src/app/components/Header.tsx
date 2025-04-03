"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import Image from "next/image";
import { IoNotifications } from "react-icons/io5";
import NotificationModal from "./NotificationModal";
import { jwtDecode } from "jwt-decode";
import { notificationApi } from "@/lib/api";

interface JwtPayload {
  sub: string; // email
  role: "CLIENTE" | "OPERADOR" | "SUPERVISOR" | "GERENTE";
  exp: number;
}

interface INotification {
  id: number;
  type: string;
  content: string;
  createdAt: string;
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<JwtPayload | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [role, setRole] = useState<JwtPayload["role"] | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadUser = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("Sem token");
    }
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      setRole(decoded.role);
    } catch (err) {
      console.error("Token inválido");
    }
  };

  useEffect(() => {
    loadUser();

    notificationApi.unread().then(({ data }) => {
      const arr = data.filter((d) => {
        if (d.type === role) {
          return d;
        }
      });
      setUnreadCount(arr?.length);
    });
  }, [loadUser, role]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        // Verifica expiração
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          setUser(null);
        } else {
          setUser(decoded);
        }
      } catch (err) {
        console.error("Token inválido");
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [pathname]);

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (!user) return null;

  return (
    <>
      <header className="bg-gray-800 text-white p-4 shadow-md flex justify-between items-center">
        <h1
          className="text-xl font-bold cursor-pointer"
          onClick={() => router.push("/")}
        >
          Notifica App
        </h1>

        <nav className="flex items-center gap-4 relative">
          <button
            onClick={() => router.push("/")}
            className={`hover:underline ${pathname === "/" ? "font-bold" : ""}`}
          >
            Início
          </button>

          {/* Mostrar botão de cadastro de produto para perfis permitidos */}
          {["OPERADOR", "SUPERVISOR", "GERENTE"].includes(user.role) && (
            <button
              onClick={() => router.push("/create-product")}
              className={`hover:underline ${
                pathname === "/create-product" ? "font-bold" : ""
              }`}
            >
              Cadastrar Produto
            </button>
          )}

          {/* 🔔 Botão do sino */}
          <button onClick={() => setIsModalOpen(true)} className="relative">
            <IoNotifications fontSize={30} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white rounded-full px-1 text-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown de perfil */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="hover:underline"
            >
              {user.role}
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 bg-white text-black rounded-md shadow-md p-2 z-10 min-w-[150px]">
                <p className="text-sm mb-2">{user.sub}</p>
                <button
                  onClick={logout}
                  className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        </nav>
      </header>
      {isModalOpen && (
        <NotificationModal onClose={() => setIsModalOpen(false)} role={role} />
      )}
    </>
  );
}
