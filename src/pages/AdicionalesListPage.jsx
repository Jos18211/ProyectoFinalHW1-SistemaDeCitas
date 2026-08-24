import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"

import { PageHeader } from "../components/PageHeader"
import { EstadoBadge } from "../components/EstadoBadge"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Alert } from "../components/ui/alert"
import { useAuth } from "../context/AuthContext"
import { formatearMoneda } from "../lib/ticketPricing"
import {
    listarAdicionales,
    cambiarEstadoAdicional,
} from "../services/serviciosAdicionalesService"

export function AdicionalesListPage() {
    const { rol } = useAuth()
    const esAdministrador = rol === "Administrador"

    const [adicionales, setAdicionales] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        cargarAdicionales()
    }, [])

    async function cargarAdicionales() {
        try {
            setLoading(true)
            setError("")
            const data = await listarAdicionales()
            setAdicionales(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    async function handleToggleEstado(adicional) {
        try {
            await cambiarEstadoAdicional(adicional.id, !adicional.activo)
            toast.success(
                adicional.activo
                    ? "Adicional desactivado correctamente."
                    : "Adicional activado correctamente."
            )
            cargarAdicionales()
        } catch (err) {
            toast.error(err.message)
        }
    }

    if (loading) {
        return <p className="text-center py-10">Cargando servicios adicionales...</p>
    }

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <PageHeader
                    title="Servicios adicionales"
                    description="Extras que un cliente puede sumar a su cita."
                />
                {esAdministrador && (
                    <Button asChild>
                        <Link to="/adicionales/nuevo">Nuevo adicional</Link>
                    </Button>
                )}
            </div>

            {error && <Alert variant="destructive">{error}</Alert>}

            {!error && adicionales.length === 0 && (
                <p className="text-muted-foreground">Todavía no hay servicios adicionales registrados.</p>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {adicionales.map((adicional) => (
                    <Card key={adicional.id}>
                        <CardContent className="space-y-3 p-5">
                            <div className="flex items-start justify-between gap-2">
                                <h3 className="font-semibold">{adicional.nombre}</h3>
                                <EstadoBadge activo={adicional.activo} />
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {adicional.descripcion}
                            </p>
                            <p className="text-lg font-bold text-primary">
                                {formatearMoneda(Number(adicional.precio))}
                            </p>
                            <div className="flex flex-wrap gap-2 pt-2">
                                <Button variant="outline" size="sm" asChild>
                                    <Link to={`/adicionales/${adicional.id}`}>Ver detalle</Link>
                                </Button>
                                {esAdministrador && (
                                    <>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link to={`/adicionales/${adicional.id}/editar`}>Editar</Link>
                                        </Button>
                                        <Button
                                            variant={adicional.activo ? "destructive" : "default"}
                                            size="sm"
                                            onClick={() => handleToggleEstado(adicional)}
                                        >
                                            {adicional.activo ? "Desactivar" : "Activar"}
                                        </Button>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    )
}
