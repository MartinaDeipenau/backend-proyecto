import { promises as fs } from 'fs'

export class CartsManager {
  constructor(path) {
    this.path = path
  }

  static increment() {
    this.idIncrement ? this.idIncrement++ : (this.idIncrement = 1)

    return this.idIncrement
  }

  async createCart() {
    const cartTxt = await fs.readFile(this.path, 'utf8')
    const carts = JSON.parse(cartTxt)

    const cart = {
      id: CartsManager.increment(),
      products: [],
    }

    carts.push(cart)
    await fs.writeFile(this.path, JSON.stringify(carts))
    return 'Cart created'
  }

  async getCartById(id) {
    const cartTxt = await fs.readFile(this.path, 'utf-8')
    const carts = JSON.parse(cartTxt)
    const cartByid = carts.find((cart) => cart.id === parseInt(id))
    const result = cartByid !== undefined ? cartByid : 'Not found'

    return result
  }

  async addProductToCart(cid, pid, { quantity }) {
    const cartTxt = await fs.readFile(this.path, 'utf-8')
    const carts = JSON.parse(cartTxt)
    const cartByid = carts.find((cart) => cart.id === parseInt(cid)) 
    const products = cartByid.products 

    const productIndex = products.findIndex(
      (prod) => prod.product === parseInt(pid)
    )
    if (productIndex === -1) {
      const prod = {
        product: parseInt(pid),
        quantity: 1,
      }
      cartByid.products.push(prod)
    } else {
      products[productIndex].quantity += quantity
    }
    await fs.writeFile(this.path, JSON.stringify(carts))
  }
}