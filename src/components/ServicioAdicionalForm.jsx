import PropTypes from "prop-types"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { servicioAdicionalSchema } from "../schemas/servicioAdicionalSchema"
import { FormError } from "./FormError"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "./ui/card"

export function ServicioAdicionalForm({ onSubmit, initialData = null, submitText = "Guardar" }) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(servicioAdicionalSchema),
        mode: "onTouched",
        defaultValues: {
            nombre: initialData?.nombre || "",
            descripcion: initialData?.descripcion || "",
            precio: initialData?.precio ? Number(initialData.precio) : "",
        },
    })

    return (
        <Card className="mx-auto max-w-xl">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Datos del adicional</CardTitle>
                <CardDescription>
                    Este servicio incrementa el costo total de la cita, pero no su duración.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="grid gap-4">
                    <div>
                        <label htmlFor="nombre" className="mb-2 block text-sm font-medium">Nombre</label>
                        <Input
                            id="nombre"
                            placeholder="Ej: Kit de cuidado posterior"
                            className={errors.nombre ? "border-destructive" : ""}
                            {...register("nombre")}
                        />
                        <FormError message={errors.nombre?.message} />
                    </div>
                    <div>
                        <label htmlFor="descripcion" className="mb-2 block text-sm font-medium">Descripción</label>
                        <Textarea
                            id="descripcion"
                            rows={3}
                            placeholder="Describa brevemente el adicional"
                            className={errors.descripcion ? "border-destructive" : ""}
                            {...register("descripcion")}
                        />
                        <FormError message={errors.descripcion?.message} />
                    </div>
                    <div>
                        <label htmlFor="precio" className="mb-2 block text-sm font-medium">Precio (₡)</label>
                        <Input
                            id="precio"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="Ej: 8000"
                            className={errors.precio ? "border-destructive" : ""}
                            {...register("precio")}
                        />
                        <FormError message={errors.precio?.message} />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-3 border-t pt-6">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Guardando..." : submitText}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}

ServicioAdicionalForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    initialData: PropTypes.object,
    submitText: PropTypes.string,
}
