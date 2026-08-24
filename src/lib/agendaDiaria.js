import { formatearHora } from "./formatearHora"

function horaAMinutos(horaHHMM) {
    const [h, m] = horaHHMM.split(":").map(Number)
    return h * 60 + m
}

export function generarFranjasHorarias(horaInicioISO, horaFinISO, incrementoMinutos = 60) {
    const inicioMin = horaAMinutos(formatearHora(horaInicioISO))
    const finMin = horaAMinutos(formatearHora(horaFinISO))
    const franjas = []
    for (let minutos = inicioMin; minutos < finMin; minutos += incrementoMinutos) {
        const hastaMin = Math.min(minutos + incrementoMinutos, finMin)
        franjas.push({
            desde: `${String(Math.floor(minutos / 60)).padStart(2, "0")}:${String(minutos % 60).padStart(2, "0")}`,
            hasta: `${String(Math.floor(hastaMin / 60)).padStart(2, "0")}:${String(hastaMin % 60).padStart(2, "0")}`,
        })
    }
    return franjas
}

export function obtenerEstadoFranja(franja, empleado, restriccionesGenerales = []) {
    const desdeMin = horaAMinutos(franja.desde)
    const hastaMin = horaAMinutos(franja.hasta)
    const todasRestricciones = [...(empleado.restricciones || []), ...restriccionesGenerales]

    const restriccionAplicable = todasRestricciones.find((r) => {
        if (r.todoElDia) return true
        if (!r.horaInicio || !r.horaFin) return false
        const rInicio = horaAMinutos(formatearHora(r.horaInicio))
        const rFin = horaAMinutos(formatearHora(r.horaFin))
        return desdeMin < rFin && hastaMin > rInicio
    })
    if (restriccionAplicable) {
        return { tipo: "restriccion", restriccion: restriccionAplicable }
    }

    const citaAplicable = (empleado.citas || []).find((c) => {
        const cInicio = horaAMinutos(formatearHora(c.horaInicio))
        const cFin = horaAMinutos(formatearHora(c.horaFin))
        return desdeMin < cFin && hastaMin > cInicio
    })
    if (citaAplicable) {
        return { tipo: "cita", cita: citaAplicable }
    }

    return { tipo: "disponible" }
}
