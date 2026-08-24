import { httpClient } from "./httpClient"

const BASE_PATH = "/servicios-adicionales"

export function listarAdicionales() {
    return httpClient.get(BASE_PATH)
}

export function listarAdicionalesActivos() {
    return httpClient.get(`${BASE_PATH}/activos`)
}

export function obtenerAdicionalPorId(id) {
    return httpClient.get(`${BASE_PATH}/${id}`)
}

export function crearAdicional(datos) {
    return httpClient.post(BASE_PATH, datos)
}

export function actualizarAdicional(id, datos) {
    return httpClient.put(`${BASE_PATH}/${id}`, datos)
}

export function cambiarEstadoAdicional(id, activo) {
    return httpClient.patch(`${BASE_PATH}/${id}/estado`, { activo })
}
