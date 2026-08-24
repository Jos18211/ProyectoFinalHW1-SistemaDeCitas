import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"

import { PageHeader } from "../components/PageHeader"
import { ServicioAdicionalForm } from "../components/ServicioAdicionalForm"
import { Alert } from "../components/ui/alert"
import {
    obtenerAdicionalPorId,
    actualizarAdicional,
} from "../services/serviciosAdicionalesService"

export function EditAdicionalPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [adicional, setAdicional] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function cargar() {
            try {
                setLoading(true)
                const data = await obtenerAdicionalPorId(id)
                setAdicional(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        cargar()
    }, [id])

    async function handleActualizar(formData) {
        try {
            const actualizado = await actualizarAdicional(id, formData)
            toast.success(`El adicional "${actualizado.nombre}" fue actualizado correctamente.`)
            navigate("/adicionales")
        } catch (err) {
            toast.error(err.message)
        }
    }

    if (loading) return <p className="text-center py-10">Cargando adicional...</p>
    if (error) return <Alert variant="destructive">{error}</Alert>
    if (!adicional) return null

    return (
        <section className="space-y-6">
            <PageHeader
                title="Editar servicio adicional"
                description="Modifique la información y guarde los cambios."
            />
            <ServicioAdicionalForm
                onSubmit={handleActualizar}
                initialData={adicional}
                submitText="Guardar cambios"
            />
        </section>
    )
}
