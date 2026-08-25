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
import {
    listarAdicionales,
    cambiarEstadoAdicional,
} from "../services/serviciosAdicionalesService"

export function AdicionalesListPage() {
    const { rol } = useAuth()
    const esAdministrador = rol === "Administrador"

    const [adicionales, setAdicionales] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [busqueda, setBusqueda] = useState("")
    const [estadoFiltro, setEstadoFiltro] = useState("todos")
    const [orden, setOrden] = useState("nombre-asc")

    const adicionalesFiltrados = useMemo(() => {
        const termino = busqueda.trim().toLowerCase()
        const filtrados = adicionales.filter((adicional) => {
            const coincideTermino =
                !termino ||
                adicional.nombre.toLowerCase().includes(termino) ||
                adicional.descripcion?.toLowerCase().includes(termino)

            const coincideEstado =
                estadoFiltro === "todos" ||
                (estadoFiltro === "activos" ? adicional.activo : !adicional.activo)

            return coincideTermino && coincideEstado
        })

        const ordenados = [...filtrados]
        switch (orden) {
            case "nombre-desc":
                ordenados.sort((a, b) => b.nombre.localeCompare(a.nombre))
                break
            case "precio-asc":
                ordenados.sort((a, b) => Number(a.precio) - Number(b.precio))
                break
            case "precio-desc":
                ordenados.sort((a, b) => Number(b.precio) - Number(a.precio))
                break
            default:
                ordenados.sort((a, b) => a.nombre.localeCompare(b.nombre))
        }
        return ordenados
    }, [adicionales, busqueda, estadoFiltro, orden])

    const hayFiltrosActivos = busqueda !== "" || estadoFiltro !== "todos"

    function limpiarFiltros() {
        setBusqueda("")
        setEstadoFiltro("todos")
    }

    useEffect(() => {
        cargarAdicionales()
    }, [])

    async function cargarAdicionales() {
        try {
            setLoading(true)
            setError("")
            const data = await listarAdicionales()
            setAdicionales(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    async function handleToggleEstado(adicional) {
        try {
            await cambiarEstadoAdicional(adicional.id, !adicional.activo)
            toast.success(
                adicional.activo
                    ? "Adicional desactivado correctamente."
                    : "Adicional activado correctamente."
            )
            cargarAdicionales()
        } catch (err) {
            toast.error(err.message)
        }
    }

    if (loading) {
        return <p className="text-center py-10">Cargando servicios adicionales...</p>
    }

    return (
        <section className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <PageHeader
                    title="Servicios adicionales"
                    description="Extras que un cliente puede sumar a su cita."
                />
                {esAdministrador && (
                    <Button asChild>
                        <Link to="/adicionales/nuevo">Nuevo adicional</Link>
                    </Button>
                )}
            </div>

            {!error && adicionales.length > 0 && (
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                    <div className="relative max-w-sm flex-1 sm:min-w-55">
                        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <label htmlFor="busqueda-adicionales" className="sr-only">
                            Buscar servicios adicionales por nombre o descripción
                        </label>
                        <Input
                            id="busqueda-adicionales"
                            type="search"
                            placeholder="Buscar adicionales..."
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

                    <Select value={orden} onValueChange={setOrden}>
                        <SelectTrigger aria-label="Ordenar por" className="w-full sm:w-48">
                            <SelectValue placeholder="Ordenar por" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="nombre-asc">Nombre (A-Z)</SelectItem>
                            <SelectItem value="nombre-desc">Nombre (Z-A)</SelectItem>
                            <SelectItem value="precio-asc">Precio (menor a mayor)</SelectItem>
                            <SelectItem value="precio-desc">Precio (mayor a menor)</SelectItem>
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

            {!error && adicionales.length === 0 && (
                <p className="text-muted-foreground">Todavía no hay servicios adicionales registrados.</p>
            )}
            {!error && adicionales.length > 0 && adicionalesFiltrados.length === 0 && (
                <p className="text-muted-foreground">
                    {busqueda
                        ? `Ningún adicional coincide con "${busqueda}".`
                        : "Ningún adicional coincide con los filtros seleccionados."}
                </p>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {adicionalesFiltrados.map((adicional) => (
                    <Card key={adicional.id}>
                        <CardContent className="space-y-3 p-5">
                            <div className="flex items-start justify-between gap-2">
                                <h3 className="font-semibold">{adicional.nombre}</h3>
                                <EstadoBadge activo={adicional.activo} />
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {adicional.descripcion}
                            </p>
                            <p className="text-lg font-bold text-primary">
                                {formatearMoneda(Number(adicional.precio))}
                            </p>
                            <div className="flex flex-wrap gap-2 pt-2">
                                <Button variant="outline" size="sm" asChild>
                                    <Link to={`/adicionales/${adicional.id}`}>Ver detalle</Link>
                                </Button>
                                {esAdministrador && (
                                    <>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link to={`/adicionales/${adicional.id}/editar`}>Editar</Link>
                                        </Button>
                                        <Button
                                            variant={adicional.activo ? "destructive" : "default"}
                                            size="sm"
                                            onClick={() => handleToggleEstado(adicional)}
                                        >
                                            {adicional.activo ? "Desactivar" : "Activar"}
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
