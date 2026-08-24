import { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { citaSchema } from "../schemas/citaSchema"
import { sumarMinutos, calcularCostoTotal } from "../lib/calculoCita"
import { formatearMoneda } from "../lib/ticketPricing"
import { formatearHora } from "../lib/formatearHora"
import { listarEmpleadosActivos } from "../services/empleadosService"
import { consultarAgendaEmpleadoParaCita, consultarDisponibilidad } from "../services/citasService"

import { FormError } from "./FormError"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Badge } from "./ui/badge"
import { Alert } from "./ui/alert"
import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "./ui/card"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "./ui/select"

function hoyISO() {
    return new Date().toISOString().slice(0, 10)
}

export function CitaForm({
    onSubmit,
    clientes,
    servicios,
    adicionales,
    initialData = null,
    submitText = "Guardar",
}) {
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(citaSchema),
        mode: "onTouched",
        defaultValues: {
            clienteId: initialData?.clienteId ? String(initialData.clienteId) : "",
            servicioId: initialData?.servicioId ? String(initialData.servicioId) : "",
            empleadoId: initialData?.empleadoId ? String(initialData.empleadoId) : "",
            fecha: initialData?.fecha ? initialData.fecha.slice(0, 10) : hoyISO(),
            horaInicio: initialData?.horaInicio ? initialData.horaInicio.slice(11, 16) : "",
            adicionalIds: initialData?.adicionales ? initialData.adicionales.map((a) => String(a.id)) : [],
            observaciones: initialData?.observaciones || "",
        },
    })

    const servicioId = watch("servicioId")
    const empleadoId = watch("empleadoId")
    const fecha = watch("fecha")
    const horaInicio = watch("horaInicio")
    const adicionalIdsSeleccionados = watch("adicionalIds")

    const servicioSeleccionado = servicios.find((s) => String(s.id) === String(servicioId))
    const adicionalesSeleccionados = adicionales.filter((a) =>
        (adicionalIdsSeleccionados || []).includes(String(a.id))
    )

    const duracionMinutos = servicioSeleccionado?.duracionMinutos || 0
    const horaFin = horaInicio && duracionMinutos ? sumarMinutos(horaInicio, duracionMinutos) : ""
    const { costoAdicionales, costoTotal } = servicioSeleccionado
        ? calcularCostoTotal(servicioSeleccionado.precioBase, adicionalesSeleccionados)
        : { costoAdicionales: 0, costoTotal: 0 }

    // Artistas disponibles según el servicio seleccionado
    const [empleados, setEmpleados] = useState([])
    const [cargandoEmpleados, setCargandoEmpleados] = useState(false)

    useEffect(() => {
        if (!servicioId) {
            setEmpleados([])
            return
        }
        let cancelado = false
        async function cargarEmpleados() {
            try {
                setCargandoEmpleados(true)
                const data = await listarEmpleadosActivos(servicioId)
                if (!cancelado) setEmpleados(data)
            } catch {
                if (!cancelado) setEmpleados([])
            } finally {
                if (!cancelado) setCargandoEmpleados(false)
            }
        }
        cargarEmpleados()
        return () => { cancelado = true }
    }, [servicioId])

    // Agenda del artista seleccionado para la fecha seleccionada
    const [agenda, setAgenda] = useState(null)
    const [cargandoAgenda, setCargandoAgenda] = useState(false)

    useEffect(() => {
        if (!empleadoId || !fecha) {
            setAgenda(null)
            return
        }
        let cancelado = false
        async function cargarAgenda() {
            try {
                setCargandoAgenda(true)
                const data = await consultarAgendaEmpleadoParaCita(empleadoId, fecha)
                if (!cancelado) setAgenda(data)
            } catch {
                if (!cancelado) setAgenda(null)
            } finally {
                if (!cancelado) setCargandoAgenda(false)
            }
        }
        cargarAgenda()
        return () => { cancelado = true }
    }, [empleadoId, fecha])

    // Disponibilidad en tiempo real
    const [disponibilidad, setDisponibilidad] = useState(null)
    const [consultandoDisponibilidad, setConsultandoDisponibilidad] = useState(false)

    useEffect(() => {
        if (!empleadoId || !servicioId || !fecha || !horaInicio || !horaFin) {
            setDisponibilidad(null)
            return
        }
        let cancelado = false
        const timeoutId = setTimeout(async () => {
            try {
                setConsultandoDisponibilidad(true)
                const resultado = await consultarDisponibilidad({
                    empleadoId: Number(empleadoId),
                    servicioId: Number(servicioId),
                    fecha,
                    horaInicio,
                    horaFin,
                    citaIdExcluir: initialData?.id ?? null,
                })
                if (!cancelado) setDisponibilidad(resultado)
            } catch (err) {
                if (!cancelado) setDisponibilidad({ disponible: false, motivo: err.message })
            } finally {
                if (!cancelado) setConsultandoDisponibilidad(false)
            }
        }, 400)
        return () => {
            cancelado = true
            clearTimeout(timeoutId)
        }
    }, [empleadoId, servicioId, fecha, horaInicio, horaFin, initialData])

    function handleValidSubmit(formData) {
        if (!disponibilidad?.disponible) return
        onSubmit({
            clienteId: Number(formData.clienteId),
            servicioId: Number(formData.servicioId),
            empleadoId: Number(formData.empleadoId),
            fecha: formData.fecha,
            horaInicio: formData.horaInicio,
            horaFin,
            duracionMinutos,
            precioServicio: Number(servicioSeleccionado.precioBase),
            costoAdicionales,
            costoTotal,
            observaciones: formData.observaciones?.trim() ? formData.observaciones.trim() : null,
            adicionalIds: (formData.adicionalIds || []).map(Number),
        })
    }

    return (
        <Card className="mx-auto max-w-4xl">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Datos de la cita</CardTitle>
                <CardDescription>
                    La duración y el costo se calculan automáticamente según el servicio y los adicionales seleccionados.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(handleValidSubmit)}>
                <CardContent className="grid gap-6">
                    <div className="grid gap-5 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium">Cliente</label>
                            <Controller
                                name="clienteId"
                                control={control}
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger aria-label="Cliente" className={errors.clienteId ? "border-destructive" : ""}>
                                            <SelectValue placeholder="Seleccione un cliente" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {clientes.map((cliente) => (
                                                <SelectItem key={cliente.id} value={String(cliente.id)}>
                                                    {cliente.nombre} {cliente.primerApellido} — {cliente.correo}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <FormError message={errors.clienteId?.message} />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">Servicio principal</label>
                            <Controller
                                name="servicioId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={(value) => {
                                            field.onChange(value)
                                            setValue("empleadoId", "")
                                        }}
                                    >
                                        <SelectTrigger aria-label="Servicio principal" className={errors.servicioId ? "border-destructive" : ""}>
                                            <SelectValue placeholder="Seleccione un servicio" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {servicios.map((servicio) => (
                                                <SelectItem key={servicio.id} value={String(servicio.id)}>
                                                    {servicio.nombre} — {formatearMoneda(Number(servicio.precioBase))} ({servicio.duracionMinutos} min)
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <FormError message={errors.servicioId?.message} />
                        </div>

                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium">Adicionales (opcional)</label>
                            <div className="rounded-xl border bg-muted/20 p-4">
                                {adicionales.length === 0 && (
                                    <p className="text-sm text-muted-foreground">No hay adicionales activos.</p>
                                )}
                                <div className="flex flex-wrap gap-2">
                                    {adicionales.map((adicional) => (
                                        <label
                                            key={adicional.id}
                                            className="flex cursor-pointer items-center gap-2 rounded-full border bg-background px-3 py-2 text-sm transition-colors hover:bg-muted"
                                        >
                                            <input
                                                type="checkbox"
                                                value={adicional.id}
                                                className="h-4 w-4 accent-primary"
                                                {...register("adicionalIds")}
                                            />
                                            <Badge variant="secondary">
                                                {adicional.nombre} (+{formatearMoneda(Number(adicional.precio))})
                                            </Badge>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">Artista</label>
                            <Controller
                                name="empleadoId"
                                control={control}
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange} disabled={!servicioId}>
                                        <SelectTrigger aria-label="Artista" className={errors.empleadoId ? "border-destructive" : ""}>
                                            <SelectValue placeholder={servicioId ? "Seleccione un artista" : "Primero elija un servicio"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {empleados.map((empleado) => (
                                                <SelectItem key={empleado.id} value={String(empleado.id)}>
                                                    {empleado.usuario.nombre} {empleado.usuario.primerApellido} ({empleado.codigoEmpleado})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {servicioId && !cargandoEmpleados && empleados.length === 0 && (
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Ningún artista activo tiene asignado este servicio.
                                </p>
                            )}
                            <FormError message={errors.empleadoId?.message} />
                        </div>

                        <div>
                            <label htmlFor="fecha" className="mb-2 block text-sm font-medium">Fecha</label>
                            <Input
                                id="fecha"
                                type="date"
                                min={hoyISO()}
                                className={errors.fecha ? "border-destructive" : ""}
                                {...register("fecha")}
                            />
                            <FormError message={errors.fecha?.message} />
                        </div>

                        <div>
                            <label htmlFor="horaInicio" className="mb-2 block text-sm font-medium">Hora de inicio</label>
                            <Input
                                id="horaInicio"
                                type="time"
                                className={errors.horaInicio ? "border-destructive" : ""}
                                {...register("horaInicio")}
                            />
                            <FormError message={errors.horaInicio?.message} />
                        </div>

                        <div className="rounded-xl border bg-muted/20 p-4">
                            <p className="text-sm text-muted-foreground">Hora de finalización</p>
                            <p className="text-lg font-semibold">{horaFin || "--:--"}</p>
                        </div>
                    </div>

                    {empleadoId && fecha && (
                        <div className="rounded-xl border p-4">
                            <h4 className="mb-3 text-sm font-semibold">Agenda del artista para el {fecha}</h4>
                            {cargandoAgenda && <p className="text-sm text-muted-foreground">Cargando agenda...</p>}
                            {!cargandoAgenda && agenda && (
                                <div className="space-y-3">
                                    <div>
                                        <p className="mb-1 text-xs font-medium text-muted-foreground">Horario del establecimiento</p>
                                        {agenda.horarios.length === 0 ? (
                                            <p className="text-sm text-destructive">El establecimiento no atiende este día.</p>
                                        ) : (
                                            agenda.horarios.map((h) => (
                                                <span key={h.id} className="text-sm">
                                                    {formatearHora(h.horaInicio)} - {formatearHora(h.horaFin)}
                                                </span>
                                            ))
                                        )}
                                    </div>
                                    <div>
                                        <p className="mb-1 text-xs font-medium text-muted-foreground">Restricciones</p>
                                        {agenda.restricciones.length === 0 ? (
                                            <p className="text-sm text-muted-foreground">Ninguna para esta fecha.</p>
                                        ) : (
                                            <ul className="space-y-1">
                                                {agenda.restricciones.map((r) => (
                                                    <li key={r.id} className="rounded bg-destructive/10 px-2 py-1 text-sm text-destructive">
                                                        {r.todoElDia ? "Todo el día" : `${formatearHora(r.horaInicio)} - ${formatearHora(r.horaFin)}`} — {r.motivo}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    <div>
                                        <p className="mb-1 text-xs font-medium text-muted-foreground">Citas ya asignadas</p>
                                        {agenda.citas.length === 0 ? (
                                            <p className="text-sm text-muted-foreground">Ninguna para esta fecha.</p>
                                        ) : (
                                            <ul className="space-y-1">
                                                {agenda.citas.map((c) => (
                                                    <li key={c.id} className="rounded bg-muted px-2 py-1 text-sm">
                                                        {formatearHora(c.horaInicio)} - {formatearHora(c.horaFin)} — {c.servicio.nombre}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div>
                        <label htmlFor="observaciones" className="mb-2 block text-sm font-medium">Observaciones (opcional)</label>
                        <Textarea
                            id="observaciones"
                            rows={2}
                            placeholder="Ej: antebrazo izquierdo, diseño ya aprobado."
                            {...register("observaciones")}
                        />
                        <FormError message={errors.observaciones?.message} />
                    </div>

                    <div className="rounded-xl border bg-primary/5 p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Duración total</span>
                            <span className="font-medium">{duracionMinutos || 0} min</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Costo adicionales</span>
                            <span className="font-medium">{formatearMoneda(costoAdicionales)}</span>
                        </div>
                        <div className="flex items-center justify-between border-t pt-2">
                            <span className="text-sm font-semibold">Costo total</span>
                            <span className="text-xl font-bold text-primary">{formatearMoneda(costoTotal)}</span>
                        </div>
                    </div>

                    <div role="status" aria-live="polite" className="min-h-6">
                    {consultandoDisponibilidad && (
                        <p className="text-sm text-muted-foreground">Verificando disponibilidad...</p>
                    )}
                    {!consultandoDisponibilidad && disponibilidad && (
                    <Alert
                    variant={disponibilidad.disponible ? "default" : "destructive"}
                    className={disponibilidad.disponible ? "border-emerald-500/40 text-emerald-700 dark:text-emerald-400" : ""}>
                    {disponibilidad.motivo}
                    </Alert>
                    )}
                    </div>

                </CardContent>
                <CardFooter className="flex justify-end gap-3 border-t pt-6">
                    <Button type="submit" disabled={isSubmitting || !disponibilidad?.disponible}>
                        {isSubmitting ? "Guardando..." : submitText}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}

CitaForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    clientes: PropTypes.array.isRequired,
    servicios: PropTypes.array.isRequired,
    adicionales: PropTypes.array.isRequired,
    initialData: PropTypes.object,
    submitText: PropTypes.string,
}
