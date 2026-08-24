import { useEffect, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"

export function AccessibleDropdown({ etiqueta, opciones }) {
    const [abierto, setAbierto] = useState(false)
    const [indiceActivo, setIndiceActivo] = useState(0)
    const [seleccionado, setSeleccionado] = useState(opciones[0])
    const listaRef = useRef(null)
    const botonRef = useRef(null)

    useEffect(() => {
        if (abierto) {
            listaRef.current?.children[indiceActivo]?.focus()
        }
    }, [abierto, indiceActivo])

    function manejarTecladoBoton(evento) {
        if (evento.key === "ArrowDown" || evento.key === "Enter" || evento.key === " ") {
            evento.preventDefault()
            setAbierto(true)
        }
    }

    function manejarTecladoLista(evento) {
        if (evento.key === "ArrowDown") {
            evento.preventDefault()
            setIndiceActivo((i) => Math.min(i + 1, opciones.length - 1))
        } else if (evento.key === "ArrowUp") {
            evento.preventDefault()
            setIndiceActivo((i) => Math.max(i - 1, 0))
        } else if (evento.key === "Enter" || evento.key === " ") {
            evento.preventDefault()
            setSeleccionado(opciones[indiceActivo])
            setAbierto(false)
            botonRef.current?.focus()
        } else if (evento.key === "Escape") {
            setAbierto(false)
            botonRef.current?.focus()
        }
    }

    return (
        <div className="relative inline-block">
            <button
                ref={botonRef}
                type="button"
                aria-haspopup="listbox"
                aria-expanded={abierto}
                onClick={() => setAbierto((v) => !v)}
                onKeyDown={manejarTecladoBoton}
                className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm"
            >
                {etiqueta}: {seleccionado}
                <ChevronDown className="h-4 w-4" />
            </button>

            {abierto && (
                <ul
                    ref={listaRef}
                    role="listbox"
                    aria-label={etiqueta}
                    onKeyDown={manejarTecladoLista}
                    className="absolute z-10 mt-1 w-full min-w-[10rem] rounded-lg border bg-popover p-1 shadow-lg"
                >
                    {opciones.map((opcion, i) => (
                        <li
                            key={opcion}
                            role="option"
                            tabIndex={-1}
                            aria-selected={opcion === seleccionado}
                            className={`cursor-pointer rounded px-2 py-1.5 text-sm outline-none ${
                                i === indiceActivo ? "bg-accent text-accent-foreground" : ""
                            }`}
                            onMouseEnter={() => setIndiceActivo(i)}
                            onClick={() => {
                                setSeleccionado(opcion)
                                setAbierto(false)
                                botonRef.current?.focus()
                            }}
                        >
                            {opcion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
