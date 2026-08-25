import { useEffect, useRef } from "react"

const SCRIPT_ID = "google-maps-js-api"

// Estilo oscuro del mapa (equivalente al "modo noche" de Google Maps),
// para que combine con el tema carbón del resto del sitio.
const ESTILO_OSCURO = [
    { elementType: "geometry", stylers: [{ color: "#212121" }] },
    { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
    { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#757575" }] },
    { featureType: "administrative.country", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
    { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#bdbdbd" }] },
    { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#181818" }] },
    { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
    { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#2c2c2c" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#8a8a8a" }] },
    { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#373737" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3c3c3c" }] },
    { featureType: "road.highway.controlled_access", elementType: "geometry", stylers: [{ color: "#4e4e4e" }] },
    { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
    { featureType: "transit", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3d3d3d" }] },
]

function cargarGoogleMapsScript() {
    if (window.google?.maps) return Promise.resolve()

    const scriptExistente = document.getElementById(SCRIPT_ID)
    if (scriptExistente) {
        return new Promise((resolve) => scriptExistente.addEventListener("load", resolve, { once: true }))
    }

    return new Promise((resolve, reject) => {
        const script = document.createElement("script")
        script.id = SCRIPT_ID
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
        script.async = true
        script.onload = resolve
        script.onerror = reject
        document.body.appendChild(script)
    })
}

function esModoOscuro() {
    return document.documentElement.classList.contains("dark")
}

export function GoogleMapView({ lat, lng, zoom = 15, titulo, className }) {
    const contenedorRef = useRef(null)
    const mapaRef = useRef(null)

    useEffect(() => {
        let cancelado = false

        cargarGoogleMapsScript()
            .then(() => {
                if (cancelado || !contenedorRef.current) return

                mapaRef.current = new window.google.maps.Map(contenedorRef.current, {
                    center: { lat, lng },
                    zoom,
                    styles: esModoOscuro() ? ESTILO_OSCURO : [],
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                })

                new window.google.maps.Marker({
                    position: { lat, lng },
                    map: mapaRef.current,
                    title: titulo,
                })
            })
            .catch(() => {
                // Si el script no carga (red, key inválida, API no habilitada),
                // el contenedor simplemente queda vacío en vez de romper la página.
            })

        return () => {
            cancelado = true
        }
    }, [lat, lng, zoom, titulo])

    // El toggle de tema del Navbar solo cambia la clase "dark" en <html>;
    // este observer detecta ese cambio para re-estilar el mapa ya creado.
    useEffect(() => {
        const observer = new MutationObserver(() => {
            mapaRef.current?.setOptions({ styles: esModoOscuro() ? ESTILO_OSCURO : [] })
        })
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
        return () => observer.disconnect()
    }, [])

    return <div ref={contenedorRef} className={className} />
}
