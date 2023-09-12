import { expect } from "chai"
import supertest from "supertest"

const requester = supertest('http://localhost:4000')

describe('Test cart routes', () => {
    it('[POST] api/cart/:cid/product/:pid Éxito al agregar el producto al carrito', async () => {
        const response = await requester
            .post('/api/carts/64e9acb1a418531df82e40cd/product/64e9acb1a418531df82e40cd')
            .send({ quantity: 1 })
        expect(response.statusCode).to.be.eql(200)
        expect(response.text).to.equal('Producto añadido al carrito')
    })

    it('[POST] api/cart/:cid/product/:pid Error al agregar producto (Quantity = 0', async () => {
        const response = await requester
            .post('/api/carts/64e9acb1a418531df82e40cd/product/64e9acb1a418531df82e40cd')
            .send({ quantity: 0 })
        expect(response.body.error).to.be.eql('Error al crear el producto')
    })

    it('[DELETE] api/cart/:cid/product/:pid Eliminar un producto de un carrito', async () => {
        const response = await requester
            .delete('/api/carts/64e9acb1a418531df82e40cd/64e9acb1a418531df82e40cd')
        expect(response.statusCode).to.be.eql(200)
        expect(response.text).to.be.equal('Producto eliminado con éxito')
    })
})
