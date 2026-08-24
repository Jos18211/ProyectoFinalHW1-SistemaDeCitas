import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { PageHeader } from "../components/PageHeader"
import { EstadoCitaBadge } from "../components/EstadoCitaBadge"
import { Input } from "../components/ui/input"
import { Card, CardContent } from "../components/ui/card"
import { Alert } from "../components/ui/alert"
import { formatearHora } from "../lib/formatearHora"
import { generarFranjasHorarias, obtenerEstadoFranja } from "../lib/agendaDiaria"
import { consultarAgendaDiaria } from "../services/citasService"

function hoyISO() {
    return new Date().toISOString().slice(0, 10)
}

export function AgendaDiariaPage() {
    const [fecha, setFecha] = useState(hoyISO())
    const [agenda, setAgenda] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function cargar() {
            try {
                setLoading(true)
                setError("")
                const data = await consultarAgendaDiaria(fecha)
                setAgenda(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        cargar()
    }, [fecha])

    const horarioDelDia = agenda?.horarios?.[0]
    const franjas = horarioDelDia
        ? generarFranjasHorarias(horarioDelDia.horaInicio, horarioDelDia.horaFin, 60)
        : []

    return (
        <section className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <PageHeader
                    title="Agenda diaria del establecimiento"
                    description="Distribución de citas de todos los artistas para el día seleccionado."
                />
                <Input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="w-full sm:w-auto"
                />
            </div>

            {error && <Alert variant="destructive">{error}</Alert>}
            {loading && <p className="text-center py-10">Cargando agenda...</p>}

            {!loading && agenda && (
                <>
                    {agenda.restriccionesGenerales.length > 0 && (
                        <div className="space-y-2">
                            {agenda.restriccionesGenerales.map((r) => (
                                <Alert key={r.id} variant="destructive">
                                    {r.todoElDia
                                        ? "El establecimiento permanece cerrado todo el día"
                                        : `Cierre parcial de ${formatearHora(r.horaInicio)} a ${formatearHora(r.horaFin)}`}
                                    {" — "}{r.motivo}
                                </Alert>
                            ))}
                        </div>
                    )}

                    {agenda.horarios.length === 0 && (
                        <p className="text-muted-foreground">El establecimiento no atiende este día.</p>
                    )}

                    {agenda.empleados.length === 0 && (
                        <p className="text-muted-foreground">No hay artistas activos.</p>
                    )}

                    {franjas.length > 0 && agenda.empleados.length > 0 && (
                        <Card className="overflow-hidden">
                            <p className="border-b bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground sm:hidden">
                                Desliza hacia los lados para ver a todos los artistas →
                            </p>
                            <CardContent className="overflow-x-auto p-0">
                                <table className="w-full min-w-140 border-collapse text-xs sm:text-sm">
                                    <thead>
                                        <tr className="border-b bg-muted/40">
                                            <th className="sticky left-0 z-10 bg-muted/40 p-2 text-left font-medium sm:p-3">Hora</th>
                                            {agenda.empleados.map((empleado) => (
                                                <th key={empleado.id} className="p-2 text-left font-medium sm:p-3">
                                                    {empleado.usuario.nombre} {empleado.usuario.primerApellido}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {franjas.map((franja) => (
                                            <tr key={franja.desde} className="border-b last:border-0">
                                                <td className="sticky left-0 z-10 bg-card p-2 font-medium text-muted-foreground sm:p-3">
                                                    {franja.desde} - {franja.hasta}
                                                </td>
                                                {agenda.empleados.map((empleado) => {
                                                    const estado = obtenerEstadoFranja(franja, empleado, agenda.restriccionesGenerales)
                                                    return (
                                                        <td key={empleado.id} className="p-2 sm:p-3">
                                                            {estado.tipo === "disponible" && (
                                                                <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                                                                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> Disponible
                                                                </span>
                                                            )}
                                                            {estado.tipo === "restriccion" && (
                                                                <span className="inline-flex items-center gap-1.5 text-red-600 dark:text-red-400">
                                                                    <span className="h-2 w-2 rounded-full bg-red-500" /> Restricción
                                                                </span>
                                                            )}
                                                            {estado.tipo === "cita" && (
                                                                <Link
                                                                    to={`/citas/${estado.cita.id}`}
                                                                    className="flex flex-col gap-1 rounded-md bg-primary/10 px-2 py-1 hover:bg-primary/20"
                                                                >
                                                                    <span className="font-medium">
                                                                        {estado.cita.cliente.nombre} {estado.cita.cliente.primerApellido}
                                                                    </span>
                                                                    <span className="text-xs text-muted-foreground">{estado.cita.servicio.nombre}</span>
                                                                    <EstadoCitaBadge nombreEstado={estado.cita.estadoCita.nombre} />
                                                                </Link>
                                                            )}
                                                        </td>
                                                    )
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>
                    )}
                </>
            )}
        </section>
    )
}
