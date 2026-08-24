export function formatearHora(valorIso) {
    if (!valorIso) return "--:--"
    return valorIso.slice(11, 16)
}
