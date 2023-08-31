import 'dotenv/config'
import mongoose from 'mongoose'
import { userModel } from '../src/persistencia/mongoDB/models/user.js'
import { cartModel } from '../src/persistencia/mongoDB/models/carts.js'
import { productModel } from '../src/persistencia/mongoDB/models/products.js'

before(async () => {
    await mongoose.connect(process.env.URL_MONGOOSE)
})

after(async () => {
    await mongoose.connection.close()
})

// Borra colección NO USAR

/*export const dropUser = async () => {
    await userModel.collection.drop()
}

export const dropProduct = async () => {
    await productModel.collection.drop()
}

export const dropCart = async () => {
    await cartModel.collection.drop()
}*/