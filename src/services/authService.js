import { httpClient } from "./httpClient"

export function login({ correo, password }) {
    return httpClient.post("/usuarios/login", { correo, password }, { auth: false })
}

export function registrarCliente(datos) {
    return httpClient.post("/usuarios/registro", datos, { auth: false })
}

export function obtenerPerfil() {
    return httpClient.get("/usuarios/perfil")
}
