import { useEffect } from "react"

import { PageHeader } from "../components/PageHeader"
import { portafolioItems } from "../data/portafolioItems"

const EMBED_SCRIPT_ID = "instagram-embed-script"
const EMBED_SCRIPT_SRC = "https://www.instagram.com/embed.js"

// El script de Instagram solo procesa los <blockquote> presentes en el
// DOM al momento en que él mismo termina de cargar. Como esta es una
// SPA, al volver a entrar a esta ruta los blockquotes son elementos
// nuevos y hay que pedirle explícitamente que los vuelva a procesar.
function procesarEmbedsInstagram() {
    if (window.instgrm) {
        window.instgrm.Embeds.process()
        return
    }
    if (document.getElementById(EMBED_SCRIPT_ID)) return

    const script = document.createElement("script")
    script.id = EMBED_SCRIPT_ID
    script.src = EMBED_SCRIPT_SRC
    script.async = true
    document.body.appendChild(script)
}

export function PortafolioPage() {
    useEffect(() => {
        procesarEmbedsInstagram()
    }, [])

    return (
        <section className="space-y-6">
            <PageHeader
                title="Portafolio"
                description="Una muestra de nuestros trabajos publicados en Instagram."
            />

            {portafolioItems.length === 0 ? (
                <p className="text-muted-foreground">Todavía no hay publicaciones cargadas.</p>
            ) : (
                <div className="grid justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {portafolioItems.map((item) => (
                        <blockquote
                            key={item.url}
                            className="instagram-media"
                            data-instgrm-permalink={item.url}
                            data-instgrm-version="14"
                            style={{ maxWidth: "100%", minWidth: "270px" }}
                        />
                    ))}
                </div>
            )}
        </section>
    )
}
