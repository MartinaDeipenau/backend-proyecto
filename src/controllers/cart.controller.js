import { v4 as uniqueCodeId } from 'uuid'
import { transporter } from '../utils/nodemailer.js'
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
        res.status(500).send('Error al crear carrito')
    }
}


export const getProducFromCart = async (req, res) => {
    const cid = req.params.cid

    let totalAmount = 0

    try {
        const products = await getCart(cid, "products.id_product")
        for (const product of products.products) {
            const quantity = product.quantity
            const productId = product.id_product
            const productData = await getProductsById(productId)
            const Subtotal = productData.price * quantity
            totalAmount += Subtotal
        }
        res.status(200).render('cart', { cart: products, user: req.session.user, total: totalAmount })
    } catch (error) {
        res.status(500).send('Error al obtener productos del carrito')
    }
}

export const deleteAllProducsFromCart = async (req, res) => {
    const cid = req.params.cid
    const cart = await getCart({ _id: cid })

    try {
        cart.products = []

        await updateCart({ _id: cid }, cart)

        res.status(200).redirect('/api/products')
    } catch (error) {
        res.status(500).send('Error al eliminar productos del carrito')
    }
}


// add Products and quantity to cart (quantity is required)

export const addProductToCart = async (req, res, next) => {
    const cid = req.params.cid
    const pid = req.params.pid
    const { quantity } = req.body
    const cart = await getCart({ _id: cid })
    const products = cart.products
    const productIndex = products.findIndex(
      (prod) => prod.id_product == pid
    )
    const product = await getProductsById({ _id: pid })

    try {
        if (product._id === undefined || quantity <= 0 || quantity === undefined) {
            CustomError.createError({
                name: 'Error de creacion del producto',
                cause: generateErrorAddProductToCart({
                    product,
                }),
                message: 'Error al agregar producto al carrito',
                code: EError.INVALID_ARGUMENT
            })
        }
        if (productIndex === -1) {
            const Addproducts = {
                id_product: pid,
                quantity: quantity
            }
            cart.products.push(Addproducts)
            await updateCart({ _id: cid }, cart)
        } else {
            const newQuanty = products[productIndex].quantity + parseInt(quantity)
            products[productIndex].quantity = newQuanty
            await updateCart({ _id: cid }, { products: products })
        }
        res.status(200).redirect(`/api/carts/${cid}`)
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

        res.status(200).redirect(`/api/carts/${cid}`)
    } catch (error) {
        res.status(500).send('Error al actualizar las cantidades de productos' + error)
    }
}

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

        res.status(200).redirect(`/api/carts/${cid}`)
    } catch (error) {
        res.status(500).send('Error al eliminar el producto' + error)
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
            if (user.role != 'admin') {
                await transporter.sendMail({
                    to: user.email,
                    subject: `Recibo de compra`,
                    text: `
                    Gracias por tu compra, ${user.first_name}
                    Número de recibo: ${generateNewOrder.code}
                    El total de tu compra es de : ${generateNewOrder.amount}
                    `
                })
            }

            res.status(200).render('purchase', { orders: generateNewOrder })
        } else {
            console.log('Usuario sin autenticación')
        }
    } catch (error) {
        res.status(500).send('Error al generar la orden' + error)
    }
}