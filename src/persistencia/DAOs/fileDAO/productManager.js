import { promises as fs } from 'fs'

export class ProductManager {
    constructor(path) {
        this.path = path
        this.products = []
    }

    static increment() {
        this.idIncrement ? this.idIncrement++ : (this.idIncrement = 1)

        return this.idIncrement
    }

    async addProduct(product) {
        const productTXT = await fs.readFile(this.path, 'utf-8')

        this.products = JSON.parse(productTXT)

        product.id = ProductManager.increment()

        if (
            !product.title ||
            !product.description ||
            !product.price ||
            !product.status ||
            !product.category ||
            !product.code ||
            !product.stock
        ) {
            return console.log('Debe proporcionar todas las propiedades requeridas')
        }

        const validCode = this.products.find((ele) => ele.code === product.code)

        if (validCode) {
            return console.log('El producto ya existe')
        }

        this.products.push(product)

        await fs.writeFile(this.path, JSON.stringify(this.products))
    }

    async getProducts() {
        const productTXT = await fs.readFile(this.path, 'utf-8')

        this.products = JSON.parse(productTXT)

        return this.products
    }

    async getProductById(id) {
        const productTXT = await fs.readFile(this.path, 'utf-8')

        this.products = JSON.parse(productTXT)

        const productByid = this.products.find((prod) => prod.id === parseInt(id))
        const result = productByid !== undefined ? productByid : 'Producto no encontrado'
        return result
    }

    async updateProduct(
        id,
        { title, description, price, thumbnail, status, category, code, stock }
    ) {
        const productTXT = await fs.readFile(this.path, 'utf-8')

        this.products = JSON.parse(productTXT)

        const index = this.products.findIndex((prod) => prod.id === parseInt(id))

        if (index !== -1) {
            this.products[index] = {
                ...this.products[index],
                title,
                description,
                price,
                thumbnail,
                status,
                category,
                code,
                stock,
            }

            await fs.writeFile(this.path, JSON.stringify(this.products))

            return 'Producto actualizado exitosamente'
        } else {
            return 'Producto no encontrado'
        }
    }

    async deleteProduct(id) {
        const productTXT = await fs.readFile(this.path, 'utf-8')
        this.products = JSON.parse(productTXT)

        const filteredProducts = this.products.filter(
            (ele) => ele.id !== parseInt(id))
        this.products = filteredProducts

        await fs.writeFile(this.path, JSON.stringify(this.products))

        return 'Producto eliminado'
    }
}

class Product {
    constructor(title, description, price, thumbnail, status, category, code, stock) {
        this.title = title
        this.description = description
        this.price = price
        this.thumbnail = thumbnail
        this.status = status
        this.category = category
        this.code = code
        this.stock = stock
    }
}

const product1 = new Product('Lemon Pie', 'Descrpition of Lemon Pie', 1500, 'https://1.bp.blogspot.com/-ZOWjMY5Lp6I/YHI4wC4no9I/AAAAAAAAjxs/q4O_gKhK_AQscF0q5E85n_COMGyjFLwJACLcBGAsYHQ/s2048/DSCN0001-02%2B%25281%2529.jpeg', true, 'Exclusive', 'L12', 11)
const product2 = new Product('Cheesecake', 'Descrpition of Cheesecake', 1800, 'https://vinomanos.com/wp-content/uploads/2021/01/Chees-min.jpg', true, 'Exclusive', 'C12', 32)
const product3 = new Product('Oreo Cake', 'escrpition of Oreo Cake', 1350, 'https://i0.wp.com/sweetlycakes.com/wp-content/uploads/2023/07/chocolateoreocake-6-1.jpg?fit=1200%2C1800&ssl=1', true, 'Exclusive', 'O120', 29)
const product4 = new Product('Alfajor', 'Descrpition of Alfajor', 520, 'https://pampadirect.com/product_images/uploaded_images/alfajor-negro-relleno-de-dulce-de-leche.jpg', true, 'Exclusive', 'A12', 6)
const product5 = new Product('Tarta de frutilla', 'Description of Tarta de frutilla', 1200, 'https://img-global.cpcdn.com/recipes/30b3384b01730dc4/1200x630cq70/photo.jpg', true, 'Exclusive', 'T231', 5)
const product6 = new Product('Crumble de manzana', 'Description of Crumble de manzana', 1650, 'https://assets.elgourmet.com/wp-content/uploads/2023/03/Au2uH6AGa4fRKIMETODOS2WoqKu8n4giOmH.png', true, 'Exclusive', 'C564', 29)
const product7 = new Product('Box dulce', 'Description of Box dulce', 2170, 'https://d22fxaf9t8d39k.cloudfront.net/4954c6f2fb75d1e43acd3f9c634ce3169194b92c3d3f721e68144cd6d41b0b2e2831.jpeg', true, 'Exclusive', 'B897', 4)
const product8 = new Product('Alfajor de almendras', 'Description of Alfajor de almendras', 400, 'https://lacocinadefrabisa.lavozdegalicia.es/wp-content/uploads/2021/03/alfajores-de-sabl%C3%A9-y-almendras-768x512.jpg', true, 'Exclusive', 'A36', 7)
const product9 = new Product('Torta Chococafe', 'Description of Torta Chococafe', 2010, 'https://assets.elgourmet.com/wp-content/uploads/2023/03/1bdd8a837944f3a10abc33eeb9a036f8_3_3_photo-1024x683.png.webp', true, 'Exclusive', 'T45', 10)
const product10 = new Product('Macarons', 'Description of Macarons', 300, 'https://images.hola.com/imagenes/cocina/noticiaslibros/20200529168994/macarons-recetas/0-829-535/macarons-t.jpg?tx=w_1200', true, 'Exclusive', 'M56', 14)
