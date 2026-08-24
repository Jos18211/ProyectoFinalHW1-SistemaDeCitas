import PropTypes from "prop-types"
import { cn } from "../lib/utils"

const COLORES = [
    "bg-primary/15 text-primary",
    "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    "bg-blue-500/15 text-blue-600 dark:text-blue-400",
    "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    "bg-violet-500/15 text-violet-600 dark:text-violet-400",
]

// Elige siempre el mismo color para el mismo nombre, sin guardar nada en la base de datos.
function colorPorNombre(texto) {
    const codigo = texto.split("").reduce((acumulado, letra) => acumulado + letra.charCodeAt(0), 0)
    return COLORES[codigo % COLORES.length]
}

export function Avatar({ nombre, primerApellido, size = "h-12 w-12 text-sm" }) {
    const iniciales = `${nombre?.[0] ?? ""}${primerApellido?.[0] ?? ""}`.toUpperCase()
    const color = colorPorNombre(`${nombre ?? ""}${primerApellido ?? ""}`)

    return (
        <div className={cn("flex shrink-0 items-center justify-center rounded-full font-semibold", size, color)}>
            {iniciales || "?"}
        </div>
    )
}

Avatar.propTypes = {
    nombre: PropTypes.string,
    primerApellido: PropTypes.string,
    size: PropTypes.string,
}
