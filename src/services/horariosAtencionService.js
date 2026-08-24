import { httpClient } from "./httpClient"

export function listarHorariosAtencion() {
    return httpClient.get("/horarios-atencion")
}

export function obtenerHorarioAtencionPorId(id) {
    return httpClient.get(`/horarios-atencion/${id}`)
}
