import { Link } from "react-router-dom";
import { Clock, Mail, MapPin, MessageCircle, ExternalLink } from "lucide-react";
import { UBICACION_MAPS_URL } from "@/data/ubicacion";
import dragonLogo from "@/assets/DragonLogo.PNG";

const FOOTER_LINKS = [
    { to: "/", label: "Inicio" },
    { to: "/servicios", label: "Servicios" },
    { to: "/portafolio", label: "Portafolio" },
    { to: "/citas", label: "Citas" },
];

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-auto border-t border-border bg-card text-card-foreground">
            <div className="mx-auto max-w-5xl px-4 py-10 md:py-12">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Marca */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <img src={dragonLogo} alt="" className="h-10 w-10 object-contain" />
                            <span className="font-bold text-foreground">
                                Palermo´s <span className="text-primary">Tattoo</span>
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Estudio de tatuajes especializado en blackwork, realismo a color y fine line.
                        </p>
                    </div>

                    {/* Navegación */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-foreground">Navegación</h3>
                        <ul className="space-y-2">
                            {FOOTER_LINKS.map(({ to, label }) => (
                                <li key={to}>
                                    <Link to={to} className="text-sm text-muted-foreground hover:text-foreground">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contacto */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-foreground">Contacto</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2">
                                <MessageCircle className="h-4 w-4 shrink-0 text-primary" />
                                <a
                                    href="https://wa.me/61278904"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hover:text-foreground"
                                >
                                    WhatsApp
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="h-4 w-4 shrink-0 text-primary" />
                                <a href="mailto:josep18211@gmail.com" className="hover:text-foreground">
                                    josep18211@gmail.com
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                                <a
                                    href={UBICACION_MAPS_URL}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hover:text-foreground"
                                >
                                    Cómo llegar
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Redes */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-foreground">Síguenos</h3>
                        <a
                            href="https://www.instagram.com/palermo.ttt/"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                        >
                            <ExternalLink className="h-4 w-4" />
                            Instagram
                        </a>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-center gap-2 border-t border-border pt-6 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 shrink-0 text-primary" />
                    Lun–Vie 10:00–19:00 · Sáb 09:00–17:00 · Dom cerrado
                </div>

                <div className="mt-6 text-center text-xs text-muted-foreground">
                    © {currentYear}{" "}
                    <span className="font-medium text-primary">ISW-613 Joseph Quesada Salas</span>. Todos los
                    derechos reservados.
                </div>
            </div>
        </footer>
    );
}
