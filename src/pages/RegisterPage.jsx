import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate, Link } from "react-router-dom"
import toast from "react-hot-toast"

import { registerSchema } from "../schemas/authSchemas"
import { useAuth } from "../context/AuthContext"
import { registrarCliente } from "../services/authService"
import { FormError } from "../components/FormError"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "../components/ui/card"

export function RegisterPage() {
    const { login } = useAuth()
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: zodResolver(registerSchema), mode: "onTouched" })

    async function handleValidSubmit(formData) {
        const payload = {
            nombre: formData.nombre,
            primerApellido: formData.primerApellido,
            correo: formData.correo,
            password: formData.password,
            ...(formData.segundoApellido ? { segundoApellido: formData.segundoApellido } : {}),
            ...(formData.telefono ? { telefono: formData.telefono } : {}),
        }
        try {
            await registrarCliente(payload)
            await login(formData.correo, formData.password)
            toast.success("Registro exitoso. ¡Bienvenido!")
            navigate("/")
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <section className="mx-auto max-w-lg">
            <Card>
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">Crear cuenta de cliente</CardTitle>
                    <CardDescription>
                        Regístrate para poder agendar tus citas en el estudio.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit(handleValidSubmit)}>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label htmlFor="nombre" className="mb-2 block text-sm font-medium">Nombre</label>
                            <Input id="nombre" className={errors.nombre ? "border-destructive" : ""} {...register("nombre")} />
                            <FormError message={errors.nombre?.message} />
                        </div>
                        <div>
                            <label htmlFor="primerApellido" className="mb-2 block text-sm font-medium">Primer apellido</label>
                            <Input id="primerApellido" className={errors.primerApellido ? "border-destructive" : ""} {...register("primerApellido")} />
                            <FormError message={errors.primerApellido?.message} />
                        </div>
                        <div>
                            <label htmlFor="segundoApellido" className="mb-2 block text-sm font-medium">Segundo apellido (opcional)</label>
                            <Input id="segundoApellido" {...register("segundoApellido")} />
                            <FormError message={errors.segundoApellido?.message} />
                        </div>
                        <div>
                            <label htmlFor="telefono" className="mb-2 block text-sm font-medium">Teléfono (opcional)</label>
                            <Input
                                id="telefono"
                                type="tel"
                                placeholder="8888-8888"
                                maxLength={25}
                                {...register("telefono", {
                                    onChange: (e) => {
                                        e.target.value = e.target.value.replace(/[^\d-]/g, "")
                                    },
                                })}
                            />
                            <FormError message={errors.telefono?.message} />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="correo" className="mb-2 block text-sm font-medium">Correo electrónico</label>
                            <Input id="correo" type="email" className={errors.correo ? "border-destructive" : ""} {...register("correo")} />
                            <FormError message={errors.correo?.message} />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="password" className="mb-2 block text-sm font-medium">Contraseña</label>
                            <Input id="password" type="password" className={errors.password ? "border-destructive" : ""} {...register("password")} />
                            <FormError message={errors.password?.message} />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-3">
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Creando cuenta..." : "Registrarme"}
                        </Button>
                        <p className="text-center text-sm text-muted-foreground">
                            ¿Ya tienes cuenta?{" "}
                            <Link to="/login" className="font-medium text-primary hover:underline">
                                Inicia sesión
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </section>
    )
}
