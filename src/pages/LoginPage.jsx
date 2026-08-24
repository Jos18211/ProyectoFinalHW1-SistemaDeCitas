import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate, Link } from "react-router-dom"
import toast from "react-hot-toast"

import { loginSchema } from "../schemas/authSchemas"
import { useAuth } from "../context/AuthContext"
import { FormError } from "../components/FormError"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "../components/ui/card"

export function LoginPage() {
    const { login } = useAuth()
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: zodResolver(loginSchema), mode: "onTouched" })

    async function handleValidSubmit(formData) {
        try {
            await login(formData.correo, formData.password)
            toast.success("Sesión iniciada correctamente.")
            navigate("/")
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <section className="mx-auto max-w-md">
            <Card>
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">Iniciar sesión</CardTitle>
                    <CardDescription>
                        Ingresa tus credenciales para acceder al sistema de citas.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit(handleValidSubmit)}>
                    <CardContent className="grid gap-4">
                        <div>
                            <label htmlFor="correo" className="mb-2 block text-sm font-medium">
                                Correo electrónico
                            </label>
                            <Input
                                id="correo"
                                type="email"
                                placeholder="correo@ejemplo.com"
                                className={errors.correo ? "border-destructive" : ""}
                                {...register("correo")}
                            />
                            <FormError message={errors.correo?.message} />
                        </div>
                        <div>
                            <label htmlFor="password" className="mb-2 block text-sm font-medium">
                                Contraseña
                            </label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="********"
                                className={errors.password ? "border-destructive" : ""}
                                {...register("password")}
                            />
                            <FormError message={errors.password?.message} />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-3">
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
                        </Button>
                        <p className="text-center text-sm text-muted-foreground">
                            ¿No tienes cuenta?{" "}
                            <Link to="/registro" className="font-medium text-primary hover:underline">
                                Regístrate como cliente
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </section>
    )
}
