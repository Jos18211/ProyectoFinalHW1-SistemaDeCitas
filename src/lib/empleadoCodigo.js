const PREFIJO = "TAT-"

export function generarSiguienteCodigoEmpleado(empleados = []) {
    const numeros = empleados
        .map((empleado) => {
            const match = /^TAT-(\d+)$/i.exec(empleado.codigoEmpleado || "")
            return match ? Number(match[1]) : null
        })
        .filter((numero) => numero !== null)

    const siguiente = numeros.length > 0 ? Math.max(...numeros) + 1 : 1
    return `${PREFIJO}${String(siguiente).padStart(3, "0")}`
}
