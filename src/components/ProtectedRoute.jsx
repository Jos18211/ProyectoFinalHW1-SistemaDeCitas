import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export function ProtectedRoute({ rolesPermitidos }) {
    const { estaAutenticado, cargandoSesion, rol } = useAuth()

    if (cargandoSesion) {
        return <p className="text-center py-10">Cargando sesión...</p>
    }

    if (!estaAutenticado) {
        return <Navigate to="/login" replace />
    }

    if (rolesPermitidos && !rolesPermitidos.includes(rol)) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}
