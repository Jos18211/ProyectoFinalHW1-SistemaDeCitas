import { z } from "zod"

export const loginSchema = z.object({
    correo: z.string().min(1, "El correo es obligatorio.").email("Ingrese un correo válido."),
    password: z.string().min(1, "La contraseña es obligatoria."),
})

export const registerSchema = z.object({
    nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres.").max(100),
    primerApellido: z.string().min(2, "El primer apellido debe tener al menos 2 caracteres.").max(100),
    segundoApellido: z.string().min(2, "Debe tener al menos 2 caracteres.").max(100).optional().or(z.literal("")),
    correo: z.string().min(1, "El correo es obligatorio.").email("Ingrese un correo válido.").max(150),
    telefono: z.string().min(8, "El teléfono debe tener al menos 8 caracteres.").max(25).optional().or(z.literal("")),
    password: z.string()
        .min(8, "La contraseña debe tener al menos 8 caracteres.")
        .max(100)
        .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula.")
        .regex(/[a-z]/, "Debe contener al menos una letra minúscula.")
        .regex(/[0-9]/, "Debe contener al menos un número.")
        .regex(/[^A-Za-z0-9]/, "Debe contener al menos un carácter especial."),
})
