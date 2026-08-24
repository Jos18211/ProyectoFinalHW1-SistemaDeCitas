import { httpClient } from "./httpClient"

export async function subirImagen(file, previousFileName = null) {
    if (!file) return null
    const formData = new FormData()
    formData.append("image", file)
    if (previousFileName) {
        formData.append("previousFileName", previousFileName)
    }
    const data = await httpClient.post("/images/upload", formData, { isFormData: true })
    return data.fileName
}
