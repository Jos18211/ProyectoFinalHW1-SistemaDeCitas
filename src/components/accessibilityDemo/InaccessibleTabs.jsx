import { useState } from "react"

const PESTANAS = [
    { id: "info", titulo: "Información", contenido: "Datos generales del servicio." },
    { id: "precio", titulo: "Precio", contenido: "₡35,000 por sesión." },
    { id: "duracion", titulo: "Duración", contenido: "Aproximadamente 60 minutos." },
]

export function InaccessibleTabs() {
    const [activa, setActiva] = useState(PESTANAS[0].id)

    return (
        <div>
            <div className="flex gap-2 border-b">
                {PESTANAS.map((pestana) => (
                    <div
                        key={pestana.id}
                        onClick={() => setActiva(pestana.id)}
                        className={`cursor-pointer px-3 py-2 text-sm ${
                            activa === pestana.id ? "border-b-2 border-primary font-semibold" : "text-muted-foreground"
                        }`}
                    >
                        {pestana.titulo}
                    </div>
                ))}
            </div>
            <div className="p-3 text-sm">
                {PESTANAS.find((p) => p.id === activa)?.contenido}
            </div>
        </div>
    )
}
