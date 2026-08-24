import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"

import { PageHeader } from "../components/PageHeader"
import { EstadoBadge } from "../components/EstadoBadge"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Alert } from "../components/ui/alert"
import { useAuth } from "../context/AuthContext"
import { formatearMoneda } from "../lib/ticketPricing"
import { obtenerServicioPorId } from "../services/serviciosService"

export function ServicioDetailPage() {
    const { id } = useParams()
    const { rol } = useAuth()
    const esAdministrador = rol === "Administrador"

    const [servicio, setServicio] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function cargar() {
            try {
                setLoading(true)
                setError("")
                const data = await obtenerServicioPorId(id)
                setServicio(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        cargar()
    }, [id])

    if (loading) return <p className="text-center py-10">Cargando servicio...</p>
    if (error) return <Alert variant="destructive">{error}</Alert>
    if (!servicio) return null

    return (
        <section className="mx-auto max-w-2xl space-y-6">
            <PageHeader title={servicio.nombre} description="Detalle del servicio." />
            <Card className="overflow-hidden">
                <div className="h-56 w-full overflow-hidden bg-muted">
                    {servicio.imagen ? (
                        <img
                            src={`${import.meta.env.VITE_IMAGE_URL}/${servicio.imagen}`}
                            alt={servicio.nombre}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                            Sin imagen
                        </div>
                    )}
                </div>
                <CardContent className="space-y-4 p-6">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Estado</span>
                        <EstadoBadge activo={servicio.activo} />
                    </div>
                    <div>
                        <span className="text-sm text-muted-foreground">Descripción</span>
                        <p className="font-medium">{servicio.descripcion}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Precio base</span>
                        <span className="text-xl font-bold text-primary">
                            {formatearMoneda(Number(servicio.precioBase))}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Duración</span>
                        <span className="font-medium">{servicio.duracionMinutos} minutos</span>
                    </div>
                    <div className="flex justify-end gap-3 border-t pt-4">
                        <Button variant="outline" asChild>
                            <Link to="/servicios">Volver al listado</Link>
                        </Button>
                        {esAdministrador && (
                            <Button asChild>
                                <Link to={`/servicios/${servicio.id}/editar`}>Editar</Link>
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}
