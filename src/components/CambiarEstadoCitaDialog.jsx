import { useEffect, useState } from "react"
import PropTypes from "prop-types"
import toast from "react-hot-toast"

import { listarEstadosCita } from "../services/estadosCitaService"
import { cambiarEstadoCita } from "../services/citasService"
import { Button } from "./ui/button"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "./ui/select"
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose
} from "./ui/dialog"

export function CambiarEstadoCitaDialog({ citaId, estadoActualId, onCambiado }) {
    const [open, setOpen] = useState(false)
    const [estados, setEstados] = useState([])
    const [estadoSeleccionado, setEstadoSeleccionado] = useState("")
    const [enviando, setEnviando] = useState(false)

    useEffect(() => {
        if (!open) return
        async function cargar() {
            try {
                const data = await listarEstadosCita()
                setEstados(data.filter((estado) => estado.id !== estadoActualId))
            } catch {
                setEstados([])
            }
        }
        cargar()
    }, [open, estadoActualId])

    async function handleConfirmar() {
        if (!estadoSeleccionado) return
        try {
            setEnviando(true)
            await cambiarEstadoCita(citaId, Number(estadoSeleccionado))
            toast.success("Estado actualizado correctamente.")
            setOpen(false)
            setEstadoSeleccionado("")
            onCambiado()
        } catch (err) {
            toast.error(err.message)
        } finally {
            setEnviando(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Cambiar estado</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cambiar estado de la cita</DialogTitle>
                    <DialogDescription>
                        Selecciona el nuevo estado. Algunas transiciones pueden no estar permitidas por el sistema.
                    </DialogDescription>
                </DialogHeader>
                <Select value={estadoSeleccionado} onValueChange={setEstadoSeleccionado}>
                    <SelectTrigger aria-label="Nuevo estado de la cita">
                        <SelectValue placeholder="Seleccione un estado" />
                    </SelectTrigger>
                    <SelectContent>
                        {estados.map((estado) => (
                            <SelectItem key={estado.id} value={String(estado.id)}>
                                {estado.nombre}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Volver</Button>
                    </DialogClose>
                    <Button onClick={handleConfirmar} disabled={enviando || !estadoSeleccionado}>
                        {enviando ? "Guardando..." : "Confirmar cambio"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

CambiarEstadoCitaDialog.propTypes = {
    citaId: PropTypes.number.isRequired,
    estadoActualId: PropTypes.number.isRequired,
    onCambiado: PropTypes.func.isRequired,
}
