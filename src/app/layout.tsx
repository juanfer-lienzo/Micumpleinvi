import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Invitación de Cumpleaños",
  description: "Estás invitado a la fiesta de cumpleaños. ¡Confirma tu asistencia!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
