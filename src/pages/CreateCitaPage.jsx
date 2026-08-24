import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

import { PageHeader } from "../components/PageHeader"
import { CitaForm } from "../components/CitaForm"
import { Alert } from "../components/ui/alert"
import { useAuth } from "../context/AuthContext"
import { crearCita } from "../services/citasService"
import { listarUsuarios } from "../services/usuariosService"
import { listarServiciosActivos } from "../services/serviciosService"
import { listarAdicionalesActivos } from "../services/serviciosAdicionalesService"
import { listarEstadosCita } from "../services/estadosCitaService"

export function CreateCitaPage() {
    const navigate = useNavigate()
    const { usuario } = useAuth()

    const [clientes, setClientes] = useState([])
    const [servicios, setServicios] = useState([])
    const [adicionales, setAdicionales] = useState([])
    const [estadoPendienteId, setEstadoPendienteId] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function cargarDatos() {
            try {
                const [clientesData, serviciosData, adicionalesData, estadosData] = await Promise.all([
                    listarUsuarios("Cliente"),
                    listarServiciosActivos(),
                    listarAdicionalesActivos(),
                    listarEstadosCita(),
                ])
                setClientes(clientesData.filter((c) => c.activo))
                setServicios(serviciosData)
                setAdicionales(adicionalesData)
                const pendiente = estadosData.find((estado) => estado.nombre === "Pendiente")
                setEstadoPendienteId(pendiente?.id ?? null)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        cargarDatos()
    }, [])

    async function handleCrear(datos) {
        if (!estadoPendienteId) {
            toast.error("No se encontró el estado 'Pendiente' en el catálogo.")
            return
        }
        try {
            const nueva = await crearCita({
                ...datos,
                estadoCitaId: estadoPendienteId,
                creadoPorUsuarioId: usuario.id,
            })
            toast.success(`Cita #${nueva.id} registrada correctamente.`)
            navigate(`/citas/${nueva.id}`)
        } catch (err) {
            toast.error(err.message)
        }
    }

    if (loading) return <p className="text-center py-10">Cargando formulario...</p>

    return (
        <section className="space-y-6">
            <PageHeader title="Nueva cita" description="Se registrará con estado inicial Pendiente." />
            {error && <Alert variant="destructive">{error}</Alert>}
            <CitaForm
                onSubmit={handleCrear}
                clientes={clientes}
                servicios={servicios}
                adicionales={adicionales}
                submitText="Registrar cita"
            />
        </section>
    )
}
