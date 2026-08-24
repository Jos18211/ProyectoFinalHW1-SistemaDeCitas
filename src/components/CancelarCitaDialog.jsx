import { useState } from "react"
import PropTypes from "prop-types"
import toast from "react-hot-toast"

import { cancelarCita } from "../services/citasService"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { FormError } from "./FormError"
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose
} from "./ui/dialog"

export function CancelarCitaDialog({ citaId, onCancelada }) {
    const [open, setOpen] = useState(false)
    const [motivo, setMotivo] = useState("")
    const [error, setError] = useState("")
    const [enviando, setEnviando] = useState(false)

    async function handleConfirmar() {
        const motivoLimpio = motivo.trim()
        if (motivoLimpio.length < 5) {
            setError("El motivo debe tener al menos 5 caracteres.")
            return
        }
        if (motivoLimpio.length > 255) {
            setError("El motivo no debe superar 255 caracteres.")
            return
        }
        try {
            setEnviando(true)
            setError("")
            await cancelarCita(citaId, motivoLimpio)
            toast.success("Cita cancelada correctamente.")
            setOpen(false)
            setMotivo("")
            onCancelada()
        } catch (err) {
            toast.error(err.message)
        } finally {
            setEnviando(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive">Cancelar cita</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cancelar cita</DialogTitle>
                    <DialogDescription>
                        Indica el motivo de la cancelación. Esta acción no se puede deshacer.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <Textarea
                        rows={3}
                        placeholder="Ej: El cliente no podrá asistir."
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                    />
                    <FormError message={error} />
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Volver</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={handleConfirmar} disabled={enviando}>
                        {enviando ? "Cancelando..." : "Confirmar cancelación"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

CancelarCitaDialog.propTypes = {
    citaId: PropTypes.number.isRequired,
    onCancelada: PropTypes.func.isRequired,
}
