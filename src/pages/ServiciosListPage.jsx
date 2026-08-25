import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"
import { RotateCcw, Search, X } from "lucide-react"

import { PageHeader } from "../components/PageHeader"
import { EstadoBadge } from "../components/EstadoBadge"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Alert } from "../components/ui/alert"
import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { useAuth } from "../context/AuthContext"
import { formatearMoneda } from "../lib/ticketPricing"
import { listarServicios, cambiarEstadoServicio } from "../services/serviciosService"

export function ServiciosListPage() {
    const { rol } = useAuth()
    const esAdministrador = rol === "Administrador"

    const [servicios, setServicios] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [busqueda, setBusqueda] = useState("")
    const [estadoFiltro, setEstadoFiltro] = useState("todos")

    const serviciosFiltrados = useMemo(() => {
        const termino = busqueda.trim().toLowerCase()
        return servicios.filter((servicio) => {
            const coincideTermino =
                !termino ||
                servicio.nombre.toLowerCase().includes(termino) ||
                servicio.descripcion?.toLowerCase().includes(termino)

            const coincideEstado =
                estadoFiltro === "todos" ||
                (estadoFiltro === "activos" ? servicio.activo : !servicio.activo)

            return coincideTermino && coincideEstado
        })
    }, [servicios, busqueda, estadoFiltro])

    const hayFiltrosActivos = busqueda !== "" || estadoFiltro !== "todos"

    function limpiarFiltros() {
        setBusqueda("")
        setEstadoFiltro("todos")
    }

    useEffect(() => {
        cargarServicios()
    }, [])

    async function cargarServicios() {
        try {
            setLoading(true)
            setError("")
            const data = await listarServicios()
            setServicios(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    async function handleToggleEstado(servicio) {
        try {
            await cambiarEstadoServicio(servicio.id, !servicio.activo)
            toast.success(
                servicio.activo ? "Servicio desactivado correctamente." : "Servicio activado correctamente."
            )
            cargarServicios()
        } catch (err) {
            toast.error(err.message)
        }
    }

    if (loading) return <p className="text-center py-10">Cargando servicios...</p>

    return (
        <section className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <PageHeader title="Servicios" description="Servicios principales del estudio." />
                {esAdministrador && (
                    <Button asChild>
                        <Link to="/servicios/nuevo">Nuevo servicio</Link>
                    </Button>
                )}
            </div>

            {!error && servicios.length > 0 && (
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                    <div className="relative max-w-sm flex-1 sm:min-w-55">
                        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <label htmlFor="busqueda-servicios" className="sr-only">
                            Buscar servicios por nombre o descripción
                        </label>
                        <Input
                            id="busqueda-servicios"
                            type="search"
                            placeholder="Buscar servicios..."
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

                    {hayFiltrosActivos && (
                        <Button variant="ghost" size="sm" onClick={limpiarFiltros} className="gap-1.5">
                            <RotateCcw className="h-4 w-4" />
                            Limpiar filtros
                        </Button>
                    )}
                </div>
            )}

            {error && <Alert variant="destructive">{error}</Alert>}
            {!error && servicios.length === 0 && (
                <p className="text-muted-foreground">Todavía no hay servicios registrados.</p>
            )}
            {!error && servicios.length > 0 && serviciosFiltrados.length === 0 && (
                <p className="text-muted-foreground">
                    {busqueda
                        ? `Ningún servicio coincide con "${busqueda}".`
                        : "Ningún servicio coincide con los filtros seleccionados."}
                </p>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {serviciosFiltrados.map((servicio) => (
                    <Card key={servicio.id} className="overflow-hidden">
                        <div className="h-40 w-full overflow-hidden bg-muted">
                            {servicio.imagen ? (
                                <img
                                    src={`${import.meta.env.VITE_IMAGE_URL}/${servicio.imagen}`}
                                    alt={servicio.nombre}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                                    Sin imagen
                                </div>
                            )}
                        </div>
                        <CardContent className="space-y-3 p-5">
                            <div className="flex items-start justify-between gap-2">
                                <h3 className="font-semibold">{servicio.nombre}</h3>
                                <EstadoBadge activo={servicio.activo} />
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">{servicio.descripcion}</p>
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-bold text-primary">
                                    {formatearMoneda(Number(servicio.precioBase))}
                                </span>
                                <span className="text-muted-foreground">{servicio.duracionMinutos} min</span>
                            </div>
                            <div className="flex flex-wrap gap-2 pt-2">
                                <Button variant="outline" size="sm" asChild>
                                    <Link to={`/servicios/${servicio.id}`}>Ver detalle</Link>
                                </Button>
                                {esAdministrador && (
                                    <>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link to={`/servicios/${servicio.id}/editar`}>Editar</Link>
                                        </Button>
                                        <Button
                                            variant={servicio.activo ? "destructive" : "default"}
                                            size="sm"
                                            onClick={() => handleToggleEstado(servicio)}
                                        >
                                            {servicio.activo ? "Desactivar" : "Activar"}
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
