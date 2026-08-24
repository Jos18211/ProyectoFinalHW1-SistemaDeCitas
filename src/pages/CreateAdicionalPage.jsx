import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

import { PageHeader } from "../components/PageHeader"
import { ServicioAdicionalForm } from "../components/ServicioAdicionalForm"
import { crearAdicional } from "../services/serviciosAdicionalesService"

export function CreateAdicionalPage() {
    const navigate = useNavigate()

    async function handleCrear(formData) {
        try {
            const nuevo = await crearAdicional(formData)
            toast.success(`El adicional "${nuevo.nombre}" fue creado correctamente.`)
            navigate("/adicionales")
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <section className="space-y-6">
            <PageHeader
                title="Nuevo servicio adicional"
                description="Complete la información y guarde los datos en el API."
            />
            <ServicioAdicionalForm onSubmit={handleCrear} submitText="Registrar adicional" />
        </section>
    )
}
