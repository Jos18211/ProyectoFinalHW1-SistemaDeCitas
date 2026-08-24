import { httpClient } from "./httpClient"

const BASE_PATH = "/servicios"

export function listarServicios() {
    return httpClient.get(BASE_PATH)
}

export function listarServiciosActivos() {
    return httpClient.get(`${BASE_PATH}/activos`)
}

export function obtenerServicioPorId(id) {
    return httpClient.get(`${BASE_PATH}/${id}`)
}

export function crearServicio(datos) {
    return httpClient.post(BASE_PATH, datos)
}

export function actualizarServicio(id, datos) {
    return httpClient.put(`${BASE_PATH}/${id}`, datos)
}

export function cambiarEstadoServicio(id, activo) {
    return httpClient.patch(`${BASE_PATH}/${id}/estado`, { activo })
}
