import { fileURLToPath } from 'url'
import { dirname } from 'path'

export const __filename = fileURLToPath(import.meta.url) // Me devuelve el nombre del archivo 
export const __dirname = dirname(__filename) // Me devuelve src (carpeta de archivo)