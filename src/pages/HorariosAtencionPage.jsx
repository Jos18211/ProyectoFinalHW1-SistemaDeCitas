import { useEffect, useState } from "react"

import { PageHeader } from "../components/PageHeader"
import { EstadoBadge } from "../components/EstadoBadge"
import { Card, CardContent } from "../components/ui/card"
import { Alert } from "../components/ui/alert"
import { formatearHora } from "../lib/formatearHora"
import { listarHorariosAtencion } from "../services/horariosAtencionService"

export function HorariosAtencionPage() {
    const [horarios, setHorarios] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function cargar() {
            try {
                setLoading(true)
                setError("")
                const data = await listarHorariosAtencion()
                setHorarios(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        cargar()
    }, [])

    if (loading) return <p className="text-center py-10">Cargando horarios...</p>

    return (
        <section className="space-y-6">
            <PageHeader
                title="Horarios de atención"
                description="Horario general del establecimiento. Todos los empleados lo comparten; solo varía por restricciones puntuales."
            />

            {error && <Alert variant="destructive">{error}</Alert>}
            {!error && horarios.length === 0 && (
                <p className="text-muted-foreground">Todavía no hay horarios registrados.</p>
            )}

            <Card>
                <CardContent className="divide-y p-0">
                    {horarios.map((horario) => (
                        <div key={horario.id} className="flex items-center justify-between px-6 py-4">
                            <span className="font-medium">{horario.diaSemana?.nombre}</span>
                            <span className="text-muted-foreground">
                                {formatearHora(horario.horaInicio)} - {formatearHora(horario.horaFin)}
                            </span>
                            <EstadoBadge activo={horario.activo} />
                        </div>
                    ))}
                </CardContent>
            </Card>

            <p className="text-sm text-muted-foreground">
                Los días que no aparecen en esta lista se consideran cerrados: no se pueden registrar citas en ellos.
            </p>
        </section>
    )
}
