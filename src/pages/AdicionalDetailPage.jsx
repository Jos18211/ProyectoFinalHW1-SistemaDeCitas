import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"

import { PageHeader } from "../components/PageHeader"
import { EstadoBadge } from "../components/EstadoBadge"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Alert } from "../components/ui/alert"
import { useAuth } from "../context/AuthContext"
import { formatearMoneda } from "../lib/ticketPricing"
import { obtenerAdicionalPorId } from "../services/serviciosAdicionalesService"

export function AdicionalDetailPage() {
    const { id } = useParams()
    const { rol } = useAuth()
    const esAdministrador = rol === "Administrador"

    const [adicional, setAdicional] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function cargar() {
            try {
                setLoading(true)
                setError("")
                const data = await obtenerAdicionalPorId(id)
                setAdicional(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        cargar()
    }, [id])

    if (loading) return <p className="text-center py-10">Cargando adicional...</p>
    if (error) return <Alert variant="destructive">{error}</Alert>
    if (!adicional) return null

    return (
        <section className="mx-auto max-w-xl space-y-6">
            <PageHeader title={adicional.nombre} description="Detalle del servicio adicional." />
            <Card>
                <CardContent className="space-y-4 p-6">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Estado</span>
                        <EstadoBadge activo={adicional.activo} />
                    </div>
                    <div>
                        <span className="text-sm text-muted-foreground">Descripción</span>
                        <p className="font-medium">{adicional.descripcion}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Precio</span>
                        <span className="text-xl font-bold text-primary">
                            {formatearMoneda(Number(adicional.precio))}
                        </span>
                    </div>
                    <div className="flex justify-end gap-3 border-t pt-4">
                        <Button variant="outline" asChild>
                            <Link to="/adicionales">Volver al listado</Link>
                        </Button>
                        {esAdministrador && (
                            <Button asChild>
                                <Link to={`/adicionales/${adicional.id}/editar`}>Editar</Link>
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}
