"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub: string; // email
  role: "OPERADOR" | "SUPERVISOR" | "GERENTE";
  exp: number;
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<JwtPayload | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        setUser(decoded);
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

        {(user.role === "SUPERVISOR" || user.role === "GERENTE") && (
          <button
            onClick={() => router.push("/create-person")}
            className={`hover:underline ${pathname === "/create-person" ? "font-bold" : ""}`}
          >
            Cadastrar Pessoa
          </button>
        )}

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
  );
}
