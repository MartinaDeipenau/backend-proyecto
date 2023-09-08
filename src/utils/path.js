import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

export const __filename = fileURLToPath(import.meta.url) // Me devuelve el nombre del archivo 
export const __dirname = join(dirname(__filename), '/..') // Me devuelve src (carpeta de archivo)