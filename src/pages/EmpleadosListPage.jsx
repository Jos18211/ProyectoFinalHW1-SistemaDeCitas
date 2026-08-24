import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"

import { PageHeader } from "../components/PageHeader"
import { EstadoBadge } from "../components/EstadoBadge"
import { Avatar } from "../components/Avatar"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Alert } from "../components/ui/alert"
import { Badge } from "../components/ui/badge"
import { useAuth } from "../context/AuthContext"
import { listarEmpleados, cambiarEstadoEmpleado } from "../services/empleadosService"

export function EmpleadosListPage() {
    const { rol } = useAuth()
    const esAdministrador = rol === "Administrador"

    const [empleados, setEmpleados] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        cargarEmpleados()
    }, [])

    async function cargarEmpleados() {
        try {
            setLoading(true)
            setError("")
            const data = await listarEmpleados()
            setEmpleados(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    async function handleToggleEstado(empleado) {
        try {
            await cambiarEstadoEmpleado(empleado.id, !empleado.activo)
            toast.success(
                empleado.activo ? "Empleado desactivado correctamente." : "Empleado activado correctamente."
            )
            cargarEmpleados()
        } catch (err) {
            toast.error(err.message)
        }
    }

    if (loading) return <p className="text-center py-10">Cargando empleados...</p>

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <PageHeader title="Empleados" description="Artistas del estudio y sus servicios asignados." />
                {esAdministrador && (
                    <Button asChild>
                        <Link to="/empleados/nuevo">Nuevo empleado</Link>
                    </Button>
                )}
            </div>

            {error && <Alert variant="destructive">{error}</Alert>}
            {!error && empleados.length === 0 && (
                <p className="text-muted-foreground">Todavía no hay empleados registrados.</p>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {empleados.map((empleado) => (
                    <Card key={empleado.id}>
                        <CardContent className="space-y-3 p-5">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-3">
                                    <Avatar
                                        nombre={empleado.usuario.nombre}
                                        primerApellido={empleado.usuario.primerApellido}
                                    />
                                    <div>
                                        <h3 className="font-semibold">
                                            {empleado.usuario.nombre} {empleado.usuario.primerApellido}
                                        </h3>
                                        <p className="text-xs text-muted-foreground">{empleado.codigoEmpleado}</p>
                                    </div>
                                </div>
                                <EstadoBadge activo={empleado.activo} />
                            </div>
                            <Badge variant="outline">{empleado.especialidad?.nombre}</Badge>
                            <p className="text-sm text-muted-foreground">
                                {empleado.servicios.length} servicio(s) asignado(s) · {empleado._count?.citas ?? 0} cita(s)
                            </p>
                            <div className="flex flex-wrap gap-2 pt-2">
                                <Button variant="outline" size="sm" asChild>
                                    <Link to={`/empleados/${empleado.id}`}>Ver detalle</Link>
                                </Button>
                                {esAdministrador && (
                                    <>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link to={`/empleados/${empleado.id}/editar`}>Editar</Link>
                                        </Button>
                                        <Button
                                            variant={empleado.activo ? "destructive" : "default"}
                                            size="sm"
                                            onClick={() => handleToggleEstado(empleado)}
                                        >
                                            {empleado.activo ? "Desactivar" : "Activar"}
                                        </Button>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    )
}
