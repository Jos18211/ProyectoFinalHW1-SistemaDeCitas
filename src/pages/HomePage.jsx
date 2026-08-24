import { useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { DesignStrip } from "@/components/DesignStrip";
import { Avatar } from "@/components/Avatar";
import { listarEmpleadosActivos } from "@/services/empleadosService";

import dragonLogo from "@/assets/DragonLogo.PNG";

export function HomePage() {
    const { estaAutenticado } = useAuth();
    const [empleados, setEmpleados] = useState([]);

    useEffect(() => {
        listarEmpleadosActivos()
            .then(setEmpleados)
            .catch(() => setEmpleados([]));
    }, []);

    return (
      <>
        <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-background via-background to-primary/10 p-6 md:p-10">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-secondary/30 blur-3xl" />

          <Card className="relative border-border/60 bg-card/80 shadow-xl backdrop-blur">
            <CardContent className="grid gap-8 p-6 md:grid-cols-[1.2fr_0.8fr] md:p-10">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Sistema de gestión de citas
                </div>

                <div className="space-y-4">
                  <h1 className="text-4xl font-extrabold tracking-tighter text-foreground sm:text-5xl md:text-6xl">
                    Palermo´s <span className="text-primary">Tattoo</span>
                  </h1>
                  <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
                    Regístrate como cliente para que nuestro equipo te agende la
                    próxima sesión, consulta tu historial de citas y descubre
                    nuestros servicios y artistas.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  {estaAutenticado ? (
                    <Button size="lg" asChild>
                      <Link to="/perfil">
                        Ver mi perfil
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  ) : (
                    <>
                      <Button size="lg" asChild>
                        <Link to="/registro">
                          Registrarme como cliente
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      <Button size="lg" variant="outline" asChild>
                        <Link to="/login">Iniciar sesión</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="w-full max-w-sm rounded-2xl border bg-background/80 p-6 shadow-md">
                  <div className="mb-4 flex h-24 w-24 items-center justify-center">
                    <img
                      src={dragonLogo}
                      alt=""
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <h2 className="mb-2 text-xl font-semibold">
                    Artistas especializados
                  </h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Blackwork, realismo a color y fine line: elige el servicio y
                    el artista según tu estilo.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {empleados.length > 0 && (
            <Card className="relative mt-6 border-border/60 bg-card/80 shadow-xl backdrop-blur">
              <CardContent className="space-y-6 p-6 md:p-10">
                <div className="text-center">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    Nuestro <span className="text-primary">equipo</span>
                  </h2>
                  <p className="text-muted-foreground">
                    Artistas especializados, listos para tu próxima pieza.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {empleados.slice(0, 3).map((empleado) => (
                    <div
                      key={empleado.id}
                      className="flex flex-col items-center gap-3 rounded-2xl border bg-background/60 p-6 text-center"
                    >
                      <Avatar
                        nombre={empleado.usuario.nombre}
                        primerApellido={empleado.usuario.primerApellido}
                        size="h-20 w-20 text-2xl"
                      />
                      <div>
                        <h3 className="font-semibold">
                          {empleado.usuario.nombre} {empleado.usuario.primerApellido}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {empleado.especialidad?.nombre}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="relative mt-6 hidden overflow-hidden border-border/60 bg-card/80 shadow-xl backdrop-blur sm:block">
            <CardContent className="space-y-4 p-6 md:p-10">
              <div className="text-center">
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                  <span className="text-primary">Algunos de nuestros diseños</span>
                </h2>
                <p className="text-muted-foreground">
                  Una muestra del trabajo realizado en el estudio.
                </p>
              </div>
              <DesignStrip />
            </CardContent>
          </Card>
        </section>
      </>
    );
}
