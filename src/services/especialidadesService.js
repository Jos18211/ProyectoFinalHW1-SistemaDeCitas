import { httpClient } from "./httpClient"

export function listarEspecialidades() {
    return httpClient.get("/especialidades")
}

export function obtenerEspecialidadPorId(id) {
    return httpClient.get(`/especialidades/${id}`)
}
