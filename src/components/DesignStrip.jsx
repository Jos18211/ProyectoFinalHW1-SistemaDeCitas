import diseno1 from "@/assets/carrusel/Deseno1.jpeg"
import diseno2 from "@/assets/carrusel/Deseno2.jpeg"
import diseno3 from "@/assets/carrusel/Deseno3.jpeg"
import diseno4 from "@/assets/carrusel/Deseno4.jpeg"
import diseno5 from "@/assets/carrusel/Deseno5.jpeg"
import diseno6 from "@/assets/carrusel/Deseno6.jpeg"
import diseno7 from "@/assets/carrusel/Deseno7.jpeg"

const IMAGENES = [
    { src: diseno1, rotacion: "-rotate-6" },
    { src: diseno2, rotacion: "rotate-4" },
    { src: diseno3, rotacion: "-rotate-3" },
    { src: diseno4, rotacion: "rotate-6" },
    { src: diseno5, rotacion: "-rotate-4" },
    { src: diseno6, rotacion: "rotate-3" },
    { src: diseno7, rotacion: "-rotate-5" },
]

// Se repite la secuencia para que el desplazamiento se vea continuo, sin cortes.
const SECUENCIA = [...IMAGENES, ...IMAGENES]

export function DesignStrip() {
    return (
        <div className="w-full max-w-full overflow-hidden py-8 sm:py-16">
            <div className="flex w-max -space-x-3 animate-marquee has-[img:hover]:[animation-play-state:paused] sm:-space-x-6">
                {SECUENCIA.map(({ src, rotacion }, i) => (
                    <img
                        key={`${src}-${i}`}
                        src={src}
                        alt=""
                        className={`relative z-0 h-28 w-20 shrink-0 rounded-lg border-2 border-background object-cover shadow-lg transition-transform duration-300 sm:h-56 sm:w-40 sm:rounded-2xl sm:border-4 sm:shadow-xl ${rotacion} hover:z-20 hover:rotate-0 sm:hover:-translate-y-6 sm:hover:scale-150 sm:hover:shadow-2xl`}
                    />
                ))}
            </div>
        </div>
    )
}

