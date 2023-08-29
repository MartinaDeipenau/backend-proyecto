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

        //Verifico campos obligatorios

        if (
            !product.title ||
            !product.description ||
            !product.price ||
            !product.status ||
            !product.category ||
            !product.code ||
            !product.stock
        ) {
            return console.log('required properties')
        }

        const validCode = this.products.find((ele) => ele.code === product.code)

        if (validCode) {
            return console.log('Producto existente')
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
        const result = productByid !== undefined ? productByid : 'Product not found'
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

            return 'Product successfully'
        } else {
            return 'Product not found'
        }
    }

    async deleteProduct(id) {
        const productTXT = await fs.readFile(this.path, 'utf-8')
        this.products = JSON.parse(productTXT)

        const filteredProducts = this.products.filter(
            (ele) => ele.id !== parseInt(id))
        this.products = filteredProducts

        await fs.writeFile(this.path, JSON.stringify(this.products))

        return 'Product deleted'
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

const product1 = new Product("Lemon Pie", "Descrpition of Lemon Pie", 1500, "lemonpie.jpg", true, "Exclusive", "L12", 11)
const product2 = new Product("Cheesecake", "Descrpition of Cheesecake", 1800, "cheesecake.jpg", true, "Exclusive", "C12", 32)
const product3 = new Product("Oreo Cake", "Descrpition of Oreo Cake", 1350, "oreocake.jpg", true, "Exclusive", "O120", 29)
const product4 = new Product("Alfajor", "Descrpition of Alfajor", 520, "alfajor.jpg", true, "Exclusive", "A12", 6)
const product5 = new Product("Tarta de frutilla", "Description of Tarta de frutilla", 1200, "tartadefrutilla.jpg", true, "Exclusive", "T231", 5)
const product6 = new Product("Crumble de manzana", "Description of Crumble de manzana", 1650, "crumbledemanzana.jpg", true, "Exclusive", "C564", 29)
const product7 = new Product("Box dulce", "Description of Box dulce", 2170, "boxdulce.jpg", true, "Exclusive", "B897", 4)
const product8 = new Product("Alfajor de almendras", "Description of Alfajor de almendras", 400, "alfajordealmendras.jpg", true, "Exclusive", "A36", 7)
const product9 = new Product("Torta Chococafe", "Description of Torta Chococafe", 2010, "tortachococafe.jpg", true, "Exclusive", "T45", 10)
const product10 = new Product("Macarons", "Description of Macarons", 300, "macarons.jpg", true, "Exclusive", "M56", 14)