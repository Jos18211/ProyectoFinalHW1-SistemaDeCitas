import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { RotateCcw, Search, X } from "lucide-react"

import { PageHeader } from "../components/PageHeader"
import { EstadoCitaBadge } from "../components/EstadoCitaBadge"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Alert } from "../components/ui/alert"
import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { useAuth } from "../context/AuthContext"
import { formatearMoneda } from "../lib/ticketPricing"
import { formatearHora } from "../lib/formatearHora"
import {
    listarCitas,
    listarCitasPorCliente,
    listarCitasPorEmpleado,
} from "../services/citasService"
import { listarServicios } from "../services/serviciosService"
import { listarEspecialidades } from "../services/especialidadesService"
import { listarEmpleados } from "../services/empleadosService"

function formatearFecha(fechaIso) {
    return new Date(fechaIso).toLocaleDateString("es-CR", { timeZone: "UTC" })
}

export function CitasListPage() {
    const { usuario, rol } = useAuth()
    const esAdministrador = rol === "Administrador"
    const esEmpleado = rol === "Empleado"
    const esCliente = rol === "Cliente"
    const muestraFiltrosAvanzados = esAdministrador || esCliente

    const [citas, setCitas] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [busqueda, setBusqueda] = useState("")

    const [especialidades, setEspecialidades] = useState([])
    const [empleados, setEmpleados] = useState([])
    const [mapaServicioEspecialidad, setMapaServicioEspecialidad] = useState({})
    const [categoriaFiltro, setCategoriaFiltro] = useState("todas")
    const [artistaFiltro, setArtistaFiltro] = useState("todos")
    const [estadoFiltro, setEstadoFiltro] = useState("todos")
    const [orden, setOrden] = useState("fecha-desc")

    const estadosDisponibles = useMemo(
        () => [...new Set(citas.map((cita) => cita.estadoCita.nombre))],
        [citas]
    )

    const citasFiltradas = useMemo(() => {
        const termino = busqueda.trim().toLowerCase()
        const filtradas = citas.filter((cita) => {
            const coincideTermino =
                !termino ||
                [
                    cita.servicio.nombre,
                    cita.cliente.nombre,
                    cita.cliente.primerApellido,
                    cita.empleado.usuario.nombre,
                    cita.empleado.usuario.primerApellido,
                    cita.estadoCita.nombre,
                ].some((campo) => campo?.toLowerCase().includes(termino))

            const coincideCategoria =
                categoriaFiltro === "todas" ||
                String(mapaServicioEspecialidad[cita.servicio.id]) === categoriaFiltro

            const coincideArtista =
                artistaFiltro === "todos" || String(cita.empleado.id) === artistaFiltro

            const coincideEstado =
                estadoFiltro === "todos" || cita.estadoCita.nombre === estadoFiltro

            return coincideTermino && coincideCategoria && coincideArtista && coincideEstado
        })

        function claveFechaHora(cita) {
            return `${cita.fecha.slice(0, 10)}T${cita.horaInicio.slice(11, 19)}`
        }

        const ordenadas = [...filtradas]
        switch (orden) {
            case "fecha-asc":
                ordenadas.sort((a, b) => claveFechaHora(a).localeCompare(claveFechaHora(b)))
                break
            case "costo-desc":
                ordenadas.sort((a, b) => Number(b.costoTotal) - Number(a.costoTotal))
                break
            case "costo-asc":
                ordenadas.sort((a, b) => Number(a.costoTotal) - Number(b.costoTotal))
                break
            default:
                ordenadas.sort((a, b) => claveFechaHora(b).localeCompare(claveFechaHora(a)))
        }
        return ordenadas
    }, [citas, busqueda, categoriaFiltro, artistaFiltro, estadoFiltro, orden, mapaServicioEspecialidad])

    const hayFiltrosActivos =
        busqueda !== "" || categoriaFiltro !== "todas" || artistaFiltro !== "todos" || estadoFiltro !== "todos"

    function limpiarFiltros() {
        setBusqueda("")
        setCategoriaFiltro("todas")
        setArtistaFiltro("todos")
        setEstadoFiltro("todos")
    }

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

    useEffect(() => {
        if (!muestraFiltrosAvanzados) return
        async function cargarFiltros() {
            try {
                const [servicios, especialidadesData, empleadosData] = await Promise.all([
                    listarServicios(),
                    listarEspecialidades(),
                    listarEmpleados(),
                ])
                setEspecialidades(especialidadesData)
                setEmpleados(empleadosData)
                setMapaServicioEspecialidad(
                    Object.fromEntries(servicios.map((servicio) => [servicio.id, servicio.especialidadId]))
                )
            } catch {
                // Si fallan los datos de referencia, simplemente no se muestran los combos con opciones;
                // la búsqueda por texto sigue funcionando igual.
            }
        }
        cargarFiltros()
    }, [muestraFiltrosAvanzados])

    if (loading) return <p className="text-center py-10">Cargando citas...</p>

    return (
        <section className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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

            {!error && citas.length > 0 && (
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                    <div className="relative max-w-sm flex-1 sm:min-w-55">
                        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <label htmlFor="busqueda-citas" className="sr-only">
                            Buscar citas por servicio, cliente, artista o estado
                        </label>
                        <Input
                            id="busqueda-citas"
                            type="search"
                            placeholder="Buscar citas..."
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
                            {estadosDisponibles.map((estado) => (
                                <SelectItem key={estado} value={estado}>
                                    {estado}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {muestraFiltrosAvanzados && (
                        <>
                            <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
                                <SelectTrigger aria-label="Filtrar por categoría" className="w-full sm:w-48">
                                    <SelectValue placeholder="Categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todas">Todas las categorías</SelectItem>
                                    {especialidades.map((especialidad) => (
                                        <SelectItem key={especialidad.id} value={String(especialidad.id)}>
                                            {especialidad.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={artistaFiltro} onValueChange={setArtistaFiltro}>
                                <SelectTrigger aria-label="Filtrar por artista" className="w-full sm:w-48">
                                    <SelectValue placeholder="Artista" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">Todos los artistas</SelectItem>
                                    {empleados.map((empleado) => (
                                        <SelectItem key={empleado.id} value={String(empleado.id)}>
                                            {empleado.usuario.nombre} {empleado.usuario.primerApellido}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </>
                    )}

                    <Select value={orden} onValueChange={setOrden}>
                        <SelectTrigger aria-label="Ordenar por" className="w-full sm:w-48">
                            <SelectValue placeholder="Ordenar por" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="fecha-desc">Fecha (más reciente)</SelectItem>
                            <SelectItem value="fecha-asc">Fecha (más antigua)</SelectItem>
                            <SelectItem value="costo-desc">Costo (mayor a menor)</SelectItem>
                            <SelectItem value="costo-asc">Costo (menor a mayor)</SelectItem>
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
            {!error && citas.length === 0 && (
                <p className="text-muted-foreground">No hay citas registradas todavía.</p>
            )}
            {!error && citas.length > 0 && citasFiltradas.length === 0 && (
                <p className="text-muted-foreground">
                    {busqueda
                        ? `Ninguna cita coincide con "${busqueda}".`
                        : "Ninguna cita coincide con los filtros seleccionados."}
                </p>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {citasFiltradas.map((cita) => (
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
