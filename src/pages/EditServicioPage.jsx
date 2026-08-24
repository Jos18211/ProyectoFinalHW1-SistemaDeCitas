import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"

import { PageHeader } from "../components/PageHeader"
import { ServicioForm } from "../components/ServicioForm"
import { Alert } from "../components/ui/alert"
import { obtenerServicioPorId, actualizarServicio } from "../services/serviciosService"
import { listarEspecialidades } from "../services/especialidadesService"
import { subirImagen } from "../services/imagenesService"

export function EditServicioPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [servicio, setServicio] = useState(null)
    const [especialidades, setEspecialidades] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function cargar() {
            try {
                setLoading(true)
                const [servicioData, especialidadesData] = await Promise.all([
                    obtenerServicioPorId(id),
                    listarEspecialidades(),
                ])
                setServicio(servicioData)
                setEspecialidades(especialidadesData)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        cargar()
    }, [id])

    async function handleActualizar({ archivoImagen, ...datos }) {
        try {
            const nombreImagen = archivoImagen
                ? await subirImagen(archivoImagen, servicio.imagen)
                : servicio.imagen
            const actualizado = await actualizarServicio(id, { ...datos, imagen: nombreImagen })
            toast.success(`El servicio "${actualizado.nombre}" fue actualizado correctamente.`)
            navigate("/servicios")
        } catch (err) {
            toast.error(err.message)
        }
    }

    if (loading) return <p className="text-center py-10">Cargando servicio...</p>
    if (error) return <Alert variant="destructive">{error}</Alert>
    if (!servicio) return null

    return (
        <section className="space-y-6">
            <PageHeader title="Editar servicio" description="Modifique la información y guarde los cambios." />
            <ServicioForm
                onSubmit={handleActualizar}
                especialidades={especialidades}
                initialData={servicio}
                submitText="Guardar cambios"
            />
        </section>
    )
}
