import { Router } from 'express'
import { generateProduct } from '../utils/faker.js'

const mockingProductsRouter = Router()

mockingProductsRouter.get('/', async (req, res) => {
    let product = []
    try {
        for (let i = 0; i < 100; i += 1) {
            product.push(generateProduct())
        }
        res.status(200).send(product)
    } catch (error) {
        res.status(400).send(error)
    }
})

export default mockingProductsRouter