import { z } from "zod"

export const empleadoSchema = z.object({
    usuarioId: z.coerce.number({ message: "Debe seleccionar un usuario." }).int().min(1, "Debe seleccionar un usuario."),
    especialidadId: z.coerce.number({ message: "Debe seleccionar una especialidad." }).int().min(1, "Debe seleccionar una especialidad."),
    codigoEmpleado: z.string()
        .trim()
        .min(3, "El código debe tener al menos 3 caracteres.")
        .max(30, "El código no debe superar 30 caracteres.")
        .regex(/^[A-Za-z0-9_-]+$/, "El código solo puede contener letras, números, guiones y guiones bajos."),
    descripcion: z.string().trim().max(500, "La descripción no debe superar 500 caracteres.").optional().or(z.literal("")),
    servicioIds: z.array(z.coerce.number()).min(1, "Debe asignar al menos un servicio."),
})
