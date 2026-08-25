import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"

import { PageHeader } from "../components/PageHeader"
import { EstadoCitaBadge } from "../components/EstadoCitaBadge"
import { CancelarCitaDialog } from "../components/CancelarCitaDialog"
import { CambiarEstadoCitaDialog } from "../components/CambiarEstadoCitaDialog"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Alert } from "../components/ui/alert"
import { useAuth } from "../context/AuthContext"
import { formatearMoneda } from "../lib/ticketPricing"
import { formatearHora } from "../lib/formatearHora"
import { obtenerCitaPorId } from "../services/citasService"

function formatearFecha(fechaIso) {
    return new Date(fechaIso).toLocaleDateString("es-CR", { timeZone: "UTC" })
}

export function CitaDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { usuario, rol } = useAuth()

    const [cita, setCita] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    async function cargarCita() {
        try {
            setLoading(true)
            setError("")
            const data = await obtenerCitaPorId(id)
            const tieneAcceso =
                rol === "Administrador" ||
                (rol === "Empleado" && data.empleadoId === usuario.empleado?.id) ||
                (rol === "Cliente" && data.clienteId === usuario.id)
            if (!tieneAcceso) {
                navigate("/citas", { replace: true })
                return
            }
            setCita(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        cargarCita()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    if (loading) return <p className="text-center py-10">Cargando cita...</p>
    if (error) return <Alert variant="destructive">{error}</Alert>
    if (!cita) return null

    const puedeEditar =
        rol === "Administrador" ||
        (rol === "Empleado" && cita.empleadoId === usuario.empleado?.id)

    // El API expone si el estado actual permite que el propio cliente cancele
    // (ej. permiteCancelacionCliente); si el campo no viene, se usa "Pendiente"
    // como respaldo para no romper la funcionalidad existente.
    const permiteCancelacionCliente =
        cita.estadoCita.permiteCancelacionCliente ??
        cita.estadoCita.permiteCancelacion ??
        (cita.estadoCita.nombre === "Pendiente")

    const puedeCancelar =
        cita.estadoCita.nombre !== "Cancelada" &&
        (
            rol === "Administrador" ||
            (rol === "Empleado" && cita.empleadoId === usuario.empleado?.id) ||
            (rol === "Cliente" && cita.clienteId === usuario.id && permiteCancelacionCliente)
        )

    const puedeCambiarEstado =
        rol !== "Cliente" && cita.estadoCita.nombre !== "Cancelada"

    return (
        <section className="mx-auto max-w-2xl space-y-6">
            <PageHeader title={`Cita #${cita.id}`} description={cita.servicio.nombre} />
            <Card>
                <CardContent className="space-y-4 p-6">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Estado</span>
                        <EstadoCitaBadge nombreEstado={cita.estadoCita.nombre} />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Cliente</span>
                        <span className="font-medium">{cita.cliente.nombre} {cita.cliente.primerApellido}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Artista</span>
                        <span className="font-medium">{cita.empleado.usuario.nombre} {cita.empleado.usuario.primerApellido}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Servicio</span>
                        <span className="font-medium">{cita.servicio.nombre}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Fecha</span>
                        <span className="font-medium">{formatearFecha(cita.fecha)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Horario</span>
                        <span className="font-medium">
                            {formatearHora(cita.horaInicio)} - {formatearHora(cita.horaFin)} ({cita.duracionMinutos} min)
                        </span>
                    </div>
                    {cita.adicionales.length > 0 && (
                        <div>
                            <span className="text-sm text-muted-foreground">Adicionales</span>
                            <ul className="mt-1 list-inside list-disc text-sm">
                                {cita.adicionales.map((adicional) => (
                                    <li key={adicional.id}>
                                        {adicional.nombre} ({formatearMoneda(Number(adicional.precio))})
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div className="flex items-center justify-between border-t pt-4">
                        <span className="text-sm text-muted-foreground">Costo total</span>
                        <span className="text-xl font-bold text-primary">{formatearMoneda(Number(cita.costoTotal))}</span>
                    </div>
                    {cita.observaciones && (
                        <div>
                            <span className="text-sm text-muted-foreground">Observaciones</span>
                            <p className="font-medium">{cita.observaciones}</p>
                        </div>
                    )}
                    {cita.motivoCancelacion && (
                        <div>
                            <span className="text-sm text-muted-foreground">Motivo de cancelación</span>
                            <p className="font-medium">{cita.motivoCancelacion}</p>
                        </div>
                    )}
                    <div className="flex flex-wrap justify-end gap-3 border-t pt-4">
                        <Button variant="outline" asChild>
                            <Link to="/citas">Volver al listado</Link>
                        </Button>
                        {puedeEditar && cita.estadoCita.permiteEdicion && (
                            <Button asChild>
                                <Link to={`/citas/${cita.id}/editar`}>Editar</Link>
                            </Button>
                        )}
                        {puedeCambiarEstado && (
                            <CambiarEstadoCitaDialog
                                citaId={cita.id}
                                estadoActualId={cita.estadoCita.id}
                                onCambiado={cargarCita}
                            />
                        )}
                        {puedeCancelar && (
                            <CancelarCitaDialog citaId={cita.id} onCancelada={cargarCita} />
                        )}
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}
