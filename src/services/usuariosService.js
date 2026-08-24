import { httpClient } from "./httpClient"

export function listarUsuarios(rol) {
    const query = rol ? `?rol=${encodeURIComponent(rol)}` : ""
    return httpClient.get(`/usuarios${query}`)
}

export function obtenerUsuarioPorId(id) {
    return httpClient.get(`/usuarios/${id}`)
}
