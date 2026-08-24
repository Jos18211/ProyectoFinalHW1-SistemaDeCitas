import PropTypes from "prop-types"
import { Badge } from "./ui/badge"

export function EstadoBadge({ activo, textoActivo = "Activo", textoInactivo = "Inactivo" }) {
    return (
        <Badge variant={activo ? "default" : "destructive"}>
            {activo ? textoActivo : textoInactivo}
        </Badge>
    )
}

EstadoBadge.propTypes = {
    activo: PropTypes.bool.isRequired,
    textoActivo: PropTypes.string,
    textoInactivo: PropTypes.string,
}
