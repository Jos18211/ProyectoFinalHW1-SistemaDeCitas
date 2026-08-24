import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"

import { PageHeader } from "../components/PageHeader"
import { EstadoBadge } from "../components/EstadoBadge"
import { Avatar } from "../components/Avatar"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent } from "../components/ui/card"
import { Alert } from "../components/ui/alert"
import { Badge } from "../components/ui/badge"
import { useAuth } from "../context/AuthContext"
import {
    obtenerEmpleadoPorId,
    obtenerAgendaEmpleado,
} from "../services/empleadosService"

function hoyISO() {
    return new Date().toISOString().slice(0, 10)
}

export function EmpleadoDetailPage() {
    const { id } = useParams()
    const { rol } = useAuth()
    const esAdministrador = rol === "Administrador"

    const [empleado, setEmpleado] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const [fecha, setFecha] = useState(hoyISO())
    const [agenda, setAgenda] = useState(null)
    const [cargandoAgenda, setCargandoAgenda] = useState(false)
    const [errorAgenda, setErrorAgenda] = useState("")

    useEffect(() => {
        async function cargar() {
            try {
                setLoading(true)
                setError("")
                const data = await obtenerEmpleadoPorId(id)
                setEmpleado(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        cargar()
    }, [id])

    useEffect(() => {
        async function cargarAgenda() {
            try {
                setCargandoAgenda(true)
                setErrorAgenda("")
                const data = await obtenerAgendaEmpleado(id, fecha)
                setAgenda(data)
            } catch (err) {
                setErrorAgenda(err.message)
            } finally {
                setCargandoAgenda(false)
            }
        }
        if (fecha) cargarAgenda()
    }, [id, fecha])

    if (loading) return <p className="text-center py-10">Cargando empleado...</p>
    if (error) return <Alert variant="destructive">{error}</Alert>
    if (!empleado) return null

    return (
        <section className="mx-auto max-w-3xl space-y-6">
            <PageHeader
                title={`${empleado.usuario.nombre} ${empleado.usuario.primerApellido}`}
                description={`Código ${empleado.codigoEmpleado}`}
            />

            <Card>
                <CardContent className="space-y-4 p-6">
                    <div className="flex items-center gap-4 border-b pb-4">
                        <Avatar
                            nombre={empleado.usuario.nombre}
                            primerApellido={empleado.usuario.primerApellido}
                            size="h-16 w-16 text-lg"
                        />
                        <div>
                            <h3 className="text-lg font-semibold">
                                {empleado.usuario.nombre} {empleado.usuario.primerApellido}
                            </h3>
                            <p className="text-sm text-muted-foreground">{empleado.especialidad?.nombre}</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Estado</span>
                        <EstadoBadge activo={empleado.activo} />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Especialidad</span>
                        <Badge variant="outline">{empleado.especialidad?.nombre}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Correo</span>
                        <span className="font-medium">{empleado.usuario.correo}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Citas registradas</span>
                        <span className="font-medium">{empleado.citas?.length ?? 0}</span>
                    </div>
                    {empleado.descripcion && (
                        <div>
                            <span className="text-sm text-muted-foreground">Descripción</span>
                            <p className="font-medium">{empleado.descripcion}</p>
                        </div>
                    )}
                    <div>
                        <span className="mb-2 block text-sm text-muted-foreground">Servicios que puede realizar</span>
                        <div className="flex flex-wrap gap-2">
                            {empleado.servicios.map((servicio) => (
                                <Badge key={servicio.id} variant="secondary">{servicio.nombre}</Badge>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 border-t pt-4">
                        <Button variant="outline" asChild>
                            <Link to="/empleados">Volver al listado</Link>
                        </Button>
                        {esAdministrador && (
                            <Button asChild>
                                <Link to={`/empleados/${empleado.id}/editar`}>Editar</Link>
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="space-y-4 p-6">
                    <div className="flex items-center justify-between gap-4">
                        <h3 className="text-lg font-semibold">Agenda del empleado</h3>
                        <Input
                            type="date"
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                            className="w-auto"
                        />
                    </div>

                    {cargandoAgenda && <p className="text-sm text-muted-foreground">Cargando agenda...</p>}
                    {errorAgenda && <Alert variant="destructive">{errorAgenda}</Alert>}

                    {!cargandoAgenda && !errorAgenda && agenda && (
                        <div className="space-y-4">
                            <div>
                                <h4 className="mb-2 text-sm font-semibold text-muted-foreground">Restricciones del día</h4>
                                {agenda.restricciones.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">Sin restricciones para esta fecha.</p>
                                ) : (
                                    <ul className="space-y-1">
                                        {agenda.restricciones.map((restriccion) => (
                                            <li key={restriccion.id} className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                                {restriccion.todoElDia
                                                    ? "Todo el día"
                                                    : `${restriccion.horaInicio?.slice(11, 16)} - ${restriccion.horaFin?.slice(11, 16)}`}
                                                {" — "}{restriccion.motivo}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div>
                                <h4 className="mb-2 text-sm font-semibold text-muted-foreground">Citas del día</h4>
                                {agenda.citas.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">Sin citas asignadas para esta fecha.</p>
                                ) : (
                                    <ul className="space-y-2">
                                        {agenda.citas.map((cita) => (
                                            <li key={cita.id} className="flex items-center justify-between rounded-md border p-3 text-sm">
                                                <span>
                                                    {cita.horaInicio?.slice(11, 16)} - {cita.horaFin?.slice(11, 16)} · {cita.cliente.nombre} {cita.cliente.primerApellido} · {cita.servicio.nombre}
                                                </span>
                                                <Badge variant="secondary">{cita.estadoCita.nombre}</Badge>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </section>
    )
}
