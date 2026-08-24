import { useEffect, useRef } from "react"
import PropTypes from "prop-types"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { empleadoSchema } from "../schemas/empleadoSchema"
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
import { Badge } from "./ui/badge"

export function EmpleadoForm({
    onSubmit,
    usuarios,
    especialidades,
    servicios,
    initialData = null,
    codigoSugerido = "",
    submitText = "Guardar",
}) {

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(empleadoSchema),
        mode: "onTouched",
        defaultValues: {
            usuarioId: initialData?.usuarioId ? String(initialData.usuarioId) : "",
            especialidadId: initialData?.especialidadId ? String(initialData.especialidadId) : "",
            codigoEmpleado: initialData?.codigoEmpleado || codigoSugerido,
            descripcion: initialData?.descripcion || "",
            servicioIds: initialData?.servicios
                ? initialData.servicios.map((s) => String(s.id))
                : [],
        },
    })

    const especialidadSeleccionada = watch("especialidadId")
    const isFirstRender = useRef(true)

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }
        setValue("servicioIds", [])
    }, [especialidadSeleccionada, setValue])

    const serviciosFiltrados = servicios.filter(
        (servicio) => String(servicio.especialidadId) === String(especialidadSeleccionada)
    )

    return (
      <Card className="mx-auto max-w-3xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Datos del empleado</CardTitle>
          <CardDescription>
            Los servicios disponibles dependen de la especialidad seleccionada.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="usuarioId"
                className="mb-2 block text-sm font-medium"
              >
                Usuario (empleado)
              </label>
              <Controller
                name="usuarioId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      aria-label="Usuario (empleado)"
                      className={errors.usuarioId ? "border-destructive" : ""}
                    >
                      <SelectValue placeholder="Seleccione un usuario" />
                    </SelectTrigger>
                    <SelectContent>
                      {usuarios.map((usuario) => (
                        <SelectItem key={usuario.id} value={String(usuario.id)}>
                          {usuario.nombre} {usuario.primerApellido} —{" "}
                          {usuario.correo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Solo se muestran usuarios con rol Empleado sin un perfil de
                empleado ya creado.
              </p>
              <FormError message={errors.usuarioId?.message} />
            </div>
            <div>
              <label
                htmlFor="codigoEmpleado"
                className="mb-2 block text-sm font-medium"
              >
                Código de empleado
              </label>
              <Input
                id="codigoEmpleado"
                disabled
                className="bg-muted"
                {...register("codigoEmpleado")}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Se asigna automáticamente de forma consecutiva.
              </p>
              <FormError message={errors.codigoEmpleado?.message} />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="especialidadId"
                className="mb-2 block text-sm font-medium"
              >
                Especialidad
              </label>
              <Controller
                name="especialidadId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      aria-label="Especialidad"
                      className={
                        errors.especialidadId ? "border-destructive" : ""
                      }
                    >
                      <SelectValue placeholder="Seleccione una especialidad" />
                    </SelectTrigger>
                    <SelectContent>
                      {especialidades.map((especialidad) => (
                        <SelectItem
                          key={especialidad.id}
                          value={String(especialidad.id)}
                        >
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
              <label
                htmlFor="descripcion"
                className="mb-2 block text-sm font-medium"
              >
                Descripción (opcional)
              </label>
              <Textarea
                id="descripcion"
                rows={3}
                placeholder="Ej: Especialista en blackwork ornamental, seis años de experiencia."
                className={errors.descripcion ? "border-destructive" : ""}
                {...register("descripcion")}
              />
              <FormError message={errors.descripcion?.message} />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">
                Servicios que puede atender
              </label>
              <div className="rounded-xl border bg-muted/20 p-4">
                {!especialidadSeleccionada && (
                  <p className="text-sm text-muted-foreground">
                    Seleccione primero una especialidad para ver los servicios
                    disponibles.
                  </p>
                )}
                {especialidadSeleccionada &&
                  serviciosFiltrados.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Esta especialidad no tiene servicios activos disponibles.
                    </p>
                  )}
                <div className="flex flex-wrap gap-2">
                  {serviciosFiltrados.map((servicio) => (
                    <label
                      key={servicio.id}
                      className="flex cursor-pointer items-center gap-2 rounded-full border bg-background px-3 py-2 text-sm transition-colors hover:bg-muted"
                    >
                      <input
                        type="checkbox"
                        value={servicio.id}
                        className="h-4 w-4 accent-primary"
                        {...register("servicioIds")}
                      />
                      <Badge variant="secondary">{servicio.nombre}</Badge>
                    </label>
                  ))}
                </div>
                <FormError message={errors.servicioIds?.message} />
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
    );
}

EmpleadoForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    usuarios: PropTypes.array.isRequired,
    especialidades: PropTypes.array.isRequired,
    servicios: PropTypes.array.isRequired,
    initialData: PropTypes.object,
    submitText: PropTypes.string,
    codigoSugerido: PropTypes.string
}
