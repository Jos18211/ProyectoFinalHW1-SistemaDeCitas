import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"

import { PageHeader } from "../components/PageHeader"
import { CitaForm } from "../components/CitaForm"
import { Alert } from "../components/ui/alert"
import { useAuth } from "../context/AuthContext"
import { obtenerCitaPorId, actualizarCita } from "../services/citasService"
import { listarUsuarios } from "../services/usuariosService"
import { listarServiciosActivos } from "../services/serviciosService"
import { listarAdicionalesActivos } from "../services/serviciosAdicionalesService"

export function EditCitaPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { usuario, rol } = useAuth()

    const [cita, setCita] = useState(null)
    const [clientes, setClientes] = useState([])
    const [servicios, setServicios] = useState([])
    const [adicionales, setAdicionales] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function cargarDatos() {
            try {
                setLoading(true)
                const [citaData, clientesData, serviciosData, adicionalesData] = await Promise.all([
                    obtenerCitaPorId(id),
                    listarUsuarios("Cliente"),
                    listarServiciosActivos(),
                    listarAdicionalesActivos(),
                ])

                const puedeEditar =
                    rol === "Administrador" ||
                    (rol === "Empleado" && citaData.empleadoId === usuario.empleado?.id)
                if (!puedeEditar || !citaData.estadoCita.permiteEdicion) {
                    navigate(`/citas/${id}`, { replace: true })
                    return
                }

                setCita(citaData)
                setClientes(clientesData.filter((c) => c.activo))
                const serviciosDisponibles = serviciosData.some((s) => s.id === citaData.servicioId)
                    ? serviciosData
                    : [...serviciosData, citaData.servicio]
                setServicios(serviciosDisponibles)
                setAdicionales(adicionalesData)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        cargarDatos()
    }, [id, rol, usuario, navigate])

    async function handleActualizar(datos) {
        try {
            const actualizada = await actualizarCita(id, datos)
            toast.success(`Cita #${actualizada.id} actualizada correctamente.`)
            navigate(`/citas/${actualizada.id}`)
        } catch (err) {
            toast.error(err.message)
        }
    }

    if (loading) return <p className="text-center py-10">Cargando cita...</p>
    if (error) return <Alert variant="destructive">{error}</Alert>
    if (!cita) return null

    return (
        <section className="space-y-6">
            <PageHeader title={`Editar cita #${cita.id}`} description="Modifique los datos y guarde los cambios." />
            <CitaForm
                onSubmit={handleActualizar}
                clientes={clientes}
                servicios={servicios}
                adicionales={adicionales}
                initialData={cita}
                submitText="Guardar cambios"
            />
        </section>
    )
}
