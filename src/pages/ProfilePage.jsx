import { useAuth } from "../context/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"

export function ProfilePage() {
    const { usuario } = useAuth()

    if (!usuario) return null

    return (
        <section className="mx-auto max-w-lg">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Mi perfil</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Nombre completo</span>
                        <span className="font-medium">
                            {usuario.nombre} {usuario.primerApellido} {usuario.segundoApellido || ""}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Correo</span>
                        <span className="font-medium">{usuario.correo}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Teléfono</span>
                        <span className="font-medium">{usuario.telefono || "No registrado"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Rol</span>
                        <Badge>{usuario.rol?.nombre}</Badge>
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}

