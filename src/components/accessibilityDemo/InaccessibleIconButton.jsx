import { Trash2 } from "lucide-react"

export function InaccessibleIconButton() {
    return (
        <button className="rounded-lg border p-2 hover:bg-muted">
            <Trash2 className="h-5 w-5" />
        </button>
    )
}
