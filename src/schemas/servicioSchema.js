import { z } from "zod"

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2 MB, mismo límite que valida el API
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

export const servicioSchema = z.object({
    nombre: z.string()
        .trim()
        .min(3, "El nombre debe tener al menos 3 caracteres.")
        .max(120, "El nombre no debe superar 120 caracteres."),
    descripcion: z.string()
        .trim()
        .min(10, "La descripción debe tener al menos 10 caracteres.")
        .max(500, "La descripción no debe superar 500 caracteres."),
    precioBase: z.coerce.number({ message: "El precio base es obligatorio." })
        .positive("El precio base debe ser mayor a 0."),
    duracionMinutos: z.coerce.number({ message: "La duración es obligatoria." })
        .int("La duración debe ser un número entero.")
        .min(15, "La duración mínima es de 15 minutos.")
        .max(480, "La duración no puede superar 8 horas (480 minutos)."),
    especialidadId: z.coerce.number({ message: "Debe seleccionar una especialidad." })
        .int()
        .min(1, "Debe seleccionar una especialidad."),
    imagenArchivo: z.any()
        .refine((files) => !files || files.length === 0 || files[0]?.size <= MAX_FILE_SIZE, {
            message: "La imagen no debe superar los 2 MB.",
        })
        .refine((files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files[0]?.type), {
            message: "Solo se permiten imágenes JPG, PNG o WEBP.",
        })
        .optional(),
})
