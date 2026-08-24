const COLORES = {
    Pendiente: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    Confirmada: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
    "En proceso": "bg-violet-500/15 text-violet-600 dark:text-violet-400",
    Finalizada: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    Cancelada: "bg-red-500/15 text-red-600 dark:text-red-400",
}

export function obtenerColorEstadoCita(nombreEstado) {
    return COLORES[nombreEstado] || "bg-muted text-muted-foreground"
}
