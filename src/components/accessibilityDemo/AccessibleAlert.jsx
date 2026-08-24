import { useState } from "react"
import { Button } from "../ui/button"

export function AccessibleAlert() {
    const [mensaje, setMensaje] = useState("")

    return (
        <div className="space-y-2">
            <Button onClick={() => setMensaje("Cambios guardados correctamente.")}>
                Guardar cambios
            </Button>
            <p aria-live="polite" className="text-sm text-emerald-600">
                {mensaje}
            </p>
        </div>
    )
}
