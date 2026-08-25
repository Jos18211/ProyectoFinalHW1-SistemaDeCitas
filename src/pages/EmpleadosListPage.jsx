import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"
import { RotateCcw, Search, X } from "lucide-react"

import { PageHeader } from "../components/PageHeader"
import { EstadoBadge } from "../components/EstadoBadge"
import { Avatar } from "../components/Avatar"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Alert } from "../components/ui/alert"
import { Badge } from "../components/ui/badge"
import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { useAuth } from "../context/AuthContext"
import { listarEmpleados, cambiarEstadoEmpleado } from "../services/empleadosService"
import { listarEspecialidades } from "../services/especialidadesService"

export function EmpleadosListPage() {
    const { rol } = useAuth()
    const esAdministrador = rol === "Administrador"

    const [empleados, setEmpleados] = useState([])
    const [especialidades, setEspecialidades] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [busqueda, setBusqueda] = useState("")
    const [estadoFiltro, setEstadoFiltro] = useState("todos")
    const [especialidadFiltro, setEspecialidadFiltro] = useState("todas")

    const empleadosFiltrados = useMemo(() => {
        const termino = busqueda.trim().toLowerCase()
        return empleados.filter((empleado) => {
            const coincideTermino =
                !termino ||
                [empleado.usuario.nombre, empleado.usuario.primerApellido, empleado.codigoEmpleado].some((campo) =>
                    campo?.toLowerCase().includes(termino)
                )

            const coincideEstado =
                estadoFiltro === "todos" ||
                (estadoFiltro === "activos" ? empleado.activo : !empleado.activo)

            const coincideEspecialidad =
                especialidadFiltro === "todas" || String(empleado.especialidadId) === especialidadFiltro

            return coincideTermino && coincideEstado && coincideEspecialidad
        })
    }, [empleados, busqueda, estadoFiltro, especialidadFiltro])

    const hayFiltrosActivos = busqueda !== "" || estadoFiltro !== "todos" || especialidadFiltro !== "todas"

    function limpiarFiltros() {
        setBusqueda("")
        setEstadoFiltro("todos")
        setEspecialidadFiltro("todas")
    }

    useEffect(() => {
        cargarEmpleados()
        listarEspecialidades()
            .then(setEspecialidades)
            .catch(() => setEspecialidades([]))
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
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <PageHeader title="Empleados" description="Artistas del estudio y sus servicios asignados." />
                {esAdministrador && (
                    <Button asChild>
                        <Link to="/empleados/nuevo">Nuevo empleado</Link>
                    </Button>
                )}
            </div>

            {!error && empleados.length > 0 && (
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                    <div className="relative max-w-sm flex-1 sm:min-w-55">
                        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <label htmlFor="busqueda-empleados" className="sr-only">
                            Buscar empleados por nombre, apellido o código
                        </label>
                        <Input
                            id="busqueda-empleados"
                            type="search"
                            placeholder="Buscar empleados..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="pl-8 pr-8"
                        />
                        {busqueda && (
                            <button
                                type="button"
                                onClick={() => setBusqueda("")}
                                aria-label="Limpiar búsqueda"
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    <Select value={estadoFiltro} onValueChange={setEstadoFiltro}>
                        <SelectTrigger aria-label="Filtrar por estado" className="w-full sm:w-48">
                            <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todos los estados</SelectItem>
                            <SelectItem value="activos">Activos</SelectItem>
                            <SelectItem value="inactivos">Inactivos</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={especialidadFiltro} onValueChange={setEspecialidadFiltro}>
                        <SelectTrigger aria-label="Filtrar por especialidad" className="w-full sm:w-48">
                            <SelectValue placeholder="Especialidad" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todas">Todas las especialidades</SelectItem>
                            {especialidades.map((especialidad) => (
                                <SelectItem key={especialidad.id} value={String(especialidad.id)}>
                                    {especialidad.nombre}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {hayFiltrosActivos && (
                        <Button variant="ghost" size="sm" onClick={limpiarFiltros} className="gap-1.5">
                            <RotateCcw className="h-4 w-4" />
                            Limpiar filtros
                        </Button>
                    )}
                </div>
            )}

            {error && <Alert variant="destructive">{error}</Alert>}
            {!error && empleados.length === 0 && (
                <p className="text-muted-foreground">Todavía no hay empleados registrados.</p>
            )}
            {!error && empleados.length > 0 && empleadosFiltrados.length === 0 && (
                <p className="text-muted-foreground">
                    {busqueda
                        ? `Ningún empleado coincide con "${busqueda}".`
                        : "Ningún empleado coincide con los filtros seleccionados."}
                </p>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {empleadosFiltrados.map((empleado) => (
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
