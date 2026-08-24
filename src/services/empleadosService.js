import { httpClient } from "./httpClient"

const BASE_PATH = "/empleados"

export function listarEmpleados() {
    return httpClient.get(BASE_PATH)
}

export function listarEmpleadosActivos(servicioId) {
    const query = servicioId ? `?servicioId=${servicioId}` : ""
    return httpClient.get(`${BASE_PATH}/activos${query}`)
}

export function obtenerEmpleadoPorId(id) {
    return httpClient.get(`${BASE_PATH}/${id}`)
}

export function crearEmpleado(datos) {
    return httpClient.post(BASE_PATH, datos)
}

export function actualizarEmpleado(id, datos) {
    return httpClient.put(`${BASE_PATH}/${id}`, datos)
}

export function cambiarEstadoEmpleado(id, activo) {
    return httpClient.patch(`${BASE_PATH}/${id}/estado`, { activo })
}

export function obtenerAgendaEmpleado(id, fecha) {
    return httpClient.get(`${BASE_PATH}/${id}/agenda?fecha=${fecha}`)
}
