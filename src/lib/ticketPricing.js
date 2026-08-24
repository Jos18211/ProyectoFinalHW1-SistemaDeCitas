const IMPUESTO_VENTAS = 0.13;

// Calcula el ingreso potencial total de un evento a partir de sus tipos de entrada:
// por cada tipo se multiplica el precio base por los cupos disponibles, se suman
// todos los tipos de entrada y finalmente se aplica el 13% de impuesto de ventas.
export function calcularIngresoPotencial(tiposEntrada = []) {
    const subtotal = tiposEntrada.reduce((acumulado, tipoEntrada) => {
        const precioBase = Number(tipoEntrada.price) || 0;
        const cuposDisponibles = Number(tipoEntrada.availableQty) || 0;
        return acumulado + precioBase * cuposDisponibles;
    }, 0);

    return subtotal * (1 + IMPUESTO_VENTAS);
}

// Da formato de moneda (colones) con dos decimales a un monto numérico.
export function formatearMoneda(monto) {
    return new Intl.NumberFormat("es-CR", {
        style: "currency",
        currency: "CRC",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(monto || 0);
}
