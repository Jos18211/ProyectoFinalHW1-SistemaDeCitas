import { httpClient } from "./httpClient"

export function listarEstadosCita() {
    return httpClient.get("/estados-cita")
}
