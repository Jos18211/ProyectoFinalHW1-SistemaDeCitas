export function sumarMinutos(horaInicio, minutos) {
    if (!horaInicio) return ""
    const [horas, mins] = horaInicio.split(":").map(Number)
    const totalMinutos = horas * 60 + mins + minutos
    const horaFinH = Math.floor(totalMinutos / 60) % 24
    const horaFinM = totalMinutos % 60
    return `${String(horaFinH).padStart(2, "0")}:${String(horaFinM).padStart(2, "0")}`
}

export function calcularCostoTotal(precioServicio, adicionalesSeleccionados = []) {
    const costoAdicionales = adicionalesSeleccionados.reduce(
        (total, adicional) => total + Number(adicional.precio),
        0
    )
    return {
        costoAdicionales,
        costoTotal: Number(precioServicio) + costoAdicionales,
    }
}
