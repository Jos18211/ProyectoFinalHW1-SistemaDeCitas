import { useEffect, useRef } from "react"
import { X } from "lucide-react"
import { Button } from "../ui/button"

const SELECTOR_FOCOSABLES =
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function AccessibleModal({ open, onClose, titulo, children }) {
    const contenedorRef = useRef(null)
    const disparadorPrevioRef = useRef(null)

    // 1) Al abrir: recordar qué elemento tenía el foco, y mover el foco dentro del modal.
    useEffect(() => {
        if (!open) return
        disparadorPrevioRef.current = document.activeElement

        const primerFocosable = contenedorRef.current?.querySelector(SELECTOR_FOCOSABLES)
        primerFocosable?.focus()

        // 3) Al cerrar (cleanup): devolver el foco a quien abrió el modal.
        return () => {
            disparadorPrevioRef.current?.focus()
        }
    }, [open])

    // 2) Mientras está abierto: atrapar el Tab dentro del modal y cerrar con Escape.
    useEffect(() => {
        if (!open) return

        function manejarTeclado(evento) {
            if (evento.key === "Escape") {
                onClose()
                return
            }
            if (evento.key !== "Tab") return

            const focosables = contenedorRef.current?.querySelectorAll(SELECTOR_FOCOSABLES)
            if (!focosables || focosables.length === 0) return

            const primero = focosables[0]
            const ultimo = focosables[focosables.length - 1]

            if (evento.shiftKey && document.activeElement === primero) {
                evento.preventDefault()
                ultimo.focus()
            } else if (!evento.shiftKey && document.activeElement === ultimo) {
                evento.preventDefault()
                primero.focus()
            }
        }

        document.addEventListener("keydown", manejarTeclado)
        return () => document.removeEventListener("keydown", manejarTeclado)
    }, [open, onClose])

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div
                ref={contenedorRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="titulo-modal-accesible"
                className="w-full max-w-sm rounded-xl bg-card p-5 shadow-xl"
            >
                <div className="mb-3 flex items-center justify-between">
                    <h3 id="titulo-modal-accesible" className="text-lg font-semibold">
                        {titulo}
                    </h3>
                    <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Cerrar diálogo">
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                {children}
            </div>
        </div>
    )
}
