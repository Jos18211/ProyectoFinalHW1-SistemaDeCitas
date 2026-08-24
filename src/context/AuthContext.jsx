import { createContext, useContext, useEffect, useState } from "react"
import { login as loginRequest, obtenerPerfil } from "../services/authService"

const AuthContext = createContext(null)
const TOKEN_KEY = "citas_token"

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null)
    const [cargandoSesion, setCargandoSesion] = useState(true)

    useEffect(() => {
        async function restaurarSesion() {
            const token = localStorage.getItem(TOKEN_KEY)
            if (!token) {
                setCargandoSesion(false)
                return
            }
            try {
                const perfil = await obtenerPerfil()
                setUsuario(perfil)
            } catch {
                localStorage.removeItem(TOKEN_KEY)
                setUsuario(null)
            } finally {
                setCargandoSesion(false)
            }
        }
        restaurarSesion()
    }, [])

    async function login(correo, password) {
        const { token } = await loginRequest({ correo, password })
        localStorage.setItem(TOKEN_KEY, token)
        const perfil = await obtenerPerfil()
        setUsuario(perfil)
        return perfil
    }

    function logout() {
        localStorage.removeItem(TOKEN_KEY)
        setUsuario(null)
    }

    const value = {
        usuario,
        rol: usuario?.rol?.nombre ?? null,
        estaAutenticado: !!usuario,
        cargandoSesion,
        login,
        logout,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider")
    }
    return context
}
