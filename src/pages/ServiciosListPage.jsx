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
import { listarServicios, cambiarEstadoServicio } from "../services/serviciosService"

export function ServiciosListPage() {
    const { rol } = useAuth()
    const esAdministrador = rol === "Administrador"

    const [servicios, setServicios] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        cargarServicios()
    }, [])

    async function cargarServicios() {
        try {
            setLoading(true)
            setError("")
            const data = await listarServicios()
            setServicios(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    async function handleToggleEstado(servicio) {
        try {
            await cambiarEstadoServicio(servicio.id, !servicio.activo)
            toast.success(
                servicio.activo ? "Servicio desactivado correctamente." : "Servicio activado correctamente."
            )
            cargarServicios()
        } catch (err) {
            toast.error(err.message)
        }
    }

    if (loading) return <p className="text-center py-10">Cargando servicios...</p>

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <PageHeader title="Servicios" description="Servicios principales del estudio." />
                {esAdministrador && (
                    <Button asChild>
                        <Link to="/servicios/nuevo">Nuevo servicio</Link>
                    </Button>
                )}
            </div>

            {error && <Alert variant="destructive">{error}</Alert>}
            {!error && servicios.length === 0 && (
                <p className="text-muted-foreground">Todavía no hay servicios registrados.</p>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {servicios.map((servicio) => (
                    <Card key={servicio.id} className="overflow-hidden">
                        <div className="h-40 w-full overflow-hidden bg-muted">
                            {servicio.imagen ? (
                                <img
                                    src={`${import.meta.env.VITE_IMAGE_URL}/${servicio.imagen}`}
                                    alt={servicio.nombre}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                                    Sin imagen
                                </div>
                            )}
                        </div>
                        <CardContent className="space-y-3 p-5">
                            <div className="flex items-start justify-between gap-2">
                                <h3 className="font-semibold">{servicio.nombre}</h3>
                                <EstadoBadge activo={servicio.activo} />
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">{servicio.descripcion}</p>
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-bold text-primary">
                                    {formatearMoneda(Number(servicio.precioBase))}
                                </span>
                                <span className="text-muted-foreground">{servicio.duracionMinutos} min</span>
                            </div>
                            <div className="flex flex-wrap gap-2 pt-2">
                                <Button variant="outline" size="sm" asChild>
                                    <Link to={`/servicios/${servicio.id}`}>Ver detalle</Link>
                                </Button>
                                {esAdministrador && (
                                    <>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link to={`/servicios/${servicio.id}/editar`}>Editar</Link>
                                        </Button>
                                        <Button
                                            variant={servicio.activo ? "destructive" : "default"}
                                            size="sm"
                                            onClick={() => handleToggleEstado(servicio)}
                                        >
                                            {servicio.activo ? "Desactivar" : "Activar"}
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
