import PropTypes from "prop-types"
import { obtenerColorEstadoCita } from "../lib/estadoCitaColor"

export function EstadoCitaBadge({ nombreEstado }) {
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${obtenerColorEstadoCita(nombreEstado)}`}>
            {nombreEstado}
        </span>
    )
}

EstadoCitaBadge.propTypes = {
    nombreEstado: PropTypes.string.isRequired,
}
