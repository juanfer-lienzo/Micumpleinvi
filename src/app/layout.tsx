import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nakama Party - Invitación de Cumpleaños",
  description: "Estás invitado a la fiesta de cumpleaños temática One Piece. ¡Únete a la tripulación!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Pirata+One&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
