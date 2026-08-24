import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"

import { PageHeader } from "../components/PageHeader"
import { EmpleadoForm } from "../components/EmpleadoForm"
import { Alert } from "../components/ui/alert"
import { obtenerEmpleadoPorId, actualizarEmpleado } from "../services/empleadosService"
import { listarUsuarios } from "../services/usuariosService"
import { listarEspecialidades } from "../services/especialidadesService"
import { listarServiciosActivos } from "../services/serviciosService"

export function EditEmpleadoPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [empleado, setEmpleado] = useState(null)
    const [usuarios, setUsuarios] = useState([])
    const [especialidades, setEspecialidades] = useState([])
    const [servicios, setServicios] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function cargarDatos() {
            try {
                setLoading(true)
                const [empleadoData, usuariosData, especialidadesData, serviciosData] = await Promise.all([
                    obtenerEmpleadoPorId(id),
                    listarUsuarios("Empleado"),
                    listarEspecialidades(),
                    listarServiciosActivos(),
                ])
                setEmpleado(empleadoData)
                setUsuarios(
                    usuariosData.filter(
                        (usuario) => !usuario.empleado || usuario.empleado.id === empleadoData.id
                    )
                )
                setEspecialidades(especialidadesData)
                setServicios(serviciosData)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        cargarDatos()
    }, [id])

    async function handleActualizar(formData) {
        try {
            const payload = {
                ...formData,
                descripcion: formData.descripcion?.trim() ? formData.descripcion.trim() : null,
            }
            const actualizado = await actualizarEmpleado(id, payload)
            toast.success(`El empleado "${actualizado.codigoEmpleado}" fue actualizado correctamente.`)
            navigate("/empleados")
        } catch (err) {
            toast.error(err.message)
        }
    }

    if (loading) return <p className="text-center py-10">Cargando empleado...</p>
    if (error) return <Alert variant="destructive">{error}</Alert>
    if (!empleado) return null

    return (
        <section className="space-y-6">
            <PageHeader title="Editar empleado" description="Modifique la información y guarde los cambios." />
            <EmpleadoForm
                onSubmit={handleActualizar}
                usuarios={usuarios}
                especialidades={especialidades}
                servicios={servicios}
                initialData={empleado}
                submitText="Guardar cambios"
            />
        </section>
    )
}
