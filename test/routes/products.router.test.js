import { expect } from "chai";
import supertest from "supertest";
import { deleteProduct } from '../../src/persistencia/DAOs/mongoDAO/productMongo.js'

const requester = supertest('http://localhost/4000')

describe('Test product routes', () => {
    it('[GET] api/product Obtener todos los productos de la base de datos', async () => {
        const response = await requester.get('/api/products')

        expect(response.type).to.be.eql('text/html')
        expect(response.charset).to.be.eql('utf-8')
        expect(response.statusCode).to.be.eql(200)
        expect(response).to.be.ok
    })

    it('[POST] Crear un nuevo producto en la base de datos', async () => {
        const mockNewProduct = {
            title: "TestProd",
            description: "Test description",
            price: 5,
            category: "Test category",
            code: "TestCode789",
            stock: 6
        }
        const response = await requester.post('/api/products').send(mockNewProduct)
        expect(response.statusCode).to.be.eql(200)
        const product = await deleteProduct({ title: mockNewProduct.title })
    })
})