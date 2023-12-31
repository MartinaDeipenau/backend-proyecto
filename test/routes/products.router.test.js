import { expect } from "chai";
import supertest from "supertest";
import { deleteProduct } from '../../src/persistencia/DAOs/mongoDAO/productMongo.js'

const requester = supertest('http://localhost/4000')

describe('Test product routes', () => {
    it('[GET] api/products Obtener todos los productos de la base de datos', async () => {
        const response = await requester.get('/api/products/')

        expect(response.statusCode).to.be.eql(200)
        expect(response).to.be.ok
    })

    it('[GET] api/products/:id Obtener producto por ID', async () => {
        const response = await requester.get('/api/products/646f48b0c0017679d4336cdb')

        expect(response.type).to.be.eql('text/html')
        expect(response.charset).to.be.eql('utf-8')
        expect(response.statusCode).to.be.eql(200)
        expect(response).to.be.ok;

    })

    it('[POST] Crear un nuevo producto en la base de datos', async () => {
        const mockNewProduct = {
            title: "TestProduct",
            description: "Test description",
            price: 1,
            category: "Test category",
            code: "TestCode789",
            stock: 3,
        }
        const response = await requester.post('/api/products').send(mockNewProduct)
        expect(response.statusCode).to.be.eql(200)
        const product = await deleteProduct({ title: mockNewProduct.title })
    })
})