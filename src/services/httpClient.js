const API_URL = import.meta.env.VITE_API_URL

function getToken() {
    return localStorage.getItem("citas_token")
}

async function request(path, { method = "GET", body, auth = true, isFormData = false } = {}) {
    const headers = {}
    if (!isFormData) {
        headers["Content-Type"] = "application/json"
    }
    if (auth) {
        const token = getToken()
        if (token) {
            headers["Authorization"] = `Bearer ${token}`
        }
    }

    let response
    try {
        response = await fetch(`${API_URL}${path}`, {
            method,
            headers,
            body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
        })
    } catch {
        throw new Error("No se pudo conectar con el servidor. Verifica tu conexión.")
    }

    let payload = null
    try {
        payload = await response.json()
    } catch {
        payload = null
    }

    if (!response.ok) {
        const message =
            payload?.message ||
            payload?.validationErrors?.[0]?.message ||
            "Ocurrió un error inesperado."
        const error = new Error(message)
        error.status = response.status
        error.validationErrors = payload?.validationErrors ?? []
        throw error
    }

    return payload?.data !== undefined ? payload.data : payload
}

export const httpClient = {
    get: (path, options) => request(path, { ...options, method: "GET" }),
    post: (path, body, options) => request(path, { ...options, method: "POST", body }),
    put: (path, body, options) => request(path, { ...options, method: "PUT", body }),
    patch: (path, body, options) => request(path, { ...options, method: "PATCH", body }),
}
