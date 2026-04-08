import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CSV_PATH = path.join(process.cwd(), "data", "asistentes.csv");
const CSV_HEADER = "nombre,acompanantes,total_personas,mensaje,fecha_registro\n";

function ensureCsvExists() {
  const dir = path.dirname(CSV_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(CSV_PATH)) {
    fs.writeFileSync(CSV_PATH, CSV_HEADER);
  }
}

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

interface Guest {
  nombre: string;
}

interface RsvpBody {
  nombre: string;
  acompanantes: Guest[];
  mensaje: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: RsvpBody = await request.json();
    const { nombre, acompanantes, mensaje } = body;

    if (!nombre || !nombre.trim()) {
      return NextResponse.json(
        { error: "El nombre es obligatorio" },
        { status: 400 }
      );
    }

    ensureCsvExists();

    const totalPersonas = 1 + (acompanantes?.length || 0);
    const nombresAcompanantes = acompanantes
      ?.map((a: Guest) => a.nombre)
      .filter((n: string) => n.trim())
      .join("; ") || "Ninguno";
    const fechaRegistro = new Date().toISOString();

    const row = [
      escapeCsv(nombre.trim()),
      escapeCsv(nombresAcompanantes),
      totalPersonas.toString(),
      escapeCsv((mensaje || "").trim()),
      fechaRegistro,
    ].join(",");

    fs.appendFileSync(CSV_PATH, row + "\n");

    return NextResponse.json({
      success: true,
      message: `¡Gracias ${nombre}! Tu confirmación ha sido registrada.`,
      totalPersonas,
    });
  } catch {
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    ensureCsvExists();
    const content = fs.readFileSync(CSV_PATH, "utf-8");
    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="asistentes.csv"',
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Error al leer los datos" },
      { status: 500 }
    );
  }
}
