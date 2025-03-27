import "./globals.css";
import Header from "./components/Header"; 

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
        <Header /> {/* Dinâmico com autenticação */}
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
