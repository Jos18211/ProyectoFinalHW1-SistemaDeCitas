import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

import { PageHeader } from "../components/PageHeader"
import { EmpleadoForm } from "../components/EmpleadoForm"
import { Alert } from "../components/ui/alert"
import { listarUsuarios } from "../services/usuariosService"
import { listarEspecialidades } from "../services/especialidadesService"
import { listarServiciosActivos } from "../services/serviciosService"

import { generarSiguienteCodigoEmpleado } from "../lib/empleadoCodigo"
import { crearEmpleado, listarEmpleados } from "../services/empleadosService"


export function CreateEmpleadoPage() {
    const navigate = useNavigate()
    const [usuarios, setUsuarios] = useState([])
    const [especialidades, setEspecialidades] = useState([])
    const [servicios, setServicios] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [codigoSugerido, setCodigoSugerido] = useState("")

    useEffect(() => {
        async function cargarDatos() {
            try {
                
                const [usuariosData, especialidadesData, serviciosData, empleadosData] = await Promise.all([
                    listarUsuarios("Empleado"),
                    listarEspecialidades(),
                    listarServiciosActivos(),
                    listarEmpleados(),
])
                    setUsuarios(usuariosData.filter((usuario) => !usuario.empleado))
                    setEspecialidades(especialidadesData)
                    setServicios(serviciosData)
                    setCodigoSugerido(generarSiguienteCodigoEmpleado(empleadosData))

            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        cargarDatos()
    }, [])

    async function handleCrear(formData) {
        try {
            const payload = {
                ...formData,
                descripcion: formData.descripcion?.trim() ? formData.descripcion.trim() : null,
            }
            const nuevo = await crearEmpleado(payload)
            toast.success(`El empleado "${nuevo.codigoEmpleado}" fue creado correctamente.`)
            navigate("/empleados")
        } catch (err) {
            toast.error(err.message)
        }
    }

    if (loading) return <p className="text-center py-10">Cargando formulario...</p>

    return (
        <section className="space-y-6">
            <PageHeader title="Nuevo empleado" description="Complete la información y asigne sus servicios." />
            {error && <Alert variant="destructive">{error}</Alert>}
            <EmpleadoForm
                onSubmit={handleCrear}
                usuarios={usuarios}
                especialidades={especialidades}
                servicios={servicios}
                codigoSugerido={codigoSugerido}
                submitText="Registrar empleado"
/>

        </section>
    )
}
