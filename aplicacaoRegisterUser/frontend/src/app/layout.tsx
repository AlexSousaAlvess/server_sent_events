import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "Gestão de Pessoas",
  description: "Cadastro e notificações em tempo real",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-100 text-gray-900">
        <header
          style={{
            padding: "1rem",
            background: "#20232a",
            color: "white",
            display: "flex",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <h3 style={{ margin: 0 }}>📋 Pessoas</h3>
          <nav style={{ display: "flex", gap: "1rem" }}>
            <Link href="/">🏠 Home</Link>
            <Link href="/create-person">➕ Cadastrar Pessoa</Link>
          </nav>
        </header>

        <main style={{ padding: "1rem" }}>{children}</main>
      </body>
    </html>
  );
}
