import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"

import { RotateCcw } from "lucide-react"

import { PageHeader } from "../components/PageHeader"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Alert } from "../components/ui/alert"
import { Badge } from "../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { formatearHora } from "../lib/formatearHora"
import { listarRestriccionesHorario } from "../services/restriccionesHorarioService"

export function RestriccionesListPage() {
    const [restricciones, setRestricciones] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [estadoFiltro, setEstadoFiltro] = useState("todos")

    const restriccionesFiltradas = useMemo(() => {
        if (estadoFiltro === "todos") return restricciones
        return restricciones.filter((restriccion) =>
            estadoFiltro === "activas" ? restriccion.activo : !restriccion.activo
        )
    }, [restricciones, estadoFiltro])

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

            {!error && restricciones.length > 0 && (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Select value={estadoFiltro} onValueChange={setEstadoFiltro}>
                        <SelectTrigger aria-label="Filtrar por estado" className="w-full sm:w-48">
                            <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todos los estados</SelectItem>
                            <SelectItem value="activas">Activas</SelectItem>
                            <SelectItem value="inactivas">Inactivas</SelectItem>
                        </SelectContent>
                    </Select>

                    {estadoFiltro !== "todos" && (
                        <Button variant="ghost" size="sm" onClick={() => setEstadoFiltro("todos")} className="gap-1.5">
                            <RotateCcw className="h-4 w-4" />
                            Limpiar filtros
                        </Button>
                    )}
                </div>
            )}

            {error && <Alert variant="destructive">{error}</Alert>}
            {!error && restricciones.length === 0 && (
                <p className="text-muted-foreground">Todavía no hay restricciones registradas.</p>
            )}
            {!error && restricciones.length > 0 && restriccionesFiltradas.length === 0 && (
                <p className="text-muted-foreground">Ninguna restricción coincide con el filtro seleccionado.</p>
            )}

            <div className="grid gap-4 md:grid-cols-2">
                {restriccionesFiltradas.map((restriccion) => (
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
