import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { PageHeader } from "../components/PageHeader"
import { EstadoCitaBadge } from "../components/EstadoCitaBadge"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Alert } from "../components/ui/alert"
import { useAuth } from "../context/AuthContext"
import { formatearMoneda } from "../lib/ticketPricing"
import { formatearHora } from "../lib/formatearHora"
import {
    listarCitas,
    listarCitasPorCliente,
    listarCitasPorEmpleado,
} from "../services/citasService"

function formatearFecha(fechaIso) {
    return new Date(fechaIso).toLocaleDateString("es-CR", { timeZone: "UTC" })
}

export function CitasListPage() {
    const { usuario, rol } = useAuth()
    const esAdministrador = rol === "Administrador"
    const esEmpleado = rol === "Empleado"

    const [citas, setCitas] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function cargar() {
            try {
                setLoading(true)
                setError("")
                let data
                if (esAdministrador) {
                    data = await listarCitas()
                } else if (esEmpleado) {
                    data = await listarCitasPorEmpleado(usuario.empleado.id)
                } else {
                    data = await listarCitasPorCliente(usuario.id)
                }
                setCitas(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        if (usuario) cargar()
    }, [usuario, esAdministrador, esEmpleado])

    if (loading) return <p className="text-center py-10">Cargando citas...</p>

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <PageHeader
                    title="Citas"
                    description={
                        esAdministrador
                            ? "Todas las citas registradas."
                            : esEmpleado
                                ? "Citas asignadas a ti."
                                : "Tus citas."
                    }
                />
                {(esAdministrador || esEmpleado) && (
                    <Button asChild>
                        <Link to="/citas/nueva">Nueva cita</Link>
                    </Button>
                )}
            </div>

            {error && <Alert variant="destructive">{error}</Alert>}
            {!error && citas.length === 0 && (
                <p className="text-muted-foreground">No hay citas registradas todavía.</p>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {citas.map((cita) => (
                    <Card key={cita.id}>
                        <CardContent className="space-y-3 p-5">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <p className="font-semibold">{cita.servicio.nombre}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatearFecha(cita.fecha)} · {formatearHora(cita.horaInicio)} - {formatearHora(cita.horaFin)}
                                    </p>
                                </div>
                                <EstadoCitaBadge nombreEstado={cita.estadoCita.nombre} />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Cliente: {cita.cliente.nombre} {cita.cliente.primerApellido}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Artista: {cita.empleado.usuario.nombre} {cita.empleado.usuario.primerApellido}
                            </p>
                            <p className="text-sm font-bold text-primary">{formatearMoneda(Number(cita.costoTotal))}</p>
                            <Button variant="outline" size="sm" asChild>
                                <Link to={`/citas/${cita.id}`}>Ver detalle</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    )
}
