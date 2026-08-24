import { httpClient } from "./httpClient"

export function listarRestriccionesHorario() {
    return httpClient.get("/restricciones-horario")
}

export function obtenerRestriccionHorarioPorId(id) {
    return httpClient.get(`/restricciones-horario/${id}`)
}
