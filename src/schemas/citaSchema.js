import { z } from "zod"

export const citaSchema = z.object({
    clienteId: z.coerce.number({ message: "Debe seleccionar un cliente." }).int().min(1, "Debe seleccionar un cliente."),
    servicioId: z.coerce.number({ message: "Debe seleccionar un servicio." }).int().min(1, "Debe seleccionar un servicio."),
    empleadoId: z.coerce.number({ message: "Debe seleccionar un artista." }).int().min(1, "Debe seleccionar un artista."),
    fecha: z.string().min(1, "Debe seleccionar una fecha.").refine((value) => {
        const seleccionada = new Date(`${value}T00:00:00`)
        const hoy = new Date()
        hoy.setHours(0, 0, 0, 0)
        return seleccionada >= hoy
    }, "La fecha no puede ser pasada."),
    horaInicio: z.string()
        .min(1, "Debe seleccionar una hora de inicio.")
        .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Formato de hora inválido."),
    adicionalIds: z.array(z.coerce.number()).optional().default([]),
    observaciones: z.string().trim().max(500, "Las observaciones no deben superar 500 caracteres.").optional().or(z.literal("")),
})
