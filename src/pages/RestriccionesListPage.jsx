import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { PageHeader } from "../components/PageHeader"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Alert } from "../components/ui/alert"
import { Badge } from "../components/ui/badge"
import { formatearHora } from "../lib/formatearHora"
import { listarRestriccionesHorario } from "../services/restriccionesHorarioService"

export function RestriccionesListPage() {
    const [restricciones, setRestricciones] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function cargar() {
            try {
                setLoading(true)
                setError("")
                const data = await listarRestriccionesHorario()
                setRestricciones(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        cargar()
    }, [])

    if (loading) return <p className="text-center py-10">Cargando restricciones...</p>

    return (
        <section className="space-y-6">
            <PageHeader
                title="Restricciones de horario"
                description="Cierres del establecimiento o bloqueos individuales que impiden registrar citas."
            />

            {error && <Alert variant="destructive">{error}</Alert>}
            {!error && restricciones.length === 0 && (
                <p className="text-muted-foreground">Todavía no hay restricciones registradas.</p>
            )}

            <div className="grid gap-4 md:grid-cols-2">
                {restricciones.map((restriccion) => (
                    <Card key={restriccion.id}>
                        <CardContent className="space-y-3 p-5">
                            <div className="flex items-start justify-between gap-2">
                                <Badge variant={restriccion.empleadoId ? "secondary" : "destructive"}>
                                    {restriccion.empleadoId
                                        ? `Empleado: ${restriccion.empleado?.usuario?.nombre} ${restriccion.empleado?.usuario?.primerApellido}`
                                        : "Establecimiento completo"}
                                </Badge>
                                <Badge variant={restriccion.activo ? "default" : "outline"}>
                                    {restriccion.activo ? "Activa" : "Inactiva"}
                                </Badge>
                            </div>
                            <p className="text-sm font-medium">{restriccion.tipoRestriccion?.nombre}</p>
                            <p className="text-sm text-muted-foreground">
                                {new Date(restriccion.fecha).toLocaleDateString("es-CR", { timeZone: "UTC" })} ·{" "}
                                {restriccion.todoElDia
                                    ? "Todo el día"
                                    : `${formatearHora(restriccion.horaInicio)} - ${formatearHora(restriccion.horaFin)}`}
                            </p>
                            <p className="text-sm">{restriccion.motivo}</p>
                            <Button variant="outline" size="sm" asChild>
                                <Link to={`/restricciones/${restriccion.id}`}>Ver detalle</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    )
}
