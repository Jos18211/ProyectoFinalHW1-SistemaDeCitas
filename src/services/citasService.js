import { httpClient } from "./httpClient"

const BASE_PATH = "/citas"

export function listarCitas() {
    return httpClient.get(BASE_PATH)
}

export function listarCitasPorCliente(clienteId) {
    return httpClient.get(`${BASE_PATH}/cliente/${clienteId}`)
}

export function listarCitasPorEmpleado(empleadoId) {
    return httpClient.get(`${BASE_PATH}/empleado/${empleadoId}`)
}

export function obtenerCitaPorId(id) {
    return httpClient.get(`${BASE_PATH}/${id}`)
}

export function crearCita(datos) {
    return httpClient.post(BASE_PATH, datos)
}

export function actualizarCita(id, datos) {
    return httpClient.put(`${BASE_PATH}/${id}`, datos)
}

export function cancelarCita(id, motivoCancelacion) {
    return httpClient.patch(`${BASE_PATH}/${id}/cancelar`, { motivoCancelacion })
}

export function cambiarEstadoCita(id, estadoCitaId) {
    return httpClient.patch(`${BASE_PATH}/${id}/estado`, { estadoCitaId })
}

export function consultarDisponibilidad(datos) {
    return httpClient.post(`${BASE_PATH}/disponibilidad`, datos)
}
export function consultarAgendaEmpleadoParaCita(empleadoId, fecha) {
    return httpClient.get(`${BASE_PATH}/agenda-empleado/${empleadoId}?fecha=${fecha}`)
}
export function consultarAgendaDiaria(fecha) {
    return httpClient.get(`${BASE_PATH}/agenda-diaria?fecha=${fecha}`)
}
