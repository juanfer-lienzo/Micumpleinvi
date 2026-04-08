"use client";

import { useState } from "react";

interface Guest {
  nombre: string;
}

export default function Home() {
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [acompanantes, setAcompanantes] = useState<Guest[]>([]);
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [respuesta, setRespuesta] = useState("");
  const [totalPersonas, setTotalPersonas] = useState(0);

  const agregarAcompanante = () => {
    setAcompanantes([...acompanantes, { nombre: "" }]);
  };

  const eliminarAcompanante = (index: number) => {
    setAcompanantes(acompanantes.filter((_, i) => i !== index));
  };

  const actualizarAcompanante = (index: number, nombre: string) => {
    const nuevos = [...acompanantes];
    nuevos[index] = { nombre };
    setAcompanantes(nuevos);
  };

  const enviarConfirmacion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    setEnviando(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre.trim(),
          acompanantes: acompanantes.filter((a) => a.nombre.trim()),
          mensaje: mensaje.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEnviado(true);
        setRespuesta(data.message);
        setTotalPersonas(data.totalPersonas);
      }
    } catch {
      setRespuesta("Error al enviar. Intenta de nuevo.");
    }
    setEnviando(false);
  };

  if (enviado) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 wave-bg">
        <div className="card-invitation p-8 md:p-12 max-w-lg w-full text-center animate-pulse-gold">
          <div className="text-6xl mb-4">🏴‍☠️</div>
          <h2 className="font-pirata text-3xl text-gold mb-4">
            ¡Nakama Confirmado!
          </h2>
          <p className="text-lg mb-2">{respuesta}</p>
          <p className="text-gold text-xl font-bold mb-6">
            Total de personas: {totalPersonas}
          </p>
          <div className="bg-parchment rounded-lg p-4 text-gray-800 mb-6">
            <p className="font-bold">Recuerda:</p>
            <p>Domingo 12 de Abril, 2026</p>
            <p>12:00 PM (Mediodía)</p>
          </div>
          <p className="text-sm opacity-70">
            ¡Nos vemos en el Grand Line! 🌊
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 wave-bg">
      {/* Header */}
      <div className="text-center mb-8 animate-float">
        <div className="jolly-roger mb-2">🏴‍☠️</div>
        <h1 className="font-pirata text-5xl md:text-7xl text-gold mb-2">
          Nakama Party
        </h1>
        <p className="text-xl md:text-2xl opacity-80">
          ¡Estás invitado a zarpar con nosotros!
        </p>
      </div>

      {/* Invitation Card */}
      <div className="card-invitation p-6 md:p-10 max-w-2xl w-full">
        {/* Event Info */}
        <div className="text-center mb-8">
          <h2 className="font-pirata text-3xl md:text-4xl text-gold mb-4">
            Fiesta de Cumpleaños
          </h2>
          <div className="bg-parchment rounded-lg p-6 text-gray-800 inline-block w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl mb-1">📅</p>
                <p className="font-bold text-lg">Domingo</p>
                <p>12 de Abril, 2026</p>
              </div>
              <div>
                <p className="text-2xl mb-1">⏰</p>
                <p className="font-bold text-lg">Mediodía</p>
                <p>12:00 PM</p>
              </div>
              <div>
                <p className="text-2xl mb-1">👒</p>
                <p className="font-bold text-lg">Temática</p>
                <p>One Piece</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dress Code Note */}
        <div className="text-center mb-8 p-4 rounded-lg" style={{ background: 'rgba(192, 57, 43, 0.2)', border: '1px solid rgba(192, 57, 43, 0.4)' }}>
          <p className="text-lg">
            🎭 ¡Ven disfrazado de tu personaje favorito de One Piece!
          </p>
          <p className="text-sm opacity-70 mt-1">
            (Opcional pero altamente recomendado, nakama)
          </p>
        </div>

        {/* RSVP Form */}
        <form onSubmit={enviarConfirmacion} className="space-y-6">
          <div>
            <label className="block text-gold font-bold mb-2 text-lg">
              Tu Nombre *
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="input-pirate"
              placeholder="Escribe tu nombre completo"
              required
            />
          </div>

          {/* Acompañantes Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-gold font-bold text-lg">
                Acompañantes
              </label>
              <button
                type="button"
                onClick={agregarAcompanante}
                className="bg-transparent border-2 border-dashed border-gold text-gold px-4 py-2 rounded-lg hover:bg-gold hover:text-gray-900 transition-all font-bold text-sm"
              >
                + Agregar Acompañante
              </button>
            </div>

            <div className="p-4 rounded-lg" style={{ background: 'rgba(212, 160, 23, 0.1)', border: '1px dashed rgba(212, 160, 23, 0.3)' }}>
              <p className="text-sm opacity-80 mb-1">
                ☝️ <strong>Importante:</strong> Si vienes con más personas, agrégalas aquí para que podamos preparar todo.
              </p>
              <p className="text-sm opacity-60">
                Puedes agregar a familiares, amigos, pareja o quien te acompañe. ¡Todos son bienvenidos a la tripulación!
              </p>
            </div>

            {acompanantes.length > 0 && (
              <div className="space-y-2">
                {acompanantes.map((acomp, index) => (
                  <div key={index} className="guest-row flex items-center gap-3">
                    <span className="text-gold font-bold min-w-[24px]">
                      {index + 1}.
                    </span>
                    <input
                      type="text"
                      value={acomp.nombre}
                      onChange={(e) =>
                        actualizarAcompanante(index, e.target.value)
                      }
                      className="input-pirate flex-1"
                      placeholder={`Nombre del acompañante ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => eliminarAcompanante(index)}
                      className="text-red-400 hover:text-red-300 text-xl font-bold px-2 transition-colors"
                      title="Eliminar"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <p className="text-gold text-sm font-bold text-right">
                  Total de personas: {1 + acompanantes.filter(a => a.nombre.trim()).length}
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-gold font-bold mb-2 text-lg">
              Mensaje (Opcional)
            </label>
            <textarea
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              className="input-pirate min-h-[80px] resize-none"
              placeholder="¿Algún mensaje para el capitán? ¿Alergias alimentarias? ¿Algo que debamos saber?"
              rows={3}
            />
          </div>

          <button
            type="submit"
            disabled={enviando || !nombre.trim()}
            className="btn-pirate w-full text-lg"
          >
            {enviando ? "Enviando..." : "⚓ Confirmar Asistencia ⚓"}
          </button>
        </form>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center opacity-50 text-sm pb-8">
        <p>「ひとつなぎの大宴会」- La Gran Fiesta del One Piece</p>
      </footer>
    </main>
  );
}
