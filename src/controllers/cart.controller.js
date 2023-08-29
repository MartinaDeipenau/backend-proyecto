import { v4 as uniqueCodeId } from 'uuid'
import CustomError from '../errors/customError.js'
import EError from '../errors/enumError.js'
import { generateErrorAddProductToCart } from '../errors/infoError.js'
import { newCart, getCart, updateCart } from '../persistencia/DAOs/mongoDAO/cartMongo.js'
import { getUsersByCustomFilter } from '../persistencia/DAOs/mongoDAO/userMongo.js'
import { newOrder } from '../persistencia/DAOs/mongoDAO/ordersMongo.js'
import {
    getProductsById,
    updateProduct,
} from '../persistencia/DAOs/mongoDAO/productMongo.js'

// Create a new cart 

export const createCart = async (res, req) => {
    try {
        const cart = await newCart()
        res.status(200).send(cart)
    } catch (error) {
        res.status(500).send('Error creating cart')
    }
}


export const getProducFromCart = async (req, res) => {
    const cid = req.params.cid

    try {
        const products = await getCart({ _id: cid })
        res.status(200).send(products)
    } catch (error) {
        res.status(500).send('Error getting products from cart')
    }
}

export const deleteAllProducsFromCart = async (req, res) => {
    const cid = req.params.cid
    const cart = await getCart({ _id: cid })

    try {
        cart.products = []

        await updateCart({ _id: cid }, cart)

        res.status(200).send(cart)
    } catch (error) {
        res.status(500).send('Error deleteting products from cart')
    }
}


export const addProductToCart = async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    const { quantity } = req.body
    const cart = await getCart({ _id: cid })

    try {
        if (product._id === undefined || quantity <= 0) {
            CustomError.createError({
                name: 'Error de creacion del producto',
                cause: generateErrorAddProductToCart({
                    product,
                }),
                message: 'Error al agregar producto al carrito',
                code: EError.INVALID_ARGUMENT
            })
        }

        const Addproducts = {
            id_product: pid,
            quantity: quantity,
        }

        cart.products.push(Addproducts)

        await updateCart({ _id: cid }, cart)

        res.status(200).send('Product added to cart')
    } catch (error) {
        next(error)
    }
}


export const updateQuantity = async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    const { quantity } = req.body
    const cart = await getCart({ _id: cid })

    try {
        const updateProduct = cart.products
        const productIndex = updateProduct.findIndex(
            (prod) => prod.id_product == pid
        )

        updateProduct[productIndex].quantity = quantity

        await updateCart({ _id: cid }, { products: updateProduct })

        res.status(200).send('Updated product quantities successfully')
    } catch (error) {
        res.status(500).send('Error updating product quantities' + error)
    }
}
//delete one product of cart

export const deleteProductFromCart = async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    const cart = await getCart({ _id: cid })

    try {
        const productUpdate = cart.products



        const productIndex = productUpdate.findIndex(
            (prod) => prod.id_product == pid
        )



        productUpdate.splice(productIndex, 1)

        await updateCart({ _id: cid }, { products: productUpdate })

        res.status(200).send('Product removed successfully')
    } catch (error) {
        res.status(500).send('Error removing product' + error)
    }
}

// New Orders

export const generatePucharse = async (req, res) => {
    const cid = req.params.cid
    const cart = await getCart({ _id: cid })
    const user = await getUsersByCustomFilter({ cart: cid })
    const productWithoutStock = []
    const productWithStockID = []
    let totalAmount = 0


    try {
        if (user) {
            for (const product of cart.products) {
                const quantity = product.quantity
                const productId = product.id_product
                const productData = await getProductsById(productId)

                if (productData.stock === 0) {
                    productWithoutStock.push(productData)
                    continue
                } else {
                    productWithStockID.push(productData._id)
                }

                productData.stock -= quantity
                await updateProduct(productId, { stock: productData.stock })


                const Subtotal = productData.price * quantity
                totalAmount += Subtotal


                const toUpdateCart = { $pull: { products: { id_product: productId } } }
                await updateCart({ _id: cid }, toUpdateCart)
            }

            const generateNewOrder = await newOrder({
                code: uniqueCodeId(),
                pucharse_datetime: new Date(),
                amount: totalAmount,
                purchaser: user.email,
            })

            res.status(200).send(productWithoutStock)
        } else {
            console.log('User no auth')
        }
    } catch (err) {
        res.status(500).send('Erro generating order' + err)
    }
}