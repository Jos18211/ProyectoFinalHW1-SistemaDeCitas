import { useState } from "react"
import { PageHeader } from "../components/PageHeader"
import { Card, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { InaccessibleModal } from "../components/accessibilityDemo/InaccessibleModal"
import { AccessibleModal } from "../components/accessibilityDemo/AccessibleModal"
import { InaccessibleDropdown } from "../components/accessibilityDemo/InaccessibleDropdown"
import { AccessibleDropdown } from "../components/accessibilityDemo/AccessibleDropdown"
import { InaccessibleTabs } from "../components/accessibilityDemo/InaccessibleTabs"
import { AccessibleTabs } from "../components/accessibilityDemo/AccessibleTabs"
import { InaccessibleAlert } from "../components/accessibilityDemo/InaccessibleAlert"
import { AccessibleAlert } from "../components/accessibilityDemo/AccessibleAlert"
import { InaccessibleIconButton } from "../components/accessibilityDemo/InaccessibleIconButton"
import { AccessibleIconButton } from "../components/accessibilityDemo/AccessibleIconButton"
import { InaccessibleFocus } from "../components/accessibilityDemo/InaccessibleFocus"
import { AccessibleFocus } from "../components/accessibilityDemo/AccessibleFocus"


const OPCIONES_SERVICIO = ["Blackwork", "Fine line", "Realismo a color"]

export function AccesibilidadDemoPage() {
    const [modalMaloAbierto, setModalMaloAbierto] = useState(false)
    const [modalBuenoAbierto, setModalBuenoAbierto] = useState(false)

    return (
        <section className="space-y-10">
            <PageHeader
                title="Demo: Accesibilidad en componentes dinámicos"
                description="Comparación entre una implementación inaccesible y una accesible de modales y dropdowns."
            />

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardContent className="space-y-3 p-5">
                        <h3 className="font-semibold text-destructive">❌ Modal inaccesible</h3>
                        <ul className="list-inside list-disc text-sm text-muted-foreground">
                            <li>Sin <code>role="dialog"</code> ni <code>aria-modal</code></li>
                            <li>El foco no entra ni vuelve a ningún lado</li>
                            <li>Tab se "escapa" hacia el resto de la página</li>
                            <li><kbd>Escape</kbd> no hace nada</li>
                            <li>El botón de cerrar no tiene <code>aria-label</code></li>
                        </ul>
                        <Button variant="destructive" onClick={() => setModalMaloAbierto(true)}>
                            Abrir modal inaccesible
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="space-y-3 p-5">
                        <h3 className="font-semibold text-emerald-600 dark:text-emerald-400">✅ Modal accesible</h3>
                        <ul className="list-inside list-disc text-sm text-muted-foreground">
                            <li><code>role="dialog"</code> + <code>aria-modal="true"</code> + <code>aria-labelledby</code></li>
                            <li>El foco entra automáticamente al abrir</li>
                            <li>Tab queda atrapado dentro (focus trap)</li>
                            <li><kbd>Escape</kbd> cierra el modal</li>
                            <li>El foco regresa exactamente al botón que lo abrió</li>
                        </ul>
                        <Button onClick={() => setModalBuenoAbierto(true)}>
                            Abrir modal accesible
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardContent className="space-y-3 p-5">
                        <h3 className="font-semibold text-destructive">❌ Dropdown inaccesible</h3>
                        <ul className="list-inside list-disc text-sm text-muted-foreground">
                            <li>Hecho con <code>{"<div onClick>"}</code>, no <code>{"<button>"}</code></li>
                            <li>No se puede abrir ni navegar con teclado</li>
                            <li>Sin <code>aria-expanded</code> ni <code>aria-haspopup</code></li>
                        </ul>
                        <InaccessibleDropdown etiqueta="Servicio" opciones={OPCIONES_SERVICIO} />
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="space-y-3 p-5">
                        <h3 className="font-semibold text-emerald-600 dark:text-emerald-400">✅ Dropdown accesible</h3>
                        <ul className="list-inside list-disc text-sm text-muted-foreground">
                            <li><code>aria-haspopup</code> + <code>aria-expanded</code> en el botón</li>
                            <li>Flechas ↑/↓ navegan las opciones</li>
                            <li><code>role="listbox"</code> / <code>role="option"</code></li>
                            <li><kbd>Escape</kbd> cierra y devuelve el foco</li>
                        </ul>
                        <AccessibleDropdown etiqueta="Servicio" opciones={OPCIONES_SERVICIO} />
                    </CardContent>
                </Card>

            </div>
            <div className="grid gap-6 md:grid-cols-2">
    <Card>
        <CardContent className="space-y-3 p-5">
            <h3 className="font-semibold text-destructive">❌ Tabs inaccesibles</h3>
            <ul className="list-inside list-disc text-sm text-muted-foreground">
                <li>Hechas con <code>{"<div onClick>"}</code></li>
                <li>Sin <code>role="tablist"/"tab"/"tabpanel"</code></li>
                <li>No se pueden recorrer con las flechas del teclado</li>
            </ul>
            <InaccessibleTabs />
        </CardContent>
    </Card>

    <Card>
        <CardContent className="space-y-3 p-5">
            <h3 className="font-semibold text-emerald-600 dark:text-emerald-400">✅ Tabs accesibles</h3>
            <ul className="list-inside list-disc text-sm text-muted-foreground">
                <li><code>role="tablist"</code>/<code>"tab"</code>/<code>"tabpanel"</code> + <code>aria-selected</code></li>
                <li>Flechas ← → mueven entre pestañas (roving tabindex)</li>
                <li><kbd>Home</kbd>/<kbd>End</kbd> saltan a la primera/última</li>
            </ul>
            <AccessibleTabs />
        </CardContent>
    </Card>
</div>

<div className="grid gap-6 md:grid-cols-2">
    <Card>
        <CardContent className="space-y-3 p-5">
            <h3 className="font-semibold text-destructive">❌ Mensaje sin aria-live</h3>
            <ul className="list-inside list-disc text-sm text-muted-foreground">
                <li>El texto aparece solo visualmente</li>
                <li>Un lector de pantalla no anuncia nada si el foco no está ahí</li>
            </ul>
            <InaccessibleAlert />
        </CardContent>
    </Card>

    <Card>
        <CardContent className="space-y-3 p-5">
            <h3 className="font-semibold text-emerald-600 dark:text-emerald-400">✅ Mensaje con aria-live</h3>
            <ul className="list-inside list-disc text-sm text-muted-foreground">
                <li><code>aria-live="polite"</code> en un contenedor que ya existe desde el inicio</li>
                <li>El lector de pantalla lo anuncia solo, sin mover el foco</li>
            </ul>
            <AccessibleAlert />
        </CardContent>
    </Card>
</div>
<div className="grid gap-6 md:grid-cols-2">
    <Card>
        <CardContent className="space-y-3 p-5">
            <h3 className="font-semibold text-destructive">❌ Botón de ícono sin nombre accesible</h3>
            <ul className="list-inside list-disc text-sm text-muted-foreground">
                <li>Sin <code>aria-label</code> ni texto visible</li>
                <li>Un lector de pantalla solo dice "botón"</li>
            </ul>
            <InaccessibleIconButton />
        </CardContent>
    </Card>

    <Card>
        <CardContent className="space-y-3 p-5">
            <h3 className="font-semibold text-emerald-600 dark:text-emerald-400">✅ Botón de ícono con aria-label</h3>
            <ul className="list-inside list-disc text-sm text-muted-foreground">
                <li><code>aria-label="Eliminar diseño"</code> en el botón</li>
                <li><code>aria-hidden="true"</code> en el ícono decorativo</li>
            </ul>
            <AccessibleIconButton />
        </CardContent>
    </Card>
</div>

<div className="grid gap-6 md:grid-cols-2">
    <Card>
        <CardContent className="space-y-3 p-5">
            <h3 className="font-semibold text-destructive">❌ Sin indicador de foco</h3>
            <ul className="list-inside list-disc text-sm text-muted-foreground">
                <li><code>outline-none</code> sin ningún reemplazo</li>
                <li>Navegando con Tab, no se ve dónde estás parado</li>
            </ul>
            <InaccessibleFocus />
        </CardContent>
    </Card>

    <Card>
        <CardContent className="space-y-3 p-5">
            <h3 className="font-semibold text-emerald-600 dark:text-emerald-400">✅ Con foco visible (focus-visible)</h3>
            <ul className="list-inside list-disc text-sm text-muted-foreground">
                <li>Anillo de foco solo al navegar con teclado</li>
                <li>No aparece al hacer clic con el mouse</li>
            </ul>
            <AccessibleFocus />
        </CardContent>
    </Card>
</div>



            <InaccessibleModal
                open={modalMaloAbierto}
                onClose={() => setModalMaloAbierto(false)}
                titulo="Confirmar cancelación"
            >
                <p className="text-sm text-muted-foreground">
                    Prueba: haz clic aquí y luego presiona Tab varias veces — el foco se va detrás del modal.
                </p>
            </InaccessibleModal>

            <AccessibleModal
                open={modalBuenoAbierto}
                onClose={() => setModalBuenoAbierto(false)}
                titulo="Confirmar cancelación"
            >
                <p className="text-sm text-muted-foreground">
                    Prueba: presiona Tab varias veces — el foco queda atrapado aquí dentro. Presiona Escape para cerrar.
                </p>
            </AccessibleModal>
        </section>
    )
}
