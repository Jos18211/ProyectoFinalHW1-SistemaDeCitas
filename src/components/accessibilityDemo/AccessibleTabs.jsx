import { useRef, useState } from "react"

const PESTANAS = [
    { id: "info", titulo: "Información", contenido: "Datos generales del servicio." },
    { id: "precio", titulo: "Precio", contenido: "₡35,000 por sesión." },
    { id: "duracion", titulo: "Duración", contenido: "Aproximadamente 60 minutos." },
]

export function AccessibleTabs() {
    const [activaIndice, setActivaIndice] = useState(0)
    const botonesRef = useRef([])

    function manejarTeclado(evento, indice) {
        let nuevoIndice = indice
        if (evento.key === "ArrowRight") {
            nuevoIndice = (indice + 1) % PESTANAS.length
        } else if (evento.key === "ArrowLeft") {
            nuevoIndice = (indice - 1 + PESTANAS.length) % PESTANAS.length
        } else if (evento.key === "Home") {
            nuevoIndice = 0
        } else if (evento.key === "End") {
            nuevoIndice = PESTANAS.length - 1
        } else {
            return
        }
        evento.preventDefault()
        setActivaIndice(nuevoIndice)
        botonesRef.current[nuevoIndice]?.focus()
    }

    return (
        <div>
            <div role="tablist" aria-label="Detalle del servicio" className="flex gap-2 border-b">
                {PESTANAS.map((pestana, indice) => (
                    <button
                        key={pestana.id}
                        ref={(el) => (botonesRef.current[indice] = el)}
                        role="tab"
                        id={`tab-${pestana.id}`}
                        aria-selected={activaIndice === indice}
                        aria-controls={`panel-${pestana.id}`}
                        tabIndex={activaIndice === indice ? 0 : -1}
                        onClick={() => setActivaIndice(indice)}
                        onKeyDown={(e) => manejarTeclado(e, indice)}
                        className={`px-3 py-2 text-sm outline-none ${
                            activaIndice === indice
                                ? "border-b-2 border-primary font-semibold"
                                : "text-muted-foreground"
                        }`}
                    >
                        {pestana.titulo}
                    </button>
                ))}
            </div>
            {PESTANAS.map((pestana, indice) => (
                <div
                    key={pestana.id}
                    role="tabpanel"
                    id={`panel-${pestana.id}`}
                    aria-labelledby={`tab-${pestana.id}`}
                    hidden={activaIndice !== indice}
                    className="p-3 text-sm"
                >
                    {pestana.contenido}
                </div>
            ))}
        </div>
    )
}

