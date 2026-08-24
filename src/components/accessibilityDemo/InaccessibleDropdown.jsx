import { useState } from "react"

export function InaccessibleDropdown({ etiqueta, opciones }) {
    const [abierto, setAbierto] = useState(false)
    const [seleccionado, setSeleccionado] = useState(opciones[0])

    return (
        <div className="relative inline-block">
            <div
                onClick={() => setAbierto((v) => !v)}
                className="cursor-pointer rounded-lg border bg-background px-3 py-2 text-sm"
            >
                {etiqueta}: {seleccionado} ▾
            </div>
            {abierto && (
                <div className="absolute z-10 mt-1 w-full min-w-[10rem] rounded-lg border bg-popover p-1 shadow-lg">
                    {opciones.map((opcion) => (
                        <div
                            key={opcion}
                            onClick={() => {
                                setSeleccionado(opcion)
                                setAbierto(false)
                            }}
                            className="cursor-pointer rounded px-2 py-1.5 text-sm hover:bg-accent"
                        >
                            {opcion}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
