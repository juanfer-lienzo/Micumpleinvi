"use client";

import { useState } from "react";
import Image from "next/image";

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
      <main className="min-h-screen flex items-center justify-center p-4 bg-ocean">
        <div className="card-main p-8 md:p-12 max-w-lg w-full text-center">
          <Image
            src="/straw-hat.svg"
            alt="Sombrero de paja"
            width={100}
            height={62}
            className="mx-auto mb-4"
          />
          <h2 className="text-3xl font-bold mb-3">
            ¡Confirmado!
          </h2>
          <p className="text-lg mb-2 opacity-90">{respuesta}</p>
          <p className="text-xl font-bold mb-6" style={{ color: '#ff6b5a' }}>
            {totalPersonas} {totalPersonas === 1 ? "persona" : "personas"}
          </p>
          <div className="info-card p-5 mb-6 text-left">
            <p className="font-bold text-lg mb-2">Detalles del evento</p>
            <div className="space-y-1 text-sm">
              <p>📅 Domingo 12 de Abril, 2026</p>
              <p>🕛 12:00 PM (Mediodía)</p>
              <p>🎭 Temática: One Piece</p>
            </div>
          </div>
          <p className="text-sm opacity-50">
            ¡Nos vemos el domingo!
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center p-4 bg-ocean">
      {/* Straw Hat Header */}
      <div className="text-center mt-8 md:mt-12 mb-6">
        <Image
          src="/straw-hat.svg"
          alt="Sombrero de paja"
          width={140}
          height={87}
          className="mx-auto mb-4 animate-gentle-float"
          priority
        />
        <h1 className="text-4xl md:text-5xl font-bold mb-1">
          ¡Estás Invitado!
        </h1>
        <p className="text-lg opacity-60">
          Fiesta de cumpleaños de Juanfer
        </p>
      </div>

      {/* Wanted Poster */}
      <div className="wanted-poster mx-auto mb-8 max-w-xs w-full">
        <div className="wanted-inner">
          <p className="wanted-title">WANTED</p>
          <div className="wanted-photo">
            <Image
              src="/wanted.png"
              alt="Wanted poster"
              width={220}
              height={220}
              className="wanted-img"
            />
          </div>
          <p className="wanted-doa">DEAD OR ALIVE</p>
          <p className="wanted-name">JUANFER</p>
          <p className="wanted-bounty">$300.000.000-</p>
          <div className="wanted-marine">
            <span>MARINE</span>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="card-main p-6 md:p-10 max-w-2xl w-full">
        {/* Event Info */}
        <div className="info-card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl mb-1">📅</p>
              <p className="font-bold">Domingo</p>
              <p className="text-sm text-gray-600">12 de Abril, 2026</p>
            </div>
            <div>
              <p className="text-2xl mb-1">🕛</p>
              <p className="font-bold">Mediodía</p>
              <p className="text-sm text-gray-600">12:00 PM</p>
            </div>
            <div>
              <p className="text-2xl mb-1">🎭</p>
              <p className="font-bold">One Piece</p>
              <p className="text-sm text-gray-600">Temática de la fiesta</p>
            </div>
          </div>
        </div>

        {/* RSVP Form */}
        <form onSubmit={enviarConfirmacion} className="space-y-6">
          <div>
            <label className="block font-semibold mb-2">
              Tu Nombre *
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="input-field"
              placeholder="Nombre completo"
              required
            />
          </div>

          {/* Acompañantes Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block font-semibold">
                ¿Vienes con alguien?
              </label>
              <button
                type="button"
                onClick={agregarAcompanante}
                className="text-sm px-4 py-2 rounded-lg border border-dashed border-white/20 hover:bg-white/10 transition-all"
              >
                + Agregar persona
              </button>
            </div>

            <p className="text-sm opacity-50">
              Si vienes acompañado, agrega a cada persona para que podamos preparar todo bien.
            </p>

            {acompanantes.length > 0 && (
              <div className="space-y-2">
                {acompanantes.map((acomp, index) => (
                  <div key={index} className="guest-row flex items-center gap-3">
                    <span className="opacity-40 text-sm min-w-[20px]">
                      {index + 1}.
                    </span>
                    <input
                      type="text"
                      value={acomp.nombre}
                      onChange={(e) =>
                        actualizarAcompanante(index, e.target.value)
                      }
                      className="input-field flex-1"
                      placeholder="Nombre del acompañante"
                    />
                    <button
                      type="button"
                      onClick={() => eliminarAcompanante(index)}
                      className="opacity-40 hover:opacity-100 text-lg px-2 transition-opacity"
                      title="Eliminar"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <p className="text-sm opacity-60 text-right">
                  Total: {1 + acompanantes.filter(a => a.nombre.trim()).length} {1 + acompanantes.filter(a => a.nombre.trim()).length === 1 ? "persona" : "personas"}
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Mensaje <span className="font-normal opacity-50">(opcional)</span>
            </label>
            <textarea
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              className="input-field min-h-[80px] resize-none"
              placeholder="¿Algún mensaje, alergia alimentaria o algo que debamos saber?"
              rows={3}
            />
          </div>

          <button
            type="submit"
            disabled={enviando || !nombre.trim()}
            className="btn-primary w-full"
          >
            {enviando ? "Enviando..." : "Confirmar asistencia"}
          </button>
        </form>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center opacity-30 text-sm pb-8">
        <p>One Piece Birthday Party</p>
      </footer>
    </main>
  );
}
