export function InaccessibleModal({ open, onClose, titulo, children }) {
    if (!open) return null

    // A propósito: sin role, sin aria-modal, sin manejo de foco, sin Escape.
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-sm rounded-xl bg-card p-5 shadow-xl">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{titulo}</h3>
                    {/* Ícono sin aria-label: un lector de pantalla solo anuncia "botón" */}
                    <button onClick={onClose} className="text-muted-foreground">
                        ✕
                    </button>
                </div>
                {children}
            </div>
        </div>
    )
}
