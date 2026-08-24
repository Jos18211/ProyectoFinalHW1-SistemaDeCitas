import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

import { PageHeader } from "../components/PageHeader"
import { ServicioForm } from "../components/ServicioForm"
import { Alert } from "../components/ui/alert"
import { crearServicio } from "../services/serviciosService"
import { listarEspecialidades } from "../services/especialidadesService"
import { subirImagen } from "../services/imagenesService"

export function CreateServicioPage() {
    const navigate = useNavigate()
    const [especialidades, setEspecialidades] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function cargarEspecialidades() {
            try {
                const data = await listarEspecialidades()
                setEspecialidades(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        cargarEspecialidades()
    }, [])

    async function handleCrear({ archivoImagen, ...datos }) {
        try {
            const nombreImagen = await subirImagen(archivoImagen)
            const nuevo = await crearServicio({ ...datos, imagen: nombreImagen })
            toast.success(`El servicio "${nuevo.nombre}" fue creado correctamente.`)
            navigate("/servicios")
        } catch (err) {
            toast.error(err.message)
        }
    }

    if (loading) return <p className="text-center py-10">Cargando formulario...</p>

    return (
        <section className="space-y-6">
            <PageHeader title="Nuevo servicio" description="Complete la información y guarde los datos en el API." />
            {error && <Alert variant="destructive">{error}</Alert>}
            <ServicioForm onSubmit={handleCrear} especialidades={especialidades} submitText="Registrar servicio" />
        </section>
    )
}
