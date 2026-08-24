import { useState } from "react"
import { Button } from "../ui/button"

export function InaccessibleAlert() {
    const [mensaje, setMensaje] = useState("")

    return (
        <div className="space-y-2">
            <Button variant="outline" onClick={() => setMensaje("Cambios guardados correctamente.")}>
                Guardar cambios
            </Button>
            {/* Sin aria-live: si el usuario no tiene el foco aquí, nunca se entera de que apareció el texto. */}
            {mensaje && <p className="text-sm text-emerald-600">{mensaje}</p>}
        </div>
    )
}
