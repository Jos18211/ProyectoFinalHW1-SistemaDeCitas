import { z } from "zod"

export const servicioAdicionalSchema = z.object({
    nombre: z.string()
        .trim()
        .min(3, "El nombre debe tener al menos 3 caracteres.")
        .max(120, "El nombre no debe superar 120 caracteres."),
    descripcion: z.string()
        .trim()
        .min(10, "La descripción debe tener al menos 10 caracteres.")
        .max(500, "La descripción no debe superar 500 caracteres."),
    precio: z.coerce.number({ message: "El precio es obligatorio y debe ser numérico." })
        .nonnegative("El precio debe ser mayor o igual a cero.")
        .max(99999999.99, "El precio no puede superar 99,999,999.99."),
})
