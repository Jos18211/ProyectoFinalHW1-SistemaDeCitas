import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function NotFoundPage() {
    return (
        <section className="mx-auto flex max-w-lg flex-col items-center py-16 text-center">
            <Card className="w-full">
                <CardContent className="space-y-4 p-8">
                    <p className="text-sm font-semibold text-primary">Error 404</p>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Página no encontrada
                    </h1>
                    <p className="text-muted-foreground">
                        La ruta que buscas no existe o fue movida.
                    </p>
                    <Button asChild className="mt-2">
                        <Link to="/">Volver al inicio</Link>
                    </Button>
                </CardContent>
            </Card>
        </section>
    )
}
