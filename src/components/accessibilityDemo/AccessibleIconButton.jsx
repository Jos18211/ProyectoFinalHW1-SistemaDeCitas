import { Trash2 } from "lucide-react"

export function AccessibleIconButton() {
    return (
        <button aria-label="Eliminar diseño" className="rounded-lg border p-2 hover:bg-muted">
            <Trash2 className="h-5 w-5" aria-hidden="true" />
        </button>
    )
}
