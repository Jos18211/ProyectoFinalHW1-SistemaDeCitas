import { useState } from "react"
import PropTypes from "prop-types"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ImagePlus } from "lucide-react"

import { servicioSchema } from "../schemas/servicioSchema"
import { FormError } from "./FormError"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "./ui/card"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "./ui/select"

export function ServicioForm({
    onSubmit,
    especialidades,
    initialData = null,
    submitText = "Guardar",
}) {
    const [imagePreview, setImagePreview] = useState(
        initialData?.imagen
            ? `${import.meta.env.VITE_IMAGE_URL}/${initialData.imagen}`
            : null
    )
    const [imagenError, setImagenError] = useState("")

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(servicioSchema),
        mode: "onTouched",
        defaultValues: {
            nombre: initialData?.nombre || "",
            descripcion: initialData?.descripcion || "",
            precioBase: initialData?.precioBase ? Number(initialData.precioBase) : "",
            duracionMinutos: initialData?.duracionMinutos || "",
            especialidadId: initialData?.especialidadId ? String(initialData.especialidadId) : "",
            imagenArchivo: undefined,
        },
    })

    function handleImageChange(event) {
        const file = event.target.files?.[0]
        if (!file) return
        setImagePreview(URL.createObjectURL(file))
        setImagenError("")
    }

    function handleValidSubmit(formData) {
        const archivo = formData.imagenArchivo?.[0] || null
        if (!initialData && !archivo) {
            setImagenError("Debe seleccionar una imagen para el servicio.")
            return
        }
        const { imagenArchivo, ...resto } = formData
        onSubmit({ ...resto, archivoImagen: archivo })
    }

    return (
        <Card className="mx-auto max-w-3xl">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Datos del servicio</CardTitle>
                <CardDescription>
                    El precio base y la duración se usarán para calcular el costo y la hora de finalización de las citas.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(handleValidSubmit)}>
                <CardContent className="grid gap-5 md:grid-cols-2">
                    <div className="md:col-span-2">
                        <label htmlFor="nombre" className="mb-2 block text-sm font-medium">Nombre</label>
                        <Input
                            id="nombre"
                            placeholder="Ej: Tatuaje pequeño blackwork"
                            className={errors.nombre ? "border-destructive" : ""}
                            {...register("nombre")}
                        />
                        <FormError message={errors.nombre?.message} />
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="descripcion" className="mb-2 block text-sm font-medium">Descripción</label>
                        <Textarea
                            id="descripcion"
                            rows={3}
                            placeholder="Describa el servicio"
                            className={errors.descripcion ? "border-destructive" : ""}
                            {...register("descripcion")}
                        />
                        <FormError message={errors.descripcion?.message} />
                    </div>
                    <div>
                        <label htmlFor="precioBase" className="mb-2 block text-sm font-medium">Precio base (₡)</label>
                        <Input
                            id="precioBase"
                            type="number"
                            step="0.01"
                            min="0.01"
                            className={errors.precioBase ? "border-destructive" : ""}
                            {...register("precioBase")}
                        />
                        <FormError message={errors.precioBase?.message} />
                    </div>
                    <div>
                        <label htmlFor="duracionMinutos" className="mb-2 block text-sm font-medium">Duración (minutos)</label>
                        <Input
                            id="duracionMinutos"
                            type="number"
                            min="15"
                            max="480"
                            className={errors.duracionMinutos ? "border-destructive" : ""}
                            {...register("duracionMinutos")}
                        />
                        <FormError message={errors.duracionMinutos?.message} />
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="especialidadId" className="mb-2 block text-sm font-medium">Especialidad</label>
                        <Controller
                            name="especialidadId"
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger aria-label="Especialidad" className={errors.especialidadId ? "border-destructive" : ""}>
                                        <SelectValue placeholder="Seleccione una especialidad" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {especialidades.map((especialidad) => (
                                            <SelectItem key={especialidad.id} value={String(especialidad.id)}>
                                                {especialidad.nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        <FormError message={errors.especialidadId?.message} />
                    </div>

                    <div className="md:col-span-2">
                        <label htmlFor="imagenArchivo" className="mb-2 flex items-center gap-2 text-sm font-medium">
                            <ImagePlus className="h-4 w-4 text-primary" />
                            Imagen representativa
                        </label>
                        <div className="grid gap-4 rounded-xl border border-dashed bg-muted/30 p-4 md:grid-cols-[200px_1fr]">
                            <div className="flex h-36 items-center justify-center overflow-hidden rounded-lg border bg-background">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Vista previa del servicio"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="text-xs text-muted-foreground">Sin imagen seleccionada</span>
                                )}
                            </div>
                            <div className="flex flex-col justify-center gap-2">
                                <Input
                                    id="imagenArchivo"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    className="hidden"
                                    {...register("imagenArchivo", { onChange: handleImageChange })}
                                />
                                <label
                                    htmlFor="imagenArchivo"
                                    className="inline-flex w-fit cursor-pointer items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                                >
                                    Seleccionar imagen
                                </label>
                                <p className="text-xs text-muted-foreground">
                                    JPG, PNG o WEBP, máximo 2 MB.
                                    {initialData && " Deja este campo vacío para conservar la imagen actual."}
                                </p>
                                <FormError message={errors.imagenArchivo?.message || imagenError} />
                            </div>
                        </div>
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

ServicioForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    especialidades: PropTypes.array.isRequired,
    initialData: PropTypes.object,
    submitText: PropTypes.string,
}
