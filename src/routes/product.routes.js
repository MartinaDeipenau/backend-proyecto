import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import {
  getAllProducts,
  getProductById,
  postNewProduct,
  putProduct,
  deleteProduct,
} from '../controllers/product.controller.js'

const productsRouters = Router()

productsRouters.get('/', getAllProducts)

productsRouters.get('/:id', getProductById)

productsRouters.post('/', auth(['admin, premium']), postNewProduct)

productsRouters.put('/:id', auth(['admin']), putProduct)

productsRouters.delete('/:id', auth(['admin']), deleteProduct)


export default productsRouters