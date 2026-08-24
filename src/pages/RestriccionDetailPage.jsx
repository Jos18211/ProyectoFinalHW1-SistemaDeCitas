import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"

import { PageHeader } from "../components/PageHeader"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Alert } from "../components/ui/alert"
import { Badge } from "../components/ui/badge"
import { formatearHora } from "../lib/formatearHora"
import { obtenerRestriccionHorarioPorId } from "../services/restriccionesHorarioService"

export function RestriccionDetailPage() {
    const { id } = useParams()
    const [restriccion, setRestriccion] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function cargar() {
            try {
                setLoading(true)
                setError("")
                const data = await obtenerRestriccionHorarioPorId(id)
                setRestriccion(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        cargar()
    }, [id])

    if (loading) return <p className="text-center py-10">Cargando restricción...</p>
    if (error) return <Alert variant="destructive">{error}</Alert>
    if (!restriccion) return null

    return (
        <section className="mx-auto max-w-xl space-y-6">
            <PageHeader title={restriccion.tipoRestriccion?.nombre} description="Detalle de la restricción de horario." />
            <Card>
                <CardContent className="space-y-4 p-6">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Aplica a</span>
                        <Badge variant={restriccion.empleadoId ? "secondary" : "destructive"}>
                            {restriccion.empleadoId
                                ? `${restriccion.empleado?.usuario?.nombre} ${restriccion.empleado?.usuario?.primerApellido}`
                                : "Establecimiento completo"}
                        </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Fecha</span>
                        <span className="font-medium">
                            {new Date(restriccion.fecha).toLocaleDateString("es-CR", { timeZone: "UTC" })}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Horario restringido</span>
                        <span className="font-medium">
                            {restriccion.todoElDia
                                ? "Todo el día"
                                : `${formatearHora(restriccion.horaInicio)} - ${formatearHora(restriccion.horaFin)}`}
                        </span>
                    </div>
                    <div>
                        <span className="text-sm text-muted-foreground">Motivo</span>
                        <p className="font-medium">{restriccion.motivo}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Estado</span>
                        <Badge variant={restriccion.activo ? "default" : "outline"}>
                            {restriccion.activo ? "Activa" : "Inactiva"}
                        </Badge>
                    </div>
                    <div className="flex justify-end border-t pt-4">
                        <Button variant="outline" asChild>
                            <Link to="/restricciones">Volver al listado</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}
